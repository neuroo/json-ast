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
  private _position: Position;
  constructor(_type = nodeTypes.ERROR) {
    this._type = _type || nodeTypes.ERROR;
    this._position = null;
  }

  get type() {
    return this._type;
  }

  set position(_pos) {
    this._position = _pos || null;
  }

  get position() {
    return this._position;
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
  private _child: any;
  private readonly _comments: any[];
  constructor() {
    super(nodeTypes.DOCUMENT);
    this._child = null;
    this._comments = [];
  }

  set child(_child) {
    this._child = _child;
  }

  get child() {
    return this._child;
  }

  get comments() {
    return this._comments;
  }
}

export class JsonObject extends JsonNode {
  private readonly _properties: any[];
  private readonly _comments: any[];
  constructor() {
    super(nodeTypes.OBJECT);
    this._properties = [];
    this._comments = [];
  }

  get properties() {
    return this._properties;
  }

  get comments() {
    return this._comments;
  }
}

export class JsonProperty extends JsonNode {
  private _key: any;
  private _value: any;
  constructor() {
    super(nodeTypes.PROPERTY);
    this._key = null;
    this._value = null;
  }

  get key() {
    return this._key;
  }

  set key(_key) {
    this._key = _key;
  }

  get value() {
    return this._value;
  }

  set value(_value) {
    this._value = _value;
  }
}

export class JsonArray extends JsonNode {
  private readonly _items: any[];
  private readonly _comments: any[];
  constructor() {
    super(nodeTypes.ARRAY);
    this._items = [];
    this._comments = [];
  }

  get items() {
    return this._items;
  }

  get comments() {
    return this._comments;
  }
}

export class JsonValue extends JsonNode {
  private _value: any;
  constructor(_value = null, _type = nodeTypes.VALUE) {
    super(_type);
    this._value = _value;
  }

  get value() {
    return this._value;
  }

  set value(_value) {
    this._value = _value;
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
    super(_value, nodeTypes.NUMBER);
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
  constructor() {}

  static fromType(objectType, _value = null) {
    let clazz = nodeTypeObjectMapping[objectType];
    if (clazz === null)
      throw new Error(`AST node of type ${objectType} cannot be found`);
    return _value !== null ? new clazz(_value) : new clazz();
  }
}

function toJSON(jsonNode) {
  if (!(jsonNode instanceof JsonNode))
    throw new Error("JSON conversion only accepts a kind of JsonNode");

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
          result[
            recursiveNodeConversion(propNode.key)
          ] = recursiveNodeConversion(propNode.value);
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
        // typecast
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

  return recursiveNodeConversion(jsonNode);
}
