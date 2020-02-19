import { createDocument, createNumber, createObject, createObjectKey, createObjectProperty } from "../types";

const object = createObject;
const key = createObjectKey;
const prop = createObjectProperty;
const number = createNumber;
const doc = createDocument;

const ast = object([
  prop(key("a"), number("1")),
  prop(key("b"), number("1.2")),
  prop(key("c"), number("1.2e3")),
  prop(key("d"), number("1.2e-3")),
]);

export = {
  ast: doc(ast),
  options: { verbose: false },
};
