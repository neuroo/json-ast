// import util from 'util';
import {tokenTypes} from './tokenize';

function findLastTokenIndexIn(tokenList, tokenTypes) {
  let rindex = tokenList.length - 1;
  let rtoken_type;
  while (rindex >= 0) {
    rtoken_type = tokenList[rindex].type;
    if (tokenTypes.indexOf(rtoken_type) >= 0) {
      return rindex;
    }
    rindex--;
  }
  return -1;
}

// Only called when the junker settings is set to true. It balances the
// arrays/objects so there is no extra tokens left in the list.
function balancer(tokenList, settings) {
  let token = null;
  let index = 0;
  const max_index = tokenList.length;
  let newTokenList = [];
  let state = {brace : 0, bracket : 0};

  // Find the last real token we care about.
  const last_balanced_token = findLastTokenIndexIn(tokenList, [
    tokenTypes.LEFT_BRACE, tokenTypes.RIGHT_BRACE, tokenTypes.LEFT_BRACKET,
    tokenTypes.RIGHT_BRACKET
  ]);

  // Recover from extra closing braces/brackets
  while (index <= last_balanced_token) {
    token = tokenList[index];
    switch (token.type) {
    case tokenTypes.LEFT_BRACE:
      state.brace++;
      newTokenList.push(token);
      break;
    case tokenTypes.RIGHT_BRACE:
      if (state.brace === 0) {
        // nothing to close
      } else {
        state.brace--;
        newTokenList.push(token);
      }
      break;
    case tokenTypes.LEFT_BRACKET:
      state.bracket++;
      newTokenList.push(token);
      break;
    case tokenTypes.RIGHT_BRACKET:
      if (state.bracket === 0) {
        // nothing to close
      } else {
        state.bracket--;
        newTokenList.push(token);
      }
      break;
    default:
      newTokenList.push(token);
      index++;
      continue;
    }

    index++;
  }

  while (index < max_index) {
    newTokenList.push(tokenList[index]);
    index++;
  }

  // Recover from missing closing braces/brackets, at the end only
  if (state.brace > 0 || state.bracket > 0) {

    if (state.brace > 0) {
      let last_brace_index =
          findLastTokenIndexIn(tokenList, [ tokenTypes.RIGHT_BRACE ]);
      let using_right_brace = null;
      if (last_brace_index < 0) {
        // no last brace, so we'll need to create a new one
        const last_opening_brace_index =
            findLastTokenIndexIn(tokenList, [ tokenTypes.LEFT_BRACE ]);
        using_right_brace =
            Object.assign({}, tokenList[last_opening_brace_index]);
        using_right_brace.type = tokenTypes.RIGHT_BRACE;
      } else {
        using_right_brace = tokenList[last_brace_index];
      }

      while (state.brace > 0) {
        if (last_brace_index < 0) {
          newTokenList.push(using_right_brace);
        } else {
          newTokenList.splice(last_brace_index + 1, 0, using_right_brace);
        }
        state.brace--;
      }
    }

    if (state.bracket > 0) {
      let last_bracket_index =
          findLastTokenIndexIn(tokenList, [ tokenTypes.RIGHT_BRACKET ]);
      let using_right_bracket = null;
      if (last_bracket_index < 0) {
        // no last brace, so we'll need to create a new one
        const last_opening_bracket_index =
            findLastTokenIndexIn(tokenList, [ tokenTypes.LEFT_BRACKET ]);
        using_right_bracket =
            Object.assign({}, tokenList[last_opening_bracket_index]);
        using_right_bracket.type = tokenTypes.RIGHT_BRACKET;
      } else {
        using_right_bracket = tokenList[last_bracket_index];
      }

      while (state.bracket > 0) {
        if (last_bracket_index < 0) {
          newTokenList.push(using_right_bracket);
        } else {
          newTokenList.splice(last_bracket_index + 1, 0, using_right_bracket);
        }
        state.bracket--;
      }
    }
  }

  // console.log('[JUNKER] :=',
  //            util.inspect(newTokenList, {colors : true, depth : 2}));

  return newTokenList;
}

