import { createArray, createDocument, createNumber } from "../types";

var doc = createDocument;
var array = createArray;
var number = createNumber;

export = {
  ast: doc(array([number("1"), number("2"), number("3")])),
  options: { verbose: false }
};
