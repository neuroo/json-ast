import {
  createArray,
  createDocument,
  createFalse,
  createObject,
  createObjectKey,
  createObjectProperty,
  createString,
  createTrue
} from "../types";

var array = createArray;
var key = createObjectKey;
var prop = createObjectProperty;
var string = createString;
var doc = createDocument;
var _true = createTrue;
var _false = createFalse;

var ast = createObject([
  prop(key("hello"), string("world")),
  prop(
    key("this"),
    array([string("is"), string("a"), string("test"), _true(), _false()])
  )
]);

export = {
  ast: doc(ast),
  options: { verbose: false, junker: true }
};
