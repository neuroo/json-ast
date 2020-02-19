import {
  IJsonNode,
  JsonArray,
  JsonComment,
  JsonDocument,
  JsonKey,
  JsonNode,
  JsonNodeTypes,
  JsonObject,
  JsonProperty,
  JsonValue,
  NodeFactory,
} from "./ast";
import { error } from "./error";
import { junker } from "./junker";
import { unexpectedEnd, unexpectedToken } from "./parseErrorTypes";
import { JsonPosition } from "./position";
import { JsonTokenTypes, tokenize } from "./tokenize";
import { JsonToken, ParseResult, ParseSettings } from "./types";

// import util from 'util';

const objectStates = {
  _START_: 0,
  OPEN_OBJECT: 1,
  KEY: 2,
  COLON: 3,
  VALUE: 4,
  COMMA: 5,
};

const arrayStates = {
  _START_: 0,
  OPEN_ARRAY: 1,
  VALUE: 2,
  COMMA: 3,
};

const defaultSettings: ParseSettings = {
  verbose: true,
  junker: false,
};

function parseValue(
  source: string,
  tokenList: JsonToken[],
  index: number,
  settings: ParseSettings,
): ParseResult<IJsonNode> {
  // value: object | array | STRING | NUMBER | TRUE | FALSE | NULL | COMMENT
  const token = tokenList[index];
  let tokenType: JsonNodeTypes;

  switch (token.type) {
    case JsonTokenTypes.STRING:
      tokenType = JsonNodeTypes.STRING;
      break;
    case JsonTokenTypes.NUMBER:
      tokenType = JsonNodeTypes.NUMBER;
      break;
    case JsonTokenTypes.TRUE:
      tokenType = JsonNodeTypes.TRUE;
      break;
    case JsonTokenTypes.FALSE:
      tokenType = JsonNodeTypes.FALSE;
      break;
    case JsonTokenTypes.NULL:
      tokenType = JsonNodeTypes.NULL;
      break;
    case JsonTokenTypes.COMMENT:
      tokenType = JsonNodeTypes.COMMENT;
      break;
    default:
      break;
  }
  if (tokenType) {
    index++;
    const value = NodeFactory.fromType<JsonValue>(tokenType, token.value);
    if (settings.verbose) {
      value.position = token.position;
    }
    return { value, index };
  } else {
    const objectOrValue =
      // eslint-disable-next-line @typescript-eslint/no-use-before-define
      parseObject(source, tokenList, index, settings) || parseArray(source, tokenList, index, settings);

    if (objectOrValue) {
      return objectOrValue;
    } else {
      error(
        unexpectedToken(
          source.substring(token.position.start.char, token.position.end.char),
          token.position.start.line,
          token.position.start.column,
        ),
        source,
        token.position.start.line,
        token.position.start.column,
      );
    }
  }
}
function parseObject(
  source: string,
  tokenList: JsonToken[],
  index: number,
  settings: ParseSettings,
): ParseResult<JsonObject> {
  let startToken;
  let property;
  const object = NodeFactory.fromType<JsonObject>(JsonNodeTypes.OBJECT);

  let state = objectStates._START_;
  let token;

  while (index < tokenList.length) {
    token = tokenList[index];

    if (token.type === JsonTokenTypes.COMMENT) {
      const comment = NodeFactory.fromType<JsonComment>(JsonNodeTypes.COMMENT, token.value);
      if (settings.verbose) {
        comment.position = token.position;
      }
      object.comments.push(comment);
      index++;
      continue;
    }

    switch (state) {
      case objectStates._START_:
        if (token.type === JsonTokenTypes.LEFT_BRACE) {
          startToken = token;
          state = objectStates.OPEN_OBJECT;
          index++;
        } else {
          return null;
        }
        break;

      case objectStates.OPEN_OBJECT:
        if (token.type === JsonTokenTypes.STRING) {
          property = NodeFactory.fromType<JsonProperty>(JsonNodeTypes.PROPERTY);
          property.key = NodeFactory.fromType<JsonKey>(JsonNodeTypes.KEY, token.value);

          if (settings.verbose) {
            property.key.position = token.position;
          }
          state = objectStates.KEY;
          index++;
        } else if (token.type === JsonTokenTypes.RIGHT_BRACE) {
          if (settings.verbose) {
            object.position = new JsonPosition(
              startToken.position.start.line,
              startToken.position.start.column,
              startToken.position.start.char,
              token.position.end.line,
              token.position.end.column,
              token.position.end.char,
            );
          }
          index++;
          return { value: object, index };
        } else {
          error(
            unexpectedToken(
              source.substring(token.position.start.char, token.position.end.char),
              token.position.start.line,
              token.position.start.column,
            ),
            source,
            token.position.start.line,
            token.position.start.column,
          );
        }
        break;

      case objectStates.KEY:
        if (token.type === JsonTokenTypes.COLON) {
          state = objectStates.COLON;
          index++;
        } else {
          error(
            unexpectedToken(
              source.substring(token.position.start.char, token.position.end.char),
              token.position.start.line,
              token.position.start.column,
            ),
            source,
            token.position.start.line,
            token.position.start.column,
          );
        }
        break;

      case objectStates.COLON:
        const value = parseValue(source, tokenList, index, settings);
        index = value.index;
        property.value = value.value;

        object.properties.push(property);
        state = objectStates.VALUE;
        break;

      case objectStates.VALUE:
        if (token.type === JsonTokenTypes.RIGHT_BRACE) {
          if (settings.verbose) {
            object.position = new JsonPosition(
              startToken.position.start.line,
              startToken.position.start.column,
              startToken.position.start.char,
              token.position.end.line,
              token.position.end.column,
              token.position.end.char,
            );
          }
          index++;
          return { value: object, index };
        } else if (token.type === JsonTokenTypes.COMMA) {
          state = objectStates.COMMA;
          index++;
        } else {
          error(
            unexpectedToken(
              source.substring(token.position.start.char, token.position.end.char),
              token.position.start.line,
              token.position.start.column,
            ),
            source,
            token.position.start.line,
            token.position.start.column,
          );
        }
        break;

      case objectStates.COMMA:
        if (token.type === JsonTokenTypes.STRING) {
          property = NodeFactory.fromType<JsonProperty>(JsonNodeTypes.PROPERTY);
          property.key = NodeFactory.fromType<JsonKey>(JsonNodeTypes.KEY, token.value);

          if (settings.verbose) {
            property.key.position = token.position;
          }
          state = objectStates.KEY;
          index++;
        } else if (token.type === JsonTokenTypes.COMMA || token.type === JsonTokenTypes.RIGHT_BRACE) {
          // Allow trailing commas
          state = objectStates.VALUE;
          // index++;
          continue;
        } else {
          error(
            unexpectedToken(
              source.substring(token.position.start.char, token.position.end.char),
              token.position.start.line,
              token.position.start.column,
            ),
            source,
            token.position.start.line,
            token.position.start.column,
          );
        }
        break;
    }
  }

  error(unexpectedEnd());
}

