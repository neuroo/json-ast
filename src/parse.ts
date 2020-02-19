import {
  JsonArray,
  JsonComment,
  JsonDocument,
  JsonKey,
  JsonNode,
  JsonObject,
  JsonProperty,
  JsonValue,
  NodeFactory,
  nodeTypes
} from "./ast";
import error from "./error";
import { junker } from "./junker";
import parseErrorTypes from "./parseErrorTypes";
import { JsonPosition } from "./position";
import { tokenize, tokenTypes } from "./tokenize";
import { JsonToken, ParseResult, ParseSettings } from "./types";

// import util from 'util';

const objectStates = {
  _START_: 0,
  OPEN_OBJECT: 1,
  KEY: 2,
  COLON: 3,
  VALUE: 4,
  COMMA: 5
};

const arrayStates = {
  _START_: 0,
  OPEN_ARRAY: 1,
  VALUE: 2,
  COMMA: 3
};

const defaultSettings: ParseSettings = {
  verbose: true,
  junker: false
};

function parseObject(
  source: string,
  tokenList: JsonToken[],
  index: number,
  settings: ParseSettings
): ParseResult<JsonObject> {
  let startToken;
  let property;
  let object = NodeFactory.fromType<JsonObject>(nodeTypes.OBJECT);

  let state = objectStates._START_;
  let token;

  while (index < tokenList.length) {
    token = tokenList[index];

    if (token.type === tokenTypes.COMMENT) {
      let comment = NodeFactory.fromType<JsonComment>(
        nodeTypes.COMMENT,
        token.value
      );
      if (settings.verbose) {
        comment.position = token.position;
      }
      object.comments.push(comment);
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
          property = NodeFactory.fromType<JsonProperty>(nodeTypes.PROPERTY);
          property.key = NodeFactory.fromType<JsonKey>(
            nodeTypes.KEY,
            token.value
          );

          if (settings.verbose) {
            property.key.position = token.position;
          }
          state = objectStates.KEY;
          index++;
        } else if (token.type === tokenTypes.RIGHT_BRACE) {
          if (settings.verbose) {
            object.position = new JsonPosition(
              startToken.position.start.line,
              startToken.position.start.column,
              startToken.position.start.char,
              token.position.end.line,
              token.position.end.column,
              token.position.end.char
            );
          }
          index++;
          return { value: object, index };
        } else {
          error(
            parseErrorTypes.unexpectedToken(
              source.substring(
                token.position.start.char,
                token.position.end.char
              ),
              token.position.start.line,
              token.position.start.column
            ),
            source,
            token.position.start.line,
            token.position.start.column
          );
        }
        break;

      case objectStates.KEY:
        if (token.type === tokenTypes.COLON) {
          state = objectStates.COLON;
          index++;
        } else {
          error(
            parseErrorTypes.unexpectedToken(
              source.substring(
                token.position.start.char,
                token.position.end.char
              ),
              token.position.start.line,
              token.position.start.column
            ),
            source,
            token.position.start.line,
            token.position.start.column
          );
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
            object.position = new JsonPosition(
              startToken.position.start.line,
              startToken.position.start.column,
              startToken.position.start.char,
              token.position.end.line,
              token.position.end.column,
              token.position.end.char
            );
          }
          index++;
          return { value: object, index };
        } else if (token.type === tokenTypes.COMMA) {
          state = objectStates.COMMA;
          index++;
        } else {
          error(
            parseErrorTypes.unexpectedToken(
              source.substring(
                token.position.start.char,
                token.position.end.char
              ),
              token.position.start.line,
              token.position.start.column
            ),
            source,
            token.position.start.line,
            token.position.start.column
          );
        }
        break;

      case objectStates.COMMA:
        if (token.type === tokenTypes.STRING) {
          property = NodeFactory.fromType<JsonProperty>(nodeTypes.PROPERTY);
          property.key = NodeFactory.fromType<JsonKey>(
            nodeTypes.KEY,
            token.value
          );

          if (settings.verbose) {
            property.key.position = token.position;
          }
          state = objectStates.KEY;
          index++;
        } else if (
          token.type === tokenTypes.COMMA ||
          token.type === tokenTypes.RIGHT_BRACE
        ) {
          // Allow trailing commas
          state = objectStates.VALUE;
          // index++;
          continue;
        } else {
          error(
            parseErrorTypes.unexpectedToken(
              source.substring(
                token.position.start.char,
                token.position.end.char
              ),
              token.position.start.line,
              token.position.start.column
            ),
            source,
            token.position.start.line,
            token.position.start.column
          );
        }
        break;
    }
  }

  error(parseErrorTypes.unexpectedEnd());
}

