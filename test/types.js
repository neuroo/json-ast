import * as AST from '../src/ast';
import Position from '../src/position';

function position(startLine, startColumn, startChar, endLine, endColumn,
                  endChar) {
  return new Position(startLine, startColumn, startChar, endLine, endColumn,
                      endChar);
}

function createDocument(value, position, comments) {
  let result = new AST.JsonDocument();
  result.child = value;
  if (comments) {
    comments.forEach((comment) => result.comments.push(comment));
  }

  if (position) {
    result.position = position;
  }
  return result;
}

function createObjectKey(value, position) {
  var result = new AST.JsonKey(value);

  if (position) {
    result.position = position;
  }

  return result;
}

function createObjectProperty(key, value) {
  let result = new AST.JsonProperty();
  result.key = key;
  result.value = value;
  return result;
}

function createObject(properties, position, comments) {
  var result = new AST.JsonObject();
  if (properties) {
    properties.forEach((prop) => result.properties.push(prop));
  }
  if (comments) {
    comments.forEach((comment) => result.comments.push(comment));
  }
  if (position) {
    result.position = position;
  }
  return result;
}

function createArray(items, position, comments) {
  var result = new AST.JsonArray();
  if (items) {
    items.forEach((prop) => result.items.push(prop));
  }
  if (comments) {
    comments.forEach((comment) => result.comments.push(comment));
  }
  if (position) {
    result.position = position;
  }

  return result;
}

function createComment(value, position) {
  var result = new AST.JsonComment(value);

  if (position) {
    result.position = position;
  }

  return result;
}

function createString(value, position) {
  var result = new AST.JsonString(value);

  if (position) {
    result.position = position;
  }

  return result;
}

function createNumber(value, position) {
  var result = new AST.JsonNumber(value);

  if (position) {
    result.position = position;
  }

  return result;
}

function createTrue(position) {
  var result = new AST.JsonTrue();

  if (position) {
    result.position = position;
  }

  return result;
}

function createFalse(position) {
  var result = new AST.JsonFalse();

  if (position) {
    result.position = position;
  }

  return result;
}

function createNull(position) {
  var result = new AST.JsonNull();

  if (position) {
    result.position = position;
  }

  return result;
}

module.exports = {
  position : position,
  createDocument : createDocument,
  createComment : createComment,
  createObjectKey : createObjectKey,
  createObjectProperty : createObjectProperty,
  createObject : createObject,
  createArray : createArray,
  createString : createString,
  createNumber : createNumber,
  createTrue : createTrue,
  createFalse : createFalse,
  createNull : createNull
};
