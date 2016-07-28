var types = require('../types');
var position = types.position;
var doc = types.createDocument;
var array = types.createArray;
var string = types.createString;

module.exports = {
  ast : doc(array([ array([ string('a'), string('b') ]) ])),
  options : {verbose : false, junker : true}
};
