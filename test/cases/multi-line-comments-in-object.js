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
      object(
          [
            prop(key('a'), number('1')),
            prop(
                key('b'),
                array(
                    [ number('1') ], null,
                    [ comment(' null-value'), comment('/* /* /* /* /* /') ]))
          ],
          null,
          [
            comment(' first-comment'),
            comment('\n\n    This is a multi-line comment\n\n  '),
            comment(' second-comment')
          ]),
      null,
      [
        comment(' before-everything - 1'), comment(' before-everything - 2'),
        comment(' after-everything'), comment('\n\nYet another comment\n\n')
      ]),
  options : {verbose : false}
};
