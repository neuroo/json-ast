import {
  createArray,
  createDocument,
  createNumber,
  createObject,
  createObjectKey,
  createObjectProperty,
  createString
} from "../types";

var object = createObject;
var key = createObjectKey;
var prop = createObjectProperty;
var array = createArray;
var string = createString;
var number = createNumber;
var doc = createDocument;

var ast = object([
  prop(key("a<"), number("2")),
  prop(
    key("b)"),
    object([
      prop(
        key("c("),
        array([string("3!"), string("4:"), string("5;"), string("6'")])
      ),
      prop(key("d&"), object([prop(key("e!"), string("~_~"))])),
      prop(key(":e"), string("|")),
      prop(key(" f "), string("*±*∆"))
    ])
  )
]);

export = {
  ast: doc(ast),
  options: { verbose: false }
};
