var types = require('../types');
var position = types.position;
var doc = types.createDocument;
var comment = types.createComment;
var object = types.createObject;
var array = types.createArray;
var key = types.createObjectKey;
var prop = types.createObjectProperty;
var number = types.createNumber;

module.exports = {
  ast : doc(
      object([
        prop(key('a'), number('1')),
        prop(key('b'), array([ number('1'), number('2'), number('3') ]))
      ]),
      null,
      [ comment(' Some stuff we don\'t care about'), comment(' Yet another') ]),
  options : {verbose : false, junker : true}
};
