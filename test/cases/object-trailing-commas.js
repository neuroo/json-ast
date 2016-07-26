var types = require('../types');
var object = types.createObject;
var key = types.createObjectKey;
var prop = types.createObjectProperty;
var number = types.createNumber;
var doc = types.createDocument;
var comment = types.createComment;

var ast = object(
    [ prop(key('a'), number('1')), prop(key('b'), number('2')) ], null,
    [ comment(' This is a comment'), comment(' This is another comment') ]);

module.exports = {
  ast : doc(ast),
  options : {verbose : false}
};
