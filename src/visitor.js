import position from './position';
import {nodeTypes} from './ast';

// Do not export this function as it provides the main traversal of the AST
function traverseAST(visitor, node) {
  switch (node.type) {
  case nodeTypes.DOCUMENT: {
    visitor.document(node);
    if (node.comments) {
      node.comments.forEach((commentNode) => { visitor.comment(commentNode); });
    }
    if (node.child) {
      node.child.accept(visitor);
    }
    break;
  }
  case nodeTypes.OBJECT: {
    visitor.object(node);
    if (node.comments) {
      node.comments.forEach((commentNode) => { visitor.comment(commentNode); });
    }
    if (node.properties) {
      node.properties.forEach((propNode) => { propNode.accept(visitor); });
    }
    break;
  }
  case nodeTypes.PROPERTY: {
    visitor.property(node);
    node.key.accept(visitor);
    node.value.accept(visitor);
    break;
  }
  case nodeTypes.KEY: {
    visitor.key(node);
    break;
  }
  case nodeTypes.ARRAY: {
    visitor.array(node);
    if (node.comments) {
      node.comments.forEach((commentNode) => { visitor.comment(commentNode); });
    }
    if (node.items) {
      node.items.forEach((itemNode) => { itemNode.accept(visitor); });
    }
    break;
  }
  case nodeTypes.STRING: {
    visitor.value(node);
    visitor.string(node);
    break;
  }
  case nodeTypes.NUMBER: {
    visitor.value(node);
    visitor.number(node);
    break;
  }
  case nodeTypes.TRUE: {
    visitor.value(node);
    visitor.boolean(node);
    break;
  }
  case nodeTypes.FALSE: {
    visitor.value(node);
    visitor.boolean(node);
    break;
  }
  case nodeTypes.NULL: {
    visitor.value(node);
    visitor.nil(node);
    break;
  }
  default:
    break;
  }
}

export class Visitor {
  constructor(){};

  document(docNode){
      //
  };

  object(objectNode){
      //
  };

  property(propertyNode){
      //
  };

  key(keyNode){
      //
  };

  array(arrayNode){
      //
  };

  value(valueNode){
      //
  };

  comment(commentNode){
      //
  };

  string(stringNode){
      //
  };

  number(numberNode){
      //
  };

  boolean(booleanNode){
      // encapsulate true | false
  };

  nil(nullNode){
      // null
  };

  // Visit
  visit(node) {
    // call to "private" function
    traverseAST(this, node);
  }
};
