var types = require('../types');
var object = types.createObject;
var array = types.createArray;
var key = types.createObjectKey;
var prop = types.createObjectProperty;
var number = types.createNumber;
var string = types.createString;
var doc = types.createDocument;
var _true = types.createTrue;
var _false = types.createFalse;
var _null = types.createNull;

var ast = object([
  prop(key('hello'), string('world')),
  prop(key('this'), array([
         string('is'), string('a'), string('test'), _true(), _false()
       ]))
]);

module.exports = {
  ast : doc(ast),
  options : {verbose : false, junker : true}
};
