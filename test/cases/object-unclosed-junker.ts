import { createDocument, createNumber, createObject, createObjectKey, createObjectProperty } from "../types";

const doc = createDocument;
const object = createObject;
const number = createNumber;
const key = createObjectKey;
const prop = createObjectProperty;

export = {
  ast: doc(object([prop(key("a"), number("1"))])),
  options: { verbose: false, junker: true },
};
