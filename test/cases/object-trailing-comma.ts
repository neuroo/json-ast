import {
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

var ast = object([prop(key("a"), number("1"))]);

export = {
  ast: doc(ast),
  options: { verbose: false }
};
