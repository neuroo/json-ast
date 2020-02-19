import { createDocument, createNumber, position } from "../types";

var number = createNumber;
var doc = createDocument;

export = {
  ast: doc(number("12345", position(1, 1, 0, 1, 6, 5))),
  options: { verbose: true }
};