const TOKEN_TERMINALS = [
  tokenTypes.STRING,
  tokenTypes.NUMBER,
  tokenTypes.TRUE,
  tokenTypes.FALSE,
  tokenTypes.NULL,
];

// Returns true if two consecutive terminals are found in the JSON
function is_double_value_pattern(tokenList, index) {
  if (index >= tokenList.length - 1)
    return false;
  let currentToken = tokenList[index];
  let nextToken = tokenList[index + 1];
  return TOKEN_TERMINALS.indexOf(currentToken.type) >= 0 &&
         TOKEN_TERMINALS.indexOf(nextToken.type) >= 0;
}

const RIGHT_BRACE_BRACKETS =
    [ tokenTypes.RIGHT_BRACKET, tokenTypes.RIGHT_BRACE ];
const LEFT_BRACE_BRACKETS = [ tokenTypes.LEFT_BRACKET, tokenTypes.LEFT_BRACE ];

function is_confused_terminators(tokenList, index) {
  if (index >= tokenList.length - 1)
    return false;
  let currentToken = tokenList[index];
  let nextToken = tokenList[index + 1];

  return RIGHT_BRACE_BRACKETS.indexOf(currentToken.type) >= 0 &&
         LEFT_BRACE_BRACKETS.indexOf(nextToken.type) >= 0;
}

function is_terminator_and_value(tokenList, index) {
  if (index >= tokenList.length - 1)
    return false;
  let currentToken = tokenList[index];
  let nextToken = tokenList[index + 1];

  return RIGHT_BRACE_BRACKETS.indexOf(currentToken.type) >= 0 &&
         TOKEN_TERMINALS.indexOf(nextToken.type) >= 0;
}

function comma_injection(tokenList, settings) {
  let newTokenList = [];
  var token = null;
  var index = 0;
  const max_index = tokenList.length;

  // The first phase find all the potential error locations in term of indexes
  // where a missing separator (colon/comma) is missing. We know that each
  // terminal has to be separated. In addition to reporting these locations,
  // we'll also look at the cases where we have two different brace/bracket
  // directions (e.g., [...right-X, left-X...])
  // We then report for cases like this:
  //     }[, ]{
  while (index < max_index) {
    newTokenList.push(tokenList[index]);

    if (index <= max_index - 2 && (is_double_value_pattern(tokenList, index) ||
                                   is_confused_terminators(tokenList, index) ||
                                   is_terminator_and_value(tokenList, index))) {
      let comma_token = Object.assign({}, tokenList[index]);
      comma_token.type = tokenTypes.COMMA;
      newTokenList.push(comma_token);
    }
    index++;
  }

  // console.log('[JUNKER] :=',
  //            util.inspect(newTokenList, {colors : true, depth : 2}));
  return newTokenList;
}

// Quote identifiers taht seem to be used as keys
function quote_keys(tokenList, settings) {
  let newTokenList = [];
  var token = null;
  var index = 0;
  const max_index = tokenList.length;

  while (index < max_index) {
    token = tokenList[index];
    if (token.type === tokenTypes.IDENTIFIER) {
      let string_token = Object.assign({}, token);
      string_token.type = tokenTypes.STRING;
      newTokenList.push(string_token);
    } else {
      newTokenList.push(tokenList[index]);
    }
    index++;
  }
  return newTokenList;
}

// The list of junker processes that are available
const JUNKER_PROCESSES = [
  // The balance must be the first process
  balancer,
  // Enforce quotes around keys in the JSON
  quote_keys,
  // The comma injection should happen after everything
  comma_injection
];

// Running all the junker processes. These are responsible for achieving one
// specific thing.
export function junker(tokenList, settings) {
  if (settings.junker === false)
    return tokenList;
  var resultTokens = tokenList;
  for (var i = 0; i < JUNKER_PROCESSES.length; i++) {
    let processor = JUNKER_PROCESSES[i];
    try {
      let tmpResultTokens = processor(resultTokens, settings);
      resultTokens = tmpResultTokens;
    } catch (e) {
      console.error(e);
      continue;
    }
  }
  return resultTokens;
}