function parseArray(
  source: string,
  tokenList: JsonToken[],
  index: number,
  settings: ParseSettings,
): ParseResult<JsonArray> {
  let startToken;
  const array = NodeFactory.fromType<JsonArray>(JsonNodeTypes.ARRAY);
  let state = arrayStates._START_;
  let token;
  while (index < tokenList.length) {
    token = tokenList[index];
    if (token.type === JsonTokenTypes.COMMENT) {
      const comment = NodeFactory.fromType<JsonComment>(JsonNodeTypes.COMMENT, token.value);
      if (settings.verbose) {
        comment.position = token.position;
      }
      array.comments.push(comment);
      index++;
      continue;
    }

    switch (state) {
      case arrayStates._START_:
        if (token.type === JsonTokenTypes.LEFT_BRACKET) {
          startToken = token;
          state = arrayStates.OPEN_ARRAY;
          index++;
        } else {
          return null;
        }
        break;

      case arrayStates.OPEN_ARRAY:
        if (token.type === JsonTokenTypes.RIGHT_BRACKET) {
          if (settings.verbose) {
            array.position = new JsonPosition(
              startToken.position.start.line,
              startToken.position.start.column,
              startToken.position.start.char,
              token.position.end.line,
              token.position.end.column,
              token.position.end.char,
            );
          }
          index++;
          return { value: array, index };
        } else {
          const value = parseValue(source, tokenList, index, settings);
          index = value.index;
          array.items.push(value.value);
          state = arrayStates.VALUE;
        }
        break;

      case arrayStates.VALUE:
        if (token.type === JsonTokenTypes.RIGHT_BRACKET) {
          if (settings.verbose) {
            array.position = new JsonPosition(
              startToken.position.start.line,
              startToken.position.start.column,
              startToken.position.start.char,
              token.position.end.line,
              token.position.end.column,
              token.position.end.char,
            );
          }
          index++;
          return { value: array, index };
        } else if (token.type === JsonTokenTypes.COMMA) {
          state = arrayStates.COMMA;
          index++;
        } else {
          error(
            unexpectedToken(
              source.substring(token.position.start.char, token.position.end.char),
              token.position.start.line,
              token.position.start.column,
            ),
            source,
            token.position.start.line,
            token.position.start.column,
          );
        }
        break;

      case arrayStates.COMMA:
        // Allow for trailing commas and too many commas
        if (token.type === JsonTokenTypes.COMMA || token.type === JsonTokenTypes.RIGHT_BRACKET) {
          state = arrayStates.VALUE;
          continue;
        }
        const value = parseValue(source, tokenList, index, settings);
        index = value.index;
        array.items.push(value.value);
        state = arrayStates.VALUE;
        break;
    }
  }

  error(unexpectedEnd());
}

function parseDocument(
  source: string,
  tokenList: JsonToken[],
  index: number,
  settings: ParseSettings,
): ParseResult<JsonDocument> {
  // value | COMMENT*
  let token = tokenList[index];
  let tokenType = token.type;

  const doc = NodeFactory.fromType<JsonDocument>(JsonNodeTypes.DOCUMENT);

  while (tokenType === JsonTokenTypes.COMMENT) {
    const comment = NodeFactory.fromType<JsonComment>(JsonNodeTypes.COMMENT, token.value);
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

    while (index < tokenList.length && tokenList[index].type === JsonTokenTypes.COMMENT) {
      token = tokenList[index];
      tokenType = token.type;
      doc.child.index = index;

      const comment = NodeFactory.fromType<JsonComment>(JsonNodeTypes.COMMENT, token.value);
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
    error(unexpectedEnd());
  }

  if (settings.junker === true) {
    tokenList = junker(tokenList, settings);
  }

  const value = parseDocument(source, tokenList, 0, settings);

  if (value.index === tokenList.length || settings.junker === true) {
    return value.value;
  } else {
    const token = tokenList[value.index];
    error(
      unexpectedToken(
        source.substring(token.position.start.char, token.position.end.char),
        token.position.start.line,
        token.position.start.column,
      ),
      source,
      token.position.start.line,
      token.position.start.column,
    );
  }
}
