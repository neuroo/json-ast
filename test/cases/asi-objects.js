var types = require('../types');
var object = types.createObject;
var array = types.createArray;
var key = types.createObjectKey;
var prop = types.createObjectProperty;
var number = types.createNumber;
var doc = types.createDocument;

var ast = object([ prop(
    key('a'), array([ array([ number('1') ]), array([ number('2') ]) ])) ]);

module.exports = {
  ast : doc(ast),
  options : {verbose : false, junker : true}
};
