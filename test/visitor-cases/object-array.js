var types = require('../types');
var position = types.position;
var doc = types.createDocument;
var comment = types.createComment;
var array = types.createArray;
var object = types.createObject;

module.exports = {
  visitor : {
    comments : [
      ' This is a simple JSON with an object that wraps arrays', ' first value',
      ' second value', ' third value'
    ],
    keys : [ 'key', "other" ],
    values : [ 1, 2, 3, null ]
  },
  options : {verbose : true}
}
