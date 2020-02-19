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
  prop(key("a"), array([array([number("1")]), array([number("2")])]))
]);

export = {
  ast: doc(ast),
  options: { verbose: false, junker: true }
};
