var types = require('../types');
var position = types.position;
var doc = types.createDocument;
var object = types.createObject;
var number = types.createNumber;
var key = types.createObjectKey;
var prop = types.createObjectProperty;

module.exports = {
  ast : doc(object([ prop(key('a'), number('1')) ])),
  options : {verbose : false, junker : true}
};
