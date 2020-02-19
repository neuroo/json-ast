import { error } from "./error";
import { JsonPosition } from "./position";
import { cannotTokenizeSymbol } from "./tokenizeErrorTypes";
import { JsonToken, ParseSettings } from "./types";

export enum JsonTokenTypes {
  COMMENT = "COMMENT", // // ... \n\r? or /* ... */
  LEFT_BRACE = "LEFT_BRACE", // {
  RIGHT_BRACE = "RIGHT_BRACE", // }
  LEFT_BRACKET = "LEFT_BRACKET", // [
  RIGHT_BRACKET = "RIGHT_BRACKET", // ]
  COLON = "COLON", //  :
  COMMA = "COMMA", // ,
  STRING = "STRING", //
  NUMBER = "NUMBER", //
  TRUE = "TRUE", // true
  FALSE = "FALSE", // false
  NULL = "NULL", // null
  IDENTIFIER = "IDENTIFIER", // identifiers
}

interface ParseJsonToken {
  type: JsonTokenTypes;
  value: string;
  line: number;
  index: number;
  column: number;
}

const charTokens = {
  "{": JsonTokenTypes.LEFT_BRACE,
  "}": JsonTokenTypes.RIGHT_BRACE,
  "[": JsonTokenTypes.LEFT_BRACKET,
  "]": JsonTokenTypes.RIGHT_BRACKET,
  ":": JsonTokenTypes.COLON,
  ",": JsonTokenTypes.COMMA,
};

const keywordsTokens = {
  true: JsonTokenTypes.TRUE,
  false: JsonTokenTypes.FALSE,
  null: JsonTokenTypes.NULL,
};

const stringStates = {
  _START_: 0,
  START_QUOTE_OR_CHAR: 1,
  ESCAPE: 2,
};

const escapes = {
  '"': 0, // Quotation mask
  "\\": 1, // Reverse solidus
  "/": 2, // Solidus
  b: 3, // Backspace
  f: 4, // Form feed
  n: 5, // New line
  r: 6, // Carriage return
  t: 7, // Horizontal tab
  u: 8, // 4 hexadecimal digits
};

// Support regex
["d", "D", "w", "W", "s", "S"].forEach((d, i) => {
  escapes[d] = i;
});

const numberStates = {
  _START_: 0,
  MINUS: 1,
  ZERO: 2,
  DIGIT: 3,
  POINT: 4,
  DIGIT_FRACTION: 5,
  EXP: 6,
  EXP_DIGIT_OR_SIGN: 7,
};

// HELPERS

function isDigit1to9(char): boolean {
  return char >= "1" && char <= "9";
}

function isDigit(char): boolean {
  return char >= "0" && char <= "9";
}

function isLetter(char): boolean {
  return (char >= "a" && char <= "z") || (char >= "A" && char <= "Z");
}

function isHex(char): boolean {
  return isDigit(char) || (char >= "a" && char <= "f") || (char >= "A" && char <= "F");
}

function isExp(char): boolean {
  return char === "e" || char === "E";
}

// PARSERS

function parseWhitespace(
  source: string,
  index: number,
  line: number,
  column: number,
): Omit<ParseJsonToken, "type" | "value"> | null {
  const char = source.charAt(index);

  if (char === "\r") {
    // CR (Unix)
    index++;
    line++;
    column = 1;
    if (source.charAt(index + 1) === "\n") {
      // CRLF (Windows)
      index++;
    }
  } else if (char === "\n") {
    // LF (MacOS)
    index++;
    line++;
    column = 1;
  } else if (char === "\t" || char === " ") {
    index++;
    column++;
  } else {
    return null;
  }

  return { index, line, column };
}

