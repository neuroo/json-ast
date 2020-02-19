import {
  createArray,
  createDocument,
  createNumber,
  createObject,
  createObjectKey,
  createObjectProperty
} from "../types";

var object = createObject;
var array = createArray;
var key = createObjectKey;
var prop = createObjectProperty;
var number = createNumber;
var doc = createDocument;

var ast = object([
  prop(key("a"), number("1")),
  prop(key("b"), number("2")),
  prop(key("c"), array([number("1"), number("2"), number("3")])),
  prop(
    key("d"),
    object([prop(key("e"), number("3")), prop(key("f"), number("4"))])
  )
]);

export = {
  ast: doc(ast),
  options: { verbose: false, junker: true }
};
