import Position from './position';
import error from './error';
import parseErrorTypes from './parseErrorTypes';
import {tokenize, tokenTypes} from './tokenize';
import {nodeTypes, NodeFactory, JsonNode} from './ast';

// import util from 'util';

const objectStates = {
  _START_ : 0,
  OPEN_OBJECT : 1,
  KEY : 2,
  COLON : 3,
  VALUE : 4,
  COMMA : 5
};

const arrayStates = {
  _START_ : 0,
  OPEN_ARRAY : 1,
  VALUE : 2,
  COMMA : 3
};

const defaultSettings = {
  verbose : true,
  junker : false
};

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
function junker(tokenList, settings) {
  if (settings.junker === false)
    return tokenList;

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

function parseObject(source, tokenList, index, settings) {
  let startToken;
  let property;
  let object = new NodeFactory.fromType(nodeTypes.OBJECT);

  let state = objectStates._START_;
  let token;

  while (index < tokenList.length) {
    token = tokenList[index];

    if (token.type === tokenTypes.COMMENT) {
      let comment = new NodeFactory.fromType(nodeTypes.COMMENT, token.value);
      if (settings.verbose) {
        comment.position = token.position;
      }
      object.comments.push(comment)
      index++;
      continue;
    }

    switch (state) {
    case objectStates._START_:
      if (token.type === tokenTypes.LEFT_BRACE) {
        startToken = token;
        state = objectStates.OPEN_OBJECT;
        index++;
      } else {
        return null;
      }
      break;

    case objectStates.OPEN_OBJECT:
      if (token.type === tokenTypes.STRING) {
        property = new NodeFactory.fromType(nodeTypes.PROPERTY);
        property.key = new NodeFactory.fromType(nodeTypes.KEY, token.value);

        if (settings.verbose) {
          property.key.position = token.position;
        }
        state = objectStates.KEY;
        index++;
      } else if (token.type === tokenTypes.RIGHT_BRACE) {
        if (settings.verbose) {
          object.position = new Position(
              startToken.position.start.line, startToken.position.start.column,
              startToken.position.start.char, token.position.end.line,
              token.position.end.column, token.position.end.char);
        }
        index++;
        return {value : object, index : index};
      } else {
        error(parseErrorTypes.unexpectedToken(
                  source.substring(token.position.start.char,
                                   token.position.end.char),
                  token.position.start.line, token.position.start.column),
              source, token.position.start.line, token.position.start.column);
      }
      break;

    case objectStates.KEY:
      if (token.type === tokenTypes.COLON) {
        state = objectStates.COLON;
        index++;
      } else {
        error(parseErrorTypes.unexpectedToken(
                  source.substring(token.position.start.char,
                                   token.position.end.char),
                  token.position.start.line, token.position.start.column),
              source, token.position.start.line, token.position.start.column);
      }
      break;

    case objectStates.COLON:
      let value = parseValue(source, tokenList, index, settings);
      index = value.index;
      property.value = value.value;

      object.properties.push(property);
      state = objectStates.VALUE;
      break;

    case objectStates.VALUE:
      if (token.type === tokenTypes.RIGHT_BRACE) {
        if (settings.verbose) {
          object.position = new Position(
              startToken.position.start.line, startToken.position.start.column,
              startToken.position.start.char, token.position.end.line,
              token.position.end.column, token.position.end.char);
        }
        index++;
        return {value : object, index : index};
      } else if (token.type === tokenTypes.COMMA) {
        state = objectStates.COMMA;
        index++;
      } else {
        error(parseErrorTypes.unexpectedToken(
                  source.substring(token.position.start.char,
                                   token.position.end.char),
                  token.position.start.line, token.position.start.column),
              source, token.position.start.line, token.position.start.column);
      }
      break;

    case objectStates.COMMA:
      if (token.type === tokenTypes.STRING) {
        property = new NodeFactory.fromType(nodeTypes.PROPERTY);
        property.key = new NodeFactory.fromType(nodeTypes.KEY, token.value);

        if (settings.verbose) {
          property.key.position = token.position;
        }
        state = objectStates.KEY;
        index++;
      } else if (token.type === tokenTypes.COMMA ||
                 token.type === tokenTypes.RIGHT_BRACE) {
        // Allow trailing commas
        state = objectStates.VALUE;
        // index++;
        continue;
      } else {
        error(parseErrorTypes.unexpectedToken(
                  source.substring(token.position.start.char,
                                   token.position.end.char),
                  token.position.start.line, token.position.start.column),
              source, token.position.start.line, token.position.start.column);
      }
      break;
    }
  }

  error(parseErrorTypes.unexpectedEnd());
}

function parseArray(source, tokenList, index, settings) {
  let startToken;
  let array = new NodeFactory.fromType(nodeTypes.ARRAY);
  let state = arrayStates._START_;
  let token;

  while (index < tokenList.length) {
    token = tokenList[index];
    if (token.type === tokenTypes.COMMENT) {
      let comment = new NodeFactory.fromType(nodeTypes.COMMENT, token.value);
      if (settings.verbose) {
        comment.position = token.position;
      }
      array.comments.push(comment)
      index++;
      continue;
    }

    switch (state) {
    case arrayStates._START_:
      if (token.type === tokenTypes.LEFT_BRACKET) {
        startToken = token;
        state = arrayStates.OPEN_ARRAY;
        index++;
      } else {
        return null;
      }
      break;

    case arrayStates.OPEN_ARRAY:
      if (token.type === tokenTypes.RIGHT_BRACKET) {
        if (settings.verbose) {
          array.position = new Position(
              startToken.position.start.line, startToken.position.start.column,
              startToken.position.start.char, token.position.end.line,
              token.position.end.column, token.position.end.char);
        }
        index++;
        return {value : array, index : index};
      } else {
        let value = parseValue(source, tokenList, index, settings);
        index = value.index;
        array.items.push(value.value);
        state = arrayStates.VALUE;
      }
      break;

    case arrayStates.VALUE:
      if (token.type === tokenTypes.RIGHT_BRACKET) {
        if (settings.verbose) {
          array.position = new Position(
              startToken.position.start.line, startToken.position.start.column,
              startToken.position.start.char, token.position.end.line,
              token.position.end.column, token.position.end.char);
        }
        index++;
        return {value : array, index : index};
      } else if (token.type === tokenTypes.COMMA) {
        state = arrayStates.COMMA;
        index++;
      } else {
        error(parseErrorTypes.unexpectedToken(
                  source.substring(token.position.start.char,
                                   token.position.end.char),
                  token.position.start.line, token.position.start.column),
              source, token.position.start.line, token.position.start.column);
      }
      break;

    case arrayStates.COMMA:
      // Allow for trailing commas and too many commas
      if (token.type === tokenTypes.COMMA ||
          token.type === tokenTypes.RIGHT_BRACKET) {
        state = arrayStates.VALUE;
        continue;
      }
      let value = parseValue(source, tokenList, index, settings);
      index = value.index;
      array.items.push(value.value);
      state = arrayStates.VALUE;
      break;
    }
  }

  error(parseErrorTypes.unexpectedEnd());
}

function parseValue(source, tokenList, index, settings) {
  // value: object | array | STRING | NUMBER | TRUE | FALSE | NULL | COMMENT
  let token = tokenList[index];
  let tokenType;

  switch (token.type) {
  case tokenTypes.STRING:
    tokenType = 'string';
    break;
  case tokenTypes.NUMBER:
    tokenType = 'number';
    break;
  case tokenTypes.TRUE:
    tokenType = 'true';
    break;
  case tokenTypes.FALSE:
    tokenType = 'false';
    break;
  case tokenTypes.NULL:
    tokenType = 'null';
    break;
  case tokenTypes.COMMENT:
    tokenType = 'comment';
    break;
  default:
    break;
  }

  if (tokenType) {
    index++;
    let value = new NodeFactory.fromType(tokenType, token.value);
    if (settings.verbose) {
      value.position = token.position;
    }
    return {value : value, index : index};
  } else {
    let objectOrValue = parseObject(source, tokenList, index, settings) ||
                        parseArray(source, tokenList, index, settings);

    if (objectOrValue) {
      return objectOrValue;
    } else {
      error(parseErrorTypes.unexpectedToken(
                source.substring(token.position.start.char,
                                 token.position.end.char),
                token.position.start.line, token.position.start.column),
            source, token.position.start.line, token.position.start.column);
    }
  }
}

function parseDocument(source, tokenList, index, settings) {
  // value: value | COMMENT*
  let token = tokenList[index];
  let tokenType = token.type;

  let doc = new NodeFactory.fromType(nodeTypes.DOCUMENT);

  while (tokenType === tokenTypes.COMMENT) {
    let comment = new NodeFactory.fromType(nodeTypes.COMMENT, token.value);
    if (settings.verbose) {
      comment.position = token.position;
    }
    doc.comments.push(comment);
    index++;
    token = tokenList[index];
    tokenType = token.type;
  }

  doc.child = parseValue(source, tokenList, index, settings);

  if (doc.child.index !== tokenList.length) {
    index = doc.child.index;

    while (index < tokenList.length &&
           tokenList[index].type === tokenTypes.COMMENT) {
      token = tokenList[index];
      tokenType = token.type;
      doc.child.index = index;

      let comment = new NodeFactory.fromType(nodeTypes.COMMENT, token.value);
      if (settings.verbose) {
        comment.position = token.position;
      }
      doc.comments.push(comment);
      index++;
    }
    doc.child.index = index;
  }

  const final_index = doc.child.index;
  if (!(doc.child instanceof JsonNode) && doc.child.value) {
    doc.child = doc.child.value;
  }
  return {value : doc, index : final_index};
}

export function parse(source, settings) {
  settings = Object.assign({}, defaultSettings, settings);

  let tokenList = tokenize(source);

  if (tokenList.length === 0) {
    error(parseErrorTypes.unexpectedEnd());
  }

  if (settings.junker === true) {
    tokenList = junker(tokenList, settings);
  }

  let value = parseDocument(source, tokenList, 0, settings);

  if (value.index === tokenList.length || settings.junker === true) {
    return value.value;
  } else {
    let token = tokenList[value.index];
    error(parseErrorTypes.unexpectedToken(
              source.substring(token.position.start.char,
                               token.position.end.char),
              token.position.start.line, token.position.start.column),
          source, token.position.start.line, token.position.start.column);
  }
}
