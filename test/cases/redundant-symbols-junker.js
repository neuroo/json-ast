var types = require('../types');
var object = types.createObject;
var key = types.createObjectKey;
var prop = types.createObjectProperty;
var number = types.createNumber;
var doc = types.createDocument;
var comment = types.createComment;
var array = types.createArray;

var ast = object([
  prop(key('a'), number('1')),
  prop(key('b'), array([ number('1'), number('2'), number('3') ]))
]);

module.exports = {
  ast : doc(ast),
  options : {verbose : false, junker : true}
};