function parseComment(source: string, index: number, line: number, column: number): ParseJsonToken | null {
  const sourceLength = source.length;
  let char = source.charAt(index);
  if (char === "/") {
    let next_char = source.charAt(index + 1) || "";
    if ("/" === next_char) {
      // Unroll until the end of the line
      const first_index = index + 2;
      let last_index = index + 2;
      index += 2;

      while (index < sourceLength) {
        char = source.charAt(index);
        if (char === "\r") {
          last_index = index;
          index++;
          line++;
          column = 1;
          if (source.charAt(index + 1) === "\n") {
            // CR LF
            last_index = index;
            index++;
          }
          break;
        } else if (char === "\n") {
          last_index = index;
          index++;
          line++;
          column = 1;
          break;
        } else {
          index++;
        }
      }

      if (index >= sourceLength) {
        last_index = sourceLength;
      }

      return {
        type: JsonTokenTypes.COMMENT,
        value: source.substring(first_index, last_index).replace(/(\r\n|\n|\r)/gm, ""),
        index: index,
        line: line,
        column: column,
      };
    } else if ("*" === next_char) {
      // unroll until we find */
      const first_index = index + 2;
      let last_index = index + 2;
      index += 2;
      while (index < sourceLength) {
        char = source.charAt(index);
        if (char !== "*") {
          if (char === "\r") {
            next_char = source.charAt(index + 1) || "";
            line++;
            column = 1;
            if (next_char === "\n") {
              index++;
            }
          } else if (char === "\n") {
            line++;
            column = 1;
          }
        } else {
          next_char = source.charAt(index + 1) || "";
          if ("/" === next_char) {
            last_index = index;
            if (last_index >= sourceLength) {
              last_index = sourceLength;
            }

            return {
              type: JsonTokenTypes.COMMENT,
              value: source.substring(first_index, last_index),
              index: index + 2,
              line: line,
              column: column,
            };
          }
        }
        index++;
      }
    }
  } else {
    return null;
  }
}

function parseChar(source: string, index: number, line: number, column: number): ParseJsonToken | null {
  const char = source.charAt(index);
  if (char in charTokens) {
    return {
      type: charTokens[char],
      line: line,
      column: column + 1,
      index: index + 1,
      value: undefined,
    };
  } else {
    return null;
  }
}

function parseKeyword(source: string, index: number, line: number, column: number): ParseJsonToken | null {
  const matched = Object.keys(keywordsTokens).find(name => name === source.substr(index, name.length));

  if (matched) {
    return {
      type: keywordsTokens[matched],
      line: line,
      column: column + matched.length,
      index: index + matched.length,
      value: null,
    };
  } else {
    return null;
  }
}

function parseIdentifier(source: string, index: number, line: number, column: number): ParseJsonToken | null {
  const sourceLength = source.length;
  const startIndex = index;
  let buffer = "";

  // Must start with a letter or underscore
  const firstChar = source.charAt(index);
  if (!(isLetter(firstChar) || firstChar === "_")) return null;

  while (index < sourceLength) {
    const char = source.charAt(index);
    if (!(isLetter(char) || char === "_" || isDigit(char))) break;
    buffer += char;
    index++;
  }

  if (buffer.length > 0) {
    return {
      type: JsonTokenTypes.IDENTIFIER,
      line: line,
      column: column + index - startIndex,
      index: index,
      value: buffer,
    };
  } else {
    return null;
  }
}

function parseString(source: string, index: number, line: number, column: number): ParseJsonToken | null {
  const sourceLength = source.length;
  const startIndex = index;
  let buffer = "";
  let state = stringStates._START_;

  while (index < sourceLength) {
    const char = source.charAt(index);
    switch (state) {
      case stringStates._START_:
        if (char === '"') {
          state = stringStates.START_QUOTE_OR_CHAR;
          index++;
        } else {
          return null;
        }
        break;

      case stringStates.START_QUOTE_OR_CHAR:
        if (char === "\\") {
          state = stringStates.ESCAPE;
          buffer += char;
          index++;
        } else if (char === '"') {
          index++;
          return {
            type: JsonTokenTypes.STRING,
            value: buffer,
            line: line,
            index: index,
            column: column + index - startIndex,
          };
        } else {
          buffer += char;
          index++;
        }
        break;

      case stringStates.ESCAPE:
        if (char in escapes) {
          buffer += char;
          index++;
          if (char === "u") {
            for (let i = 0; i < 4; i++) {
              const curChar = source.charAt(index);
              if (curChar && isHex(curChar)) {
                buffer += curChar;
                index++;
              } else {
                return null;
              }
            }
          }
          state = stringStates.START_QUOTE_OR_CHAR;
        } else {
          return null;
        }
        break;
    }
  }
}

