import { createArray, createDocument, position } from "../types";

const doc = createDocument;
const array = createArray;

export = {
  ast: doc(array([], position(1, 1, 0, 1, 3, 2))),
  options: { verbose: true },
};
