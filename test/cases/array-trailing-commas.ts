import { createArray, createDocument, createNumber } from "../types";

const doc = createDocument;
const array = createArray;
const number = createNumber;

export = {
  ast: doc(array([number("1"), number("2"), number("3")])),
  options: { verbose: false },
};
