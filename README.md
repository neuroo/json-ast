# A tolerant JSON parser

![Test](https://github.com/anchan828/json-ast/workflows/Test/badge.svg)

## Install

```shell
npm install @anchan828/json-ast
```

## Features

The original code was developed by Vlad Trushin. Breaking modifications were made by [Romain Gaucher](https://twitter.com/rgaucher) to create a less strict JSON parser. Additionally, a more typical interaction with the AST has been implemented.

Current modifications and features as of `2.1.6` include:

- Creation of a `JsonDocument` root node and [more formal AST structure](./src/ast.js)
- Support for [inline comments](./test/cases/comment-in-object.json)
- Support for [multi-line comments](./test/cases/multi-line-comments-in-object.js)
- Support for [trailing commas and many consecutive commas](./test/cases/object-trailing-commas.json)
- Include visitor pattern to visit the AST
- Include a limited error-recovery mode trying to catch (when `junker` set to `true`):
  - [unclosed objects](./test/cases/object-unclosed-junker.json) or arrays
  - [too many closing braces](./test/cases/redundant-symbols-junker.json) or brackets
  - [automatic comma injection](./test/cases/asi-junker.json)
  - support for [unquoted keys](./test/cases/unquoted-keys-junker.json)
- [Conversion to a native JavaScript object](./test/index.js#L172) from `JsonNode`

[Basic examples](./examples/) are available to show how to use this package.

## JSONish

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
    And we're missing the closing brace...
  */
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

All the types exists in [src/ast.ts](src/ast.ts).

## API

```javascript
import { parse, Visitor, AST } from "json-ast";

// The visitor can stop at any time by assigning `Visitor.stop = true`
class MyVisitor extends Visitor {
  private comments: string[] = []

  public comment(commentNode: JsonComment): void {
    this.comments.push(commentNode.value);
  }
}

const JSON_BUFFER = `// Some comment
{
  "key": "value"
`;

// `verbose` will include the position in each node
const ast = parse(JSON_BUFFER, { verbose: true, junker: true });
assert(ast instanceof JsonDocument);

const visitor = new MyVisitor();
ast.visit(visitor);
assert.deepEqual(visitor.comments, [" Some comment"]);

// One can also the `JsonNode.toJSON` static method to convert to a JavaScript object
const obj = toJSON(ast);
assert(obj.key === "value");
```

### Parsing Options

The second argument of the `parse` function takes an object with the following settings:

- `verbose`: include positions in each AST node, `true` by default
- `junker`: enables an error recovery mode, `false` by default

## License

MIT Vlad Trushin and Romain Gaucher and anchan828
