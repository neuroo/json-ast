import {
  IJsonValue,
  JsonArray,
  JsonComment,
  JsonDocument,
  JsonFalse,
  JsonKey,
  JsonNode,
  JsonNodeType,
  JsonNodeTypes,
  JsonNull,
  JsonObject,
  JsonProperty,
  JsonString,
  JsonTrue,
} from "./ast";

// Do not export this function as it provides the main traversal of the AST
function traverseAST(visitor: Visitor, node: JsonNodeType): void {
  switch (node.type) {
    case JsonNodeTypes.DOCUMENT: {
      visitor.document(node);
      if (node.comments) {
        node.comments.forEach(commentNode => {
          visitor.comment(commentNode);
        });
      }
      if (node.child) {
        node.child.accept(visitor);
      }
      break;
    }
    case JsonNodeTypes.OBJECT: {
      visitor.object(node);
      if (node.comments) {
        node.comments.forEach(commentNode => {
          visitor.comment(commentNode);
        });
      }
      if (node.properties) {
        node.properties.forEach(propNode => {
          propNode.accept(visitor);
        });
      }
      break;
    }
    case JsonNodeTypes.PROPERTY: {
      visitor.property(node);
      node.key.accept(visitor);
      node.value.accept(visitor);
      break;
    }
    case JsonNodeTypes.KEY: {
      visitor.key(node);
      break;
    }
    case JsonNodeTypes.ARRAY: {
      visitor.array(node);
      if (visitor.stop) break;
      if (node.comments) {
        node.comments.forEach(commentNode => {
          visitor.comment(commentNode);
        });
      }
      if (node.items) {
        node.items.forEach(itemNode => {
          itemNode.accept(visitor);
        });
      }
      break;
    }
    case JsonNodeTypes.STRING: {
      visitor.value(node);
      if (!visitor.stop) visitor.string(node);
      break;
    }
    case JsonNodeTypes.NUMBER: {
      visitor.value(node);
      if (!visitor.stop) visitor.number(node);
      break;
    }
    case JsonNodeTypes.TRUE: {
      visitor.value(node);
      if (!visitor.stop) visitor.boolean(node);
      break;
    }
    case JsonNodeTypes.FALSE: {
      visitor.value(node);
      if (!visitor.stop) visitor.boolean(node);
      break;
    }
    case JsonNodeTypes.NULL: {
      visitor.value(node);
      if (!visitor.stop) visitor.null(node);
      break;
    }
    default:
      break;
  }
}

export interface IVisit {
  document(docNode: JsonDocument): void;

  object(objectNode: JsonObject): void;

  property(propertyNode: JsonProperty): void;

  key(keyNode: JsonKey): void;
  array(arrayNode: JsonArray): void;

  value(valueNode: IJsonValue): void;

  comment(commentNode: JsonComment): void;

  string(stringNode: JsonString): void;

  number(numberNode: JsonNode): void;

  boolean(booleanNode: JsonTrue | JsonFalse): void;

  null(nullNode: JsonNull): void;
}

export abstract class Visitor implements IVisit {
  public stop = false;

  // Visit
  public visit(node: JsonNodeType): void {
    // call to "private" function
    if (this.stop) return;
    traverseAST(this, node);
  }

  // eslint-disable-next-line @typescript-eslint/no-unused-vars, @typescript-eslint/no-empty-function
  public document(docNode: JsonDocument): void {}

  // eslint-disable-next-line @typescript-eslint/no-unused-vars, @typescript-eslint/no-empty-function
  public object(objectNode: JsonObject): void {}

  // eslint-disable-next-line @typescript-eslint/no-unused-vars, @typescript-eslint/no-empty-function
  public property(propertyNode: JsonProperty): void {}

  // eslint-disable-next-line @typescript-eslint/no-unused-vars, @typescript-eslint/no-empty-function
  public key(keyNode: JsonKey): void {}

  // eslint-disable-next-line @typescript-eslint/no-unused-vars, @typescript-eslint/no-empty-function
  public array(arrayNode: JsonArray): void {}

  // eslint-disable-next-line @typescript-eslint/no-unused-vars, @typescript-eslint/no-empty-function
  public value(valueNode: IJsonValue): void {}

  // eslint-disable-next-line @typescript-eslint/no-unused-vars, @typescript-eslint/no-empty-function
  public comment(commentNode: JsonComment): void {}

  // eslint-disable-next-line @typescript-eslint/no-unused-vars, @typescript-eslint/no-empty-function
  public string(stringNode: JsonString): void {}

  // eslint-disable-next-line @typescript-eslint/no-unused-vars, @typescript-eslint/no-empty-function
  public number(numberNode: JsonNode): void {}

  // eslint-disable-next-line @typescript-eslint/no-unused-vars, @typescript-eslint/no-empty-function
  public boolean(booleanNode: JsonTrue | JsonFalse): void {}

  // eslint-disable-next-line @typescript-eslint/no-unused-vars, @typescript-eslint/no-empty-function
  public null(nullNode: JsonNull): void {}
}
