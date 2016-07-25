const fs = require('fs');
const util = require('util');
const json_ast = require('../../dist');
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

  console.log(util.inspect(tree, {colors : true, depth : 7}));
  /*
    { type: 'document',
      value:
       { type: 'object',
         properties:
          [ { type: 'property',
              key:
               { type: 'key',
                 value: 'key1',
                 accept: [Function: accept],
                 position:
                  { start: { line: 4, column: 3, char: 21 },
                    end: { line: 4, column: 9, char: 27 },
                    human: '4:3 - 4:9 [21:27]' } },
              accept: [Function: accept],
              value:
               { type: 'string',
                 value: 'value1',
                 accept: [Function: accept],
                 position:
                  { start: { line: 4, column: 11, char: 29 },
                    end: { line: 4, column: 19, char: 37 },
                    human: '4:11 - 4:19 [29:37]' } } },
            { type: 'property',
              key:
               { position:
                  { start: { line: 5, column: 3, char: 64 },
                    end: { line: 5, column: 9, char: 70 },
                    human: '5:3 - 5:9 [64:70]' } },
              accept: [Function: accept],
              value:
               { type: 'string',
                 value: 'value2',
                 accept: [Function: accept],
                 position:
                  { start: { line: 5, column: 11, char: 72 },
                    end: { line: 5, column: 19, char: 80 },
                    human: '5:11 - 5:19 [72:80]' } } } ],
         comments:
          [ { type: 'comment',
              value: ' some other comments',
              accept: [Function: accept],
              position:
               { start: { line: 4, column: 21, char: 39 },
                 end: { line: 5, column: 1, char: 62 },
                 human: '4:21 - 5:1 [39:62]' } } ],
         accept: [Function: accept],
         position:
          { start: { line: 3, column: 1, char: 17 },
            end: { line: 6, column: 2, char: 82 },
            human: '3:1 - 6:2 [17:82]' } },
      comments:
       [ { type: 'comment',
           value: ' some comment',
           accept: [Function: accept],
           position:
            { start: { line: 2, column: 1, char: 1 },
              end: { line: 3, column: 1, char: 17 },
              human: '2:1 - 3:1 [1:17]' } },
         { type: 'comment',
           value: ' some more comments\n',
           accept: [Function: accept],
           position:
            { start: { line: 7, column: 1, char: 83 },
              end: { line: 8, column: 1, char: 105 },
              human: '7:1 - 8:1 [83:105]' } } ],
      accept: [Function: accept] }
  */
}

parseJSON();
