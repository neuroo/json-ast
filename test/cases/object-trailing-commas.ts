import {
  createComment,
  createDocument,
  createNumber,
  createObject,
  createObjectKey,
  createObjectProperty
} from "../types";

var object = createObject;
var key = createObjectKey;
var prop = createObjectProperty;
var number = createNumber;
var doc = createDocument;
var comment = createComment;

var ast = object(
  [prop(key("a"), number("1")), prop(key("b"), number("2"))],
  null,
  [comment(" This is a comment"), comment(" This is another comment")]
);

export = {
  ast: doc(ast),
  options: { verbose: false }
};
