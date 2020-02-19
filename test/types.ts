import * as AST from "../src/ast";
import Position from "../src/position";

export function position(
  startLine,
  startColumn,
  startChar,
  endLine,
  endColumn,
  endChar
) {
  return new Position(
    startLine,
    startColumn,
    startChar,
    endLine,
    endColumn,
    endChar
  );
}

export function createDocument(value, position?: any, comments?: any) {
  let result = new AST.JsonDocument();
  result.child = value;
  if (comments) {
    comments.forEach(comment => result.comments.push(comment));
  }

  if (position) {
    result.position = position;
  }
  return result;
}

export function createObjectKey(value, position?: any) {
  var result = new AST.JsonKey(value);

  if (position) {
    result.position = position;
  }

  return result;
}

export function createObjectProperty(key, value) {
  let result = new AST.JsonProperty();
  result.key = key;
  result.value = value;
  return result;
}

export function createObject(properties, position?: any, comments?: any) {
  var result = new AST.JsonObject();
  if (properties) {
    properties.forEach(prop => result.properties.push(prop));
  }
  if (comments) {
    comments.forEach(comment => result.comments.push(comment));
  }
  if (position) {
    result.position = position;
  }
  return result;
}

export function createArray(items, position?: any, comments?: any) {
  var result = new AST.JsonArray();
  if (items) {
    items.forEach(prop => result.items.push(prop));
  }
  if (comments) {
    comments.forEach(comment => result.comments.push(comment));
  }
  if (position) {
    result.position = position;
  }

  return result;
}

export function createComment(value, position?: any) {
  var result = new AST.JsonComment(value);

  if (position) {
    result.position = position;
  }

  return result;
}

export function createString(value, position?: any) {
  var result = new AST.JsonString(value);

  if (position) {
    result.position = position;
  }

  return result;
}

export function createNumber(value, position?: any) {
  var result = new AST.JsonNumber(value);

  if (position) {
    result.position = position;
  }

  return result;
}

export function createTrue(position?: any) {
  var result = new AST.JsonTrue();

  if (position) {
    result.position = position;
  }

  return result;
}

export function createFalse(position?: any) {
  var result = new AST.JsonFalse();

  if (position) {
    result.position = position;
  }

  return result;
}

export function createNull(position?: any) {
  var result = new AST.JsonNull();

  if (position) {
    result.position = position;
  }

  return result;
}
