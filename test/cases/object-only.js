var types = require('../types');
var position = types.position;
var object = types.createObject;
var doc = types.createDocument;

module.exports = {
  ast : doc(object([], position(1, 1, 0, 1, 3, 2))),
  options : {verbose : true}
};
