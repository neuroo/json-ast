const fs = require('fs');
const util = require('util');
const json_ast = require('../../dist');
const Visitor = json_ast.Visitor;
const parser = json_ast.parse;

class MyVisitor extends Visitor {
  constructor() { super(); };

  key(keyNode) { console.log('[KEY]', keyNode.value); };
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
  const visitor = new MyVisitor();
  tree.accept(visitor);
  /*
  [KEY] key1
  [KEY] key2
  */
}

visitJSON();
