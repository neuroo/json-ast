import {
  createArray,
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
var array = createArray;

var ast = object([
  prop(key("a"), number("1")),
  prop(key("b"), array([number("1"), number("2"), number("3")]))
]);

export = {
  ast: doc(ast),
  options: { verbose: false, junker: true }
};
