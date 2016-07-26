# JSON AST parser

[![Build Status](https://travis-ci.org/neuroo/json-ast.svg?branch=master)](https://travis-ci.org/neuroo/json-ast)

## History
The original code was developed by Vlad Trushin. Breaking modifications were made by Romain Gaucher to create a less strict JSON parser.

Current modification include:
* Creation of a `Document` root node
* Support for [inline comments](test/cases/comment-in-object.json)
* Support for [trailing commas and many consecutive commas](test/cases/object-trailing-commas.json)
* Include visitor pattern to visit the AST

## Features
The JSON parser accepts a superset of the JSON language:
```json
// some comment
{
  "key1": "value1", // some other comments
  "key2": "value2",
}
// some more comments
```

Some more features are under development, especially multi-line comments.

## API
```javascript
import {parse, Visitor} from 'json-ast';


class MyVisitor extends Visitor {
  constructor() {
    super();
    this.comments = [];
  }

  comment(commentNode) {
    this.comments.push(commentNode.value);
  }
};

const JSON_BUFFER = `// Some comment
{
  "key": "value"
}`;

const ast = parse(JSON_BUFFER, {verbose: true});
const visitor = new MyVisitor();
ast.visit(visitor);
assert.deepEqual(visitor.comments, [" Some comment"]);
```


## License
MIT Vlad Trushin and Romain Gaucher
