import { createDocument, createNumber, createObject, createObjectKey, createObjectProperty } from "../types";

const object = createObject;
const key = createObjectKey;
const prop = createObjectProperty;
const number = createNumber;
const doc = createDocument;

const ast = object([prop(key("a"), number("1"))]);

export = {
  ast: doc(ast),
  options: { verbose: false },
};
