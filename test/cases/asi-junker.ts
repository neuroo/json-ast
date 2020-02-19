import {
  createArray,
  createDocument,
  createNumber,
  createObject,
  createObjectKey,
  createObjectProperty,
} from "../types";

const object = createObject;
const array = createArray;
const key = createObjectKey;
const prop = createObjectProperty;
const number = createNumber;
const doc = createDocument;

const ast = object([
  prop(key("a"), number("1")),
  prop(key("b"), number("2")),
  prop(key("c"), array([number("1"), number("2"), number("3")])),
  prop(key("d"), object([prop(key("e"), number("3")), prop(key("f"), number("4"))])),
]);

export = {
  ast: doc(ast),
  options: { verbose: false, junker: true },
};
