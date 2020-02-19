const assert = require("assert");

const { Visitor, parse, AST } = require("../../dist");

class MyVisitor extends Visitor {
  constructor() {
    super();
  }

  key(keyNode) {
    assert(keyNode instanceof AST.JsonKey);
    console.log("[KEY]", keyNode.value);
  }
}

const SOME_JSON = `
// some comment
{
  "key1": "value1", // some other comments
  "key2": "value2"
}
// some more comments
`;

function visitJSON() {
  const tree = parse(SOME_JSON, { verbose: true });
  assert(tree instanceof AST.JsonDocument);

  const visitor = new MyVisitor();
  tree.accept(visitor);
  /*
  [KEY] key1
  [KEY] key2
  */
}

visitJSON();
