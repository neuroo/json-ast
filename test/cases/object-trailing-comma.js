var types = require('../types');
var object = types.createObject;
var key = types.createObjectKey;
var prop = types.createObjectProperty;
var number = types.createNumber;
var doc = types.createDocument;

var ast = object([ prop(key('a'), number('1')) ]);

module.exports = {
  ast : doc(ast),
  options : {verbose : false}
};
