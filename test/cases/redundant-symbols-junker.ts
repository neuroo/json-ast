import {
  createArray,
  createDocument,
  createNumber,
  createObject,
  createObjectKey,
  createObjectProperty,
} from "../types";

const object = createObject;
const key = createObjectKey;
const prop = createObjectProperty;
const number = createNumber;
const doc = createDocument;
const array = createArray;

const ast = object([prop(key("a"), number("1")), prop(key("b"), array([number("1"), number("2"), number("3")]))]);

export = {
  ast: doc(ast),
  options: { verbose: false, junker: true },
};
