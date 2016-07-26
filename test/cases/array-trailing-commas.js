var types = require('../types');
var position = types.position;
var doc = types.createDocument;
var array = types.createArray;
var number = types.createNumber;

module.exports = {
  ast : doc(array([ number('1'), number('2'), number('3') ])),
  options : {verbose : false}
};
