import {
  JsonArray,
  JsonComment,
  JsonDocument,
  JsonFalse,
  JsonKey,
  JsonNode,
  JsonNull,
  JsonNumber,
  JsonObject,
  JsonProperty,
  JsonString,
  JsonTrue,
  JsonValue
} from "./ast";
export { nodeTypes } from "./ast";
export { parse } from "./parse";
export { Visitor } from "./visitor";

module.exports.AST = {
  JsonArray,
  JsonComment,
  JsonDocument,
  JsonFalse,
  JsonKey,
  JsonNode,
  JsonNull,
  JsonNumber,
  JsonObject,
  JsonProperty,
  JsonString,
  JsonTrue,
  JsonValue
};
