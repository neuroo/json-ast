import { createDocument, createString, position } from "../types";

var string = createString;
var doc = createDocument;

export = {
  ast: doc(string("Some text", position(1, 1, 0, 1, 12, 11))),
  options: { verbose: true }
};
