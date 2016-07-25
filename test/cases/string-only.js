var types = require('../types');
var position = types.position;
var string = types.createString;
var doc = types.createDocument;

module.exports = {
  ast : doc(string('Some text', position(1, 1, 0, 1, 12, 11))),
  options : {verbose : true}
};
