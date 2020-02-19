import { JsonNode } from "./ast";

export interface ParseResult<T extends JsonNode> {
  value: T;
  index: number;
}

export interface ParseSettings {
  verbose: boolean;
  junker: boolean;
}