function parseArray(
  source: string,
  tokenList: JsonToken[],
  index: number,
  settings: ParseSettings
): ParseResult<JsonArray> {
  let startToken;
  let array = NodeFactory.fromType<JsonArray>(nodeTypes.ARRAY);
  let state = arrayStates._START_;
  let token;
  while (index < tokenList.length) {
    token = tokenList[index];
    if (token.type === tokenTypes.COMMENT) {
      let comment = NodeFactory.fromType<JsonComment>(
        nodeTypes.COMMENT,
        token.value
      );
      if (settings.verbose) {
        comment.position = token.position;
      }
      array.comments.push(comment);
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
            array.position = new JsonPosition(
              startToken.position.start.line,
              startToken.position.start.column,
              startToken.position.start.char,
              token.position.end.line,
              token.position.end.column,
              token.position.end.char
            );
          }
          index++;
          return { value: array, index };
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
            array.position = new JsonPosition(
              startToken.position.start.line,
              startToken.position.start.column,
              startToken.position.start.char,
              token.position.end.line,
              token.position.end.column,
              token.position.end.char
            );
          }
          index++;
          return { value: array, index };
        } else if (token.type === tokenTypes.COMMA) {
          state = arrayStates.COMMA;
          index++;
        } else {
          error(
            parseErrorTypes.unexpectedToken(
              source.substring(
                token.position.start.char,
                token.position.end.char
              ),
              token.position.start.line,
              token.position.start.column
            ),
            source,
            token.position.start.line,
            token.position.start.column
          );
        }
        break;

      case arrayStates.COMMA:
        // Allow for trailing commas and too many commas
        if (
          token.type === tokenTypes.COMMA ||
          token.type === tokenTypes.RIGHT_BRACKET
        ) {
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

function parseValue(
  source: string,
  tokenList: JsonToken[],
  index: number,
  settings: ParseSettings
): ParseResult<JsonValue | JsonObject | JsonArray> {
  // value: object | array | STRING | NUMBER | TRUE | FALSE | NULL | COMMENT
  let token = tokenList[index];
  let tokenType;

  switch (token.type) {
    case tokenTypes.STRING:
      tokenType = nodeTypes.STRING;
      break;
    case tokenTypes.NUMBER:
      tokenType = nodeTypes.NUMBER;
      break;
    case tokenTypes.TRUE:
      tokenType = nodeTypes.TRUE;
      break;
    case tokenTypes.FALSE:
      tokenType = nodeTypes.FALSE;
      break;
    case tokenTypes.NULL:
      tokenType = nodeTypes.NULL;
      break;
    case tokenTypes.COMMENT:
      tokenType = nodeTypes.COMMENT;
      break;
    default:
      break;
  }
  if (tokenType) {
    index++;
    let value = NodeFactory.fromType<JsonValue>(tokenType, token.value);
    if (settings.verbose) {
      value.position = token.position;
    }
    return { value, index };
  } else {
    let objectOrValue =
      parseObject(source, tokenList, index, settings) ||
      parseArray(source, tokenList, index, settings);

    if (objectOrValue) {
      return objectOrValue;
    } else {
      error(
        parseErrorTypes.unexpectedToken(
          source.substring(token.position.start.char, token.position.end.char),
          token.position.start.line,
          token.position.start.column
        ),
        source,
        token.position.start.line,
        token.position.start.column
      );
    }
  }
}

function parseDocument(
  source: string,
  tokenList: JsonToken[],
  index: number,
  settings: ParseSettings
): ParseResult<JsonDocument> {
  // value | COMMENT*
  let token = tokenList[index];
  let tokenType = token.type;

  let doc = NodeFactory.fromType<JsonDocument>(nodeTypes.DOCUMENT);

  while (tokenType === tokenTypes.COMMENT) {
    let comment = NodeFactory.fromType<JsonComment>(
      nodeTypes.COMMENT,
      token.value
    );
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

    while (
      index < tokenList.length &&
      tokenList[index].type === tokenTypes.COMMENT
    ) {
      token = tokenList[index];
      tokenType = token.type;
      doc.child.index = index;

      let comment = NodeFactory.fromType<JsonComment>(
        nodeTypes.COMMENT,
        token.value
      );
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
  return { value: doc, index: final_index };
}

export function parse(source: string, settings?: ParseSettings): JsonDocument {
  settings = Object.assign({}, defaultSettings, settings);

  let tokenList = tokenize(source, settings);
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
    error(
      parseErrorTypes.unexpectedToken(
        source.substring(token.position.start.char, token.position.end.char),
        token.position.start.line,
        token.position.start.column
      ),
      source,
      token.position.start.line,
      token.position.start.column
    );
  }
}
