var types = require('../types');
var object = types.createObject;
var array = types.createArray;
var key = types.createObjectKey;
var prop = types.createObjectProperty;
var number = types.createNumber;
var doc = types.createDocument;

var ast = object([
  prop(key('a'), number('1')), prop(key('b'), number('2')),
  prop(key('c'), array([ number('1'), number('2'), number('3') ])),
  prop(key('d'),
       object([ prop(key('e'), number('3')), prop(key('f'), number('4')) ]))
]);

module.exports = {
  ast : doc(ast),
  options : {verbose : false, junker : true}
};
