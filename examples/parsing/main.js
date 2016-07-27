const fs = require('fs');
const util = require('util');
const json_ast = require('../../dist');
const assert = require('assert');
const parser = json_ast.parse;

const SOME_JSON = `
// some comment
{
  "key1": "value1", // some other comments
  "key2": "value2"
}
// some more comments
`;

function parseJSON() {
  const tree = parser(SOME_JSON, {verbose : true});
  assert(tree instanceof json_ast.AST.JsonDocument);

  console.log(util.inspect(tree, {colors : true, depth : 7}));
  /*
  JsonDocument {
    _type: 'document',
    _position: null,
    _child:
     JsonObject {
       _type: 'object',
       _position:
        Position {
          _start: { line: 3, column: 1, char: 17 },
          _end: { line: 6, column: 2, char: 82 },
          _human: '3:1 - 6:2 [17:82]' },
       _properties:
        [ JsonProperty {
            _type: 'property',
            _position: null,
            _key:
             JsonKey {
               _type: 'key',
               _position:
                Position {
                  _start: { line: 4, column: 3, char: 21 },
                  _end: { line: 4, column: 9, char: 27 },
                  _human: '4:3 - 4:9 [21:27]' },
               _value: 'key1' },
            _value:
             JsonString {
               _type: 'string',
               _position:
                Position {
                  _start: { line: 4, column: 11, char: 29 },
                  _end: { line: 4, column: 19, char: 37 },
                  _human: '4:11 - 4:19 [29:37]' },
               _value: 'value1' } },
          JsonProperty {
            _type: 'property',
            _position: null,
            _key:
             JsonKey {
               _type: 'key',
               _position:
                Position {
                  _start: { line: 5, column: 3, char: 64 },
                  _end: { line: 5, column: 9, char: 70 },
                  _human: '5:3 - 5:9 [64:70]' },
               _value: 'key2' },
            _value:
             JsonString {
               _type: 'string',
               _position:
                Position {
                  _start: { line: 5, column: 11, char: 72 },
                  _end: { line: 5, column: 19, char: 80 },
                  _human: '5:11 - 5:19 [72:80]' },
               _value: 'value2' } } ],
       _comments:
        [ JsonComment {
            _type: 'comment',
            _position:
             Position {
               _start: { line: 4, column: 21, char: 39 },
               _end: { line: 5, column: 1, char: 62 },
               _human: '4:21 - 5:1 [39:62]' },
            _value: ' some other comments' } ] },
    _comments:
     [ JsonComment {
         _type: 'comment',
         _position:
          Position {
            _start: { line: 2, column: 1, char: 1 },
            _end: { line: 3, column: 1, char: 17 },
            _human: '2:1 - 3:1 [1:17]' },
         _value: ' some comment' },
       JsonComment {
         _type: 'comment',
         _position:
          Position {
            _start: { line: 7, column: 1, char: 83 },
            _end: { line: 8, column: 1, char: 105 },
            _human: '7:1 - 8:1 [83:105]' },
         _value: ' some more comments\n' } ] }
  */
}

parseJSON();
