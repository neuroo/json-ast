import Position from "./position";

export enum nodeTypes {
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
  ERROR = "error"
}

// All elements in the tree will extend the `JsonNode` base class
export class JsonNode {
  private readonly _type: nodeTypes;
  public position: Position = null;
  constructor(_type = nodeTypes.ERROR) {
    this._type = _type || nodeTypes.ERROR;
  }

  get type() {
    return this._type;
  }

  accept(visitor) {
    visitor.visit(this);
  }

  static toObject(jsonNode) {
    return JSON.parse(JSON.stringify(jsonNode));
  }

  static toString(jsonNode) {
    return JSON.stringify(jsonNode);
  }

  static toJSON(jsonNode) {
    return toJSON(jsonNode);
  }
}

export class JsonDocument extends JsonNode {
  public child: any = null;
  public readonly comments: any[] = [];
  constructor() {
    super(nodeTypes.DOCUMENT);
  }
}

export class JsonObject extends JsonNode {
  public readonly properties: any[] = [];
  public readonly comments: any[] = [];
  constructor() {
    super(nodeTypes.OBJECT);
  }
}

export class JsonProperty extends JsonNode {
  public key: any = null;
  public value: any = null;
  constructor() {
    super(nodeTypes.PROPERTY);
  }
}

export class JsonArray extends JsonNode {
  public readonly items: any[] = [];
  public readonly comments: any[] = [];
  constructor() {
    super(nodeTypes.ARRAY);
  }
}

export class JsonValue extends JsonNode {
  constructor(public value = null, _type = nodeTypes.VALUE) {
    super(_type);
  }
}

export class JsonKey extends JsonValue {
  constructor(_value = null) {
    super(_value, nodeTypes.KEY);
  }
}

export class JsonComment extends JsonValue {
  constructor(_value = null) {
    super(_value, nodeTypes.COMMENT);
  }
}

export class JsonString extends JsonValue {
  constructor(_value = null) {
    super(_value, nodeTypes.STRING);
  }
}

export class JsonNumber extends JsonValue {
  constructor(_value = null) {
    super(+_value, nodeTypes.NUMBER);
  }
}

export class JsonTrue extends JsonValue {
  constructor() {
    super(true, nodeTypes.TRUE);
  }
}

export class JsonFalse extends JsonValue {
  constructor() {
    super(false, nodeTypes.FALSE);
  }
}

export class JsonNull extends JsonValue {
  constructor() {
    super(null, nodeTypes.NULL);
  }
}

const nodeTypeObjectMapping = {
  [nodeTypes.DOCUMENT]: JsonDocument,
  [nodeTypes.COMMENT]: JsonComment,
  [nodeTypes.OBJECT]: JsonObject,
  [nodeTypes.PROPERTY]: JsonProperty,
  [nodeTypes.KEY]: JsonKey,
  [nodeTypes.ARRAY]: JsonArray,
  [nodeTypes.VALUE]: JsonValue,
  [nodeTypes.STRING]: JsonString,
  [nodeTypes.NUMBER]: JsonNumber,
  [nodeTypes.TRUE]: JsonTrue,
  [nodeTypes.FALSE]: JsonFalse,
  [nodeTypes.NULL]: JsonNull
};

//
// Utility methods to construct the objects
//
export class NodeFactory {
  static fromType<T extends JsonNode>(objectType: nodeTypes, _value = null): T {
    let clazz = nodeTypeObjectMapping[objectType];
    if (clazz === null)
      throw new Error(`AST node of type ${objectType} cannot be found`);
    return _value !== null ? new clazz(_value) : new clazz();
  }
}

// Just a recursive, slow implementation to a JavaScript object from this
// JsonNode
function recursiveNodeConversion(rootNode, parentObject?: any) {
  let result = null;
  switch (rootNode.type) {
    case nodeTypes.DOCUMENT:
      return recursiveNodeConversion(rootNode.child);
    case nodeTypes.OBJECT: {
      result = {};

      rootNode.properties.forEach(propNode => {
        result[recursiveNodeConversion(propNode.key)] = recursiveNodeConversion(
          propNode.value
        );
      });
      return result;
    }
    case nodeTypes.ARRAY: {
      result = [];
      rootNode.items.forEach(itemNode => {
        result.push(recursiveNodeConversion(itemNode));
      });
      return result;
    }
    case nodeTypes.VALUE:
    case nodeTypes.STRING:
    case nodeTypes.KEY:
      return rootNode.value;
    case nodeTypes.NUMBER: {
      if (rootNode.value instanceof Number) return rootNode.value;
      return new Number(rootNode.value).valueOf();
    }
    case nodeTypes.TRUE:
      return true;
    case nodeTypes.FALSE:
      return false;
    case nodeTypes.NULL:
      return null;
    default:
      return undefined;
  }
}

function toJSON(jsonNode) {
  if (!(jsonNode instanceof JsonNode))
    throw new Error("JSON conversion only accepts a kind of JsonNode");

  return recursiveNodeConversion(jsonNode);
}
