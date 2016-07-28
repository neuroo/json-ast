# JSON AST parser

[![Build Status](https://travis-ci.org/neuroo/json-ast.svg?branch=master)](https://travis-ci.org/neuroo/json-ast)

## History
The original code was developed by Vlad Trushin. Breaking modifications were made by Romain Gaucher to create a less strict JSON parser, yet a more typical interaction with the AST.

Current modification include:
* Creation of a `JsonDocument` root node and [more formal AST structure](src/ast.js)
* Support for [inline comments](test/cases/comment-in-object.json)
* Support for [multi-line comments](test/cases/multi-line-comments-in-object.js)
* Support for [trailing commas and many consecutive commas](test/cases/object-trailing-commas.json)
* Include visitor pattern to visit the AST

## Features
The JSON parser accepts a superset of the JSON language:
```json
// some comment
{
  "key1": "value1", // some other comments
  "key2": "value2",
  ,
  ,
  /*
    Oh dear! It's important to put this here.
    And we love commas too!
  */
}
```

## Structure of the AST
As of 2.1.0, the AST is defined with the following types:

```javascript
[JsonNode] // Essentially an abstract class
  position: [Position]

[JsonDocument] extends [JsonNode]
  child: [?]*
  comments: [JsonComment]*

[JsonValue] extends [JsonNode]
  value: [?]

[JsonObject] extends [JsonNode]
  properties: [JsonProperty]*
  comments: [JsonComment]*

[JsonProperty] extends [JsonNode]
  key: [JsonKey]
  value: [?]*

[JsonKey] extends [JsonValue]

[JsonArray]
  items: *
  comments: [JsonComment]*

[JsonComment] extends [JsonValue]
[JsonString] extends [JsonValue]
[JsonNumber] extends [JsonValue]
[JsonTrue] extends [JsonValue]
[JsonFalse] extends [JsonValue]
[JsonNumber] extends [JsonValue]
```

All the types exists in [src/ast.js](src/ast.js).

## API
```javascript
import {parse, Visitor, AST} from 'json-ast';


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

// `verbose` will include the position in each node
const ast = parse(JSON_BUFFER, {verbose: true});
assert(ast instanceof AST.JsonDocument);
const visitor = new MyVisitor();
ast.visit(visitor);
assert.deepEqual(visitor.comments, [" Some comment"]);
```


## License
MIT Vlad Trushin and Romain Gaucher
