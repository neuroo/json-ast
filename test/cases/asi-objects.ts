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

const ast = object([prop(key("a"), array([array([number("1")]), array([number("2")])]))]);

export = {
  ast: doc(ast),
  options: { verbose: false, junker: true },
};