function parseNumber(source: string, index: number, line: number, column: number): ParseJsonToken | null {
  const sourceLength = source.length;
  const startIndex = index;
  let passedValueIndex = index;
  let state = numberStates._START_;

  iterator: while (index < sourceLength) {
    const char = source.charAt(index);

    switch (state) {
      case numberStates._START_:
        if (char === "-") {
          state = numberStates.MINUS;
        } else if (char === "0") {
          passedValueIndex = index + 1;
          state = numberStates.ZERO;
        } else if (isDigit1to9(char)) {
          passedValueIndex = index + 1;
          state = numberStates.DIGIT;
        } else {
          return null;
        }
        break;

      case numberStates.MINUS:
        if (char === "0") {
          passedValueIndex = index + 1;
          state = numberStates.ZERO;
        } else if (isDigit1to9(char)) {
          passedValueIndex = index + 1;
          state = numberStates.DIGIT;
        } else {
          return null;
        }
        break;

      case numberStates.ZERO:
        if (char === ".") {
          state = numberStates.POINT;
        } else if (isExp(char)) {
          state = numberStates.EXP;
        } else {
          break iterator;
        }
        break;

      case numberStates.DIGIT:
        if (isDigit(char)) {
          passedValueIndex = index + 1;
        } else if (char === ".") {
          state = numberStates.POINT;
        } else if (isExp(char)) {
          state = numberStates.EXP;
        } else {
          break iterator;
        }
        break;

      case numberStates.POINT:
        if (isDigit(char)) {
          passedValueIndex = index + 1;
          state = numberStates.DIGIT_FRACTION;
        } else {
          break iterator;
        }
        break;

      case numberStates.DIGIT_FRACTION:
        if (isDigit(char)) {
          passedValueIndex = index + 1;
        } else if (isExp(char)) {
          state = numberStates.EXP;
        } else {
          break iterator;
        }
        break;

      case numberStates.EXP:
        if (char === "+" || char === "-") {
          state = numberStates.EXP_DIGIT_OR_SIGN;
        } else if (isDigit(char)) {
          passedValueIndex = index + 1;
          state = numberStates.EXP_DIGIT_OR_SIGN;
        } else {
          break iterator;
        }
        break;

      case numberStates.EXP_DIGIT_OR_SIGN:
        if (isDigit(char)) {
          passedValueIndex = index + 1;
        } else {
          break iterator;
        }
        break;
    }

    index++;
  }

  if (passedValueIndex > 0) {
    return {
      type: JsonTokenTypes.NUMBER,
      value: source.substring(startIndex, passedValueIndex),
      line: line,
      index: passedValueIndex,
      column: column + passedValueIndex - startIndex,
    };
  } else {
    return null;
  }
}

const defaultSettings = {
  verbose: true,
};

export function tokenize(source: string, settings?: ParseSettings): JsonToken[] {
  settings = Object.assign({}, defaultSettings, settings);

  let line = 1;
  let column = 1;
  let index = 0;
  const tokens: JsonToken[] = [];
  const sourceLength = source.length;
  while (index < sourceLength) {
    const whitespace = parseWhitespace(source, index, line, column);

    if (whitespace) {
      index = whitespace.index;
      line = whitespace.line;
      column = whitespace.column;
      continue;
    }

    const matched =
      parseComment(source, index, line, column) ||
      parseChar(source, index, line, column) ||
      parseKeyword(source, index, line, column) ||
      parseIdentifier(source, index, line, column) ||
      parseString(source, index, line, column) ||
      parseNumber(source, index, line, column);
    if (matched) {
      const token = { type: matched.type, value: matched.value } as JsonToken;

      if (settings.verbose) {
        token.position = new JsonPosition(line, column, index, matched.line, matched.column, matched.index);
      }

      tokens.push(token);
      index = matched.index;
      line = matched.line;
      column = matched.column;
    } else {
      error(cannotTokenizeSymbol(source.charAt(index), line, column), source, line, column);
    }
  }

  return tokens;
}
