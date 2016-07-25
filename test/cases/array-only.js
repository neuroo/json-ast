var types = require('../types');
var position = types.position;
var doc = types.createDocument;
var array = types.createArray;

module.exports = {
  ast : doc(array([], position(1, 1, 0, 1, 3, 2))),
  options : {verbose : true}
};
