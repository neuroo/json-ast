const fs = require('fs');
const util = require('util');
const assert = require('assert');

const json_ast = require('../../dist');
const Visitor = json_ast.Visitor;
const parser = json_ast.parse;

class MyVisitor extends Visitor {
  constructor() { super(); };

  key(keyNode) {
    assert(keyNode instanceof json_ast.AST.JsonKey);
    console.log('[KEY]', keyNode.value);
  };
};

const SOME_JSON = `
// some comment
{
  "key1": "value1", // some other comments
  "key2": "value2"
}
// some more comments
`;

function visitJSON() {
  const tree = parser(SOME_JSON, {verbose : true});
  assert(tree instanceof json_ast.AST.JsonDocument);

  const visitor = new MyVisitor();
  tree.accept(visitor);
  /*
  [KEY] key1
  [KEY] key2
  */
}

visitJSON();
