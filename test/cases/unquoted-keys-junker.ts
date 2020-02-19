import {
  createArray,
  createDocument,
  createFalse,
  createObject,
  createObjectKey,
  createObjectProperty,
  createString,
  createTrue,
} from "../types";

const array = createArray;
const key = createObjectKey;
const prop = createObjectProperty;
const string = createString;
const doc = createDocument;
const _true = createTrue;
const _false = createFalse;

const ast = createObject([
  prop(key("hello"), string("world")),
  prop(key("this"), array([string("is"), string("a"), string("test"), _true(), _false()])),
]);

export = {
  ast: doc(ast),
  options: { verbose: false, junker: true },
};
