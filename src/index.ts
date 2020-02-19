// clang-format off
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
  JsonValue,
  nodeTypes
} from "./ast";
// clang-format on
import { parse } from "./parse";
import { Visitor } from "./visitor";

module.exports.nodeTypes = nodeTypes;
module.exports.parse = parse;
module.exports.Visitor = Visitor;
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
