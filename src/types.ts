import { IJsonNode } from "./ast";
import { JsonPosition } from "./position";
export interface ParseResult<T extends IJsonNode> {
  value: T;
  index: number;
}

export interface ParseSettings {
  verbose: boolean;
  junker: boolean;
}

export interface JsonToken {
  type: any;
  value: any;
  position?: JsonPosition;
}
