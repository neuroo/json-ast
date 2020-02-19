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
    object([
      prop(key("a"), number("1")),
      prop(key("b"), array([number("1"), number("2"), number("3")]))
    ]),
    null,
    [comment(" Some stuff we don't care about"), comment(" Yet another")]
  ),
  options: { verbose: false, junker: true }
};
