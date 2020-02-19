import { JsonPosition } from "./position";
import { Visitor } from "./visitor";

export enum JsonNodeTypes {
  DOCUMENT = "document",
  COMMENT = "comment",
  OBJECT = "object",
  PROPERTY = "property",
  KEY = "key",
  ARRAY = "array",
  VALUE = "value",
  STRING = "string",
  NUMBER = "number",
  TRUE = "true",
  FALSE = "false",
  NULL = "null",
  ERROR = "error",
}

export interface IJsonNode {
  position: JsonPosition;
  type: JsonNodeTypes;
  accept(visitor: Visitor): void;
}

// All elements in the tree will extend the `JsonNode` base class
export class JsonNode implements IJsonNode {
  public position: JsonPosition = null;

  constructor(public readonly type: JsonNodeTypes = JsonNodeTypes.ERROR) {}

  public static toObject<T extends object>(jsonNode: JsonNode): T {
    return JSON.parse(JSON.stringify(jsonNode));
  }

  public static toString(jsonNode: JsonNode): string {
    return JSON.stringify(jsonNode);
  }

  public static toJSON<T extends any>(jsonNode: JsonNode): T {
    // eslint-disable-next-line @typescript-eslint/no-use-before-define
    return toJSON(jsonNode);
  }

  public accept(visitor: Visitor): void {
    visitor.visit(this);
  }
}

export class JsonDocument extends JsonNode {
  public child: any = null;

  public readonly comments: JsonComment[] = [];

  constructor() {
    super(JsonNodeTypes.DOCUMENT);
  }
}

export class JsonObject extends JsonNode {
  public readonly properties: JsonProperty[] = [];

  public readonly comments: JsonComment[] = [];

  constructor() {
    super(JsonNodeTypes.OBJECT);
  }
}

export class JsonProperty extends JsonNode {
  public key: JsonKey = null;

  public value: JsonValue = null;

  constructor() {
    super(JsonNodeTypes.PROPERTY);
  }
}

export class JsonArray extends JsonNode {
  public readonly items: any[] = [];

  public readonly comments: JsonComment[] = [];

  constructor() {
    super(JsonNodeTypes.ARRAY);
  }
}

export class JsonValue extends JsonNode {
  constructor(public value = null, _type = JsonNodeTypes.VALUE) {
    super(_type);
  }
}

export class JsonKey extends JsonValue {
  constructor(_value = null) {
    super(_value, JsonNodeTypes.KEY);
  }
}

export class JsonComment extends JsonValue {
  constructor(_value = null) {
    super(_value, JsonNodeTypes.COMMENT);
  }
}

export class JsonString extends JsonValue {
  constructor(_value = null) {
    super(_value, JsonNodeTypes.STRING);
  }
}

export class JsonNumber extends JsonValue {
  constructor(_value = null) {
    super(+_value, JsonNodeTypes.NUMBER);
  }
}

export class JsonTrue extends JsonValue {
  constructor() {
    super(true, JsonNodeTypes.TRUE);
  }
}

export class JsonFalse extends JsonValue {
  constructor() {
    super(false, JsonNodeTypes.FALSE);
  }
}

export class JsonNull extends JsonValue {
  constructor() {
    super(null, JsonNodeTypes.NULL);
  }
}

const nodeTypeObjectMapping = {
  [JsonNodeTypes.DOCUMENT]: JsonDocument,
  [JsonNodeTypes.COMMENT]: JsonComment,
  [JsonNodeTypes.OBJECT]: JsonObject,
  [JsonNodeTypes.PROPERTY]: JsonProperty,
  [JsonNodeTypes.KEY]: JsonKey,
  [JsonNodeTypes.ARRAY]: JsonArray,
  [JsonNodeTypes.VALUE]: JsonValue,
  [JsonNodeTypes.STRING]: JsonString,
  [JsonNodeTypes.NUMBER]: JsonNumber,
  [JsonNodeTypes.TRUE]: JsonTrue,
  [JsonNodeTypes.FALSE]: JsonFalse,
  [JsonNodeTypes.NULL]: JsonNull,
};

//
// Utility methods to construct the objects
//
export class NodeFactory {
  static fromType<T extends JsonNode>(objectType: JsonNodeTypes, _value = null): T {
    const clazz = nodeTypeObjectMapping[objectType];
    if (clazz === null) throw new Error(`AST node of type ${objectType} cannot be found`);
    return _value !== null ? new clazz(_value) : new clazz();
  }
}

// Just a recursive, slow implementation to a JavaScript object from this
// JsonNode
function recursiveNodeConversion(rootNode: JsonNode): any {
  let result = null;
  switch (rootNode.type) {
    case JsonNodeTypes.DOCUMENT:
      return recursiveNodeConversion(rootNode.child);
    case JsonNodeTypes.OBJECT: {
      result = {};

      rootNode.properties.forEach(propNode => {
        result[recursiveNodeConversion(propNode.key)] = recursiveNodeConversion(propNode.value);
      });
      return result;
    }
    case JsonNodeTypes.ARRAY: {
      result = [];
      rootNode.items.forEach(itemNode => {
        result.push(recursiveNodeConversion(itemNode));
      });
      return result;
    }
    case JsonNodeTypes.VALUE:
    case JsonNodeTypes.STRING:
    case JsonNodeTypes.KEY:
      return rootNode.value;
    case JsonNodeTypes.NUMBER: {
      if (rootNode.value instanceof Number) return rootNode.value;
      return new Number(rootNode.value).valueOf();
    }
    case JsonNodeTypes.TRUE:
      return true;
    case JsonNodeTypes.FALSE:
      return false;
    case JsonNodeTypes.NULL:
      return null;
    default:
      return undefined;
  }
}

function toJSON(jsonNode: JsonNode): any {
  if (!(jsonNode instanceof JsonNode)) throw new Error("JSON conversion only accepts a kind of JsonNode");

  return recursiveNodeConversion(jsonNode);
}
