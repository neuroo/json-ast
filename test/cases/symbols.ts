import {
  createArray,
  createDocument,
  createNumber,
  createObject,
  createObjectKey,
  createObjectProperty,
  createString,
} from "../types";

const object = createObject;
const key = createObjectKey;
const prop = createObjectProperty;
const array = createArray;
const string = createString;
const number = createNumber;
const doc = createDocument;

const ast = object([
  prop(key("a<"), number("2")),
  prop(
    key("b)"),
    object([
      prop(key("c("), array([string("3!"), string("4:"), string("5;"), string("6'")])),
      prop(key("d&"), object([prop(key("e!"), string("~_~"))])),
      prop(key(":e"), string("|")),
      prop(key(" f "), string("*±*∆")),
    ]),
  ),
]);

export = {
  ast: doc(ast),
  options: { verbose: false },
};
