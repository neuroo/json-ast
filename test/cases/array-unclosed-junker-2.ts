import { createArray, createDocument, createString } from "../types";

const doc = createDocument;
const array = createArray;
const string = createString;

export = {
  ast: doc(array([array([string("a"), string("b")])])),
  options: { verbose: false, junker: true },
};
