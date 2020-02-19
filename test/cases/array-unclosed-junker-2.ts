import { createArray, createDocument, createString } from "../types";

var doc = createDocument;
var array = createArray;
var string = createString;

export = {
  ast: doc(array([array([string("a"), string("b")])])),
  options: { verbose: false, junker: true }
};
