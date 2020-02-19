import {
  createArray,
  createComment,
  createDocument,
  createNumber,
  createObject,
  createObjectKey,
  createObjectProperty
} from "../types";

var doc = createDocument;
var comment = createComment;
var object = createObject;
var array = createArray;
var key = createObjectKey;
var prop = createObjectProperty;
var number = createNumber;

export = {
  ast: doc(
    object(
      [
        prop(key("a"), number("1")),
        prop(key("b"), array([number("1")], null, [comment(" null-value")]))
      ],
      null,
      [comment(" first-comment"), comment(" second-comment")]
    ),
    null,
    [
      comment(" before-everything - 1"),
      comment(" before-everything - 2"),
      comment(" after-everything")
    ]
  ),
  options: { verbose: false }
};
