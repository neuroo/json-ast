import {
  JsonArray,
  JsonComment,
  JsonDocument,
  JsonFalse,
  JsonKey,
  JsonNull,
  JsonNumber,
  JsonObject,
  JsonPosition,
  JsonProperty,
  JsonString,
  JsonTrue,
} from "../src";

export function position(
  startLine: number,
  startColumn: number,
  startChar: number,
  endLine: number,
  endColumn: number,
  endChar: number,
): JsonPosition {
  return new JsonPosition(startLine, startColumn, startChar, endLine, endColumn, endChar);
}

export function createDocument(value, position?: JsonPosition, comments?: JsonComment[]): JsonDocument {
  const result = new JsonDocument();
  result.child = value;
  if (comments) {
    comments.forEach(comment => result.comments.push(comment));
  }

  if (position) {
    result.position = position;
  }
  return result;
}

export function createObjectKey(value, position?: JsonPosition): JsonKey {
  const result = new JsonKey(value);

  if (position) {
    result.position = position;
  }

  return result;
}

export function createObjectProperty(key, value): JsonProperty {
  const result = new JsonProperty();
  result.key = key;
  result.value = value;
  return result;
}

export function createObject(properties, position?: JsonPosition, comments?: JsonComment[]): JsonObject {
  const result = new JsonObject();
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

export function createArray(items, position?: JsonPosition, comments?: JsonComment[]): JsonArray {
  const result = new JsonArray();
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

export function createComment(value, position?: JsonPosition): JsonComment {
  const result = new JsonComment(value);

  if (position) {
    result.position = position;
  }

  return result;
}

export function createString(value, position?: JsonPosition): JsonString {
  const result = new JsonString(value);

  if (position) {
    result.position = position;
  }

  return result;
}

export function createNumber(value, position?: JsonPosition): JsonNumber {
  const result = new JsonNumber(value);

  if (position) {
    result.position = position;
  }

  return result;
}

export function createTrue(position?: JsonPosition): JsonTrue {
  const result = new JsonTrue();

  if (position) {
    result.position = position;
  }

  return result;
}

export function createFalse(position?: JsonPosition): JsonFalse {
  const result = new JsonFalse();

  if (position) {
    result.position = position;
  }

  return result;
}

export function createNull(position?: JsonPosition): JsonNull {
  const result = new JsonNull();

  if (position) {
    result.position = position;
  }

  return result;
}
