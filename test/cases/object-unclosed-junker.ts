import {
  createDocument,
  createNumber,
  createObject,
  createObjectKey,
  createObjectProperty
} from "../types";

var doc = createDocument;
var object = createObject;
var number = createNumber;
var key = createObjectKey;
var prop = createObjectProperty;

export = {
  ast: doc(object([prop(key("a"), number("1"))])),
  options: { verbose: false, junker: true }
};
