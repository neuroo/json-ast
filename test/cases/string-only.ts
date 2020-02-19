import { createDocument, createString, position } from "../types";

const string = createString;
const doc = createDocument;

export = {
  ast: doc(string("Some text", position(1, 1, 0, 1, 12, 11))),
  options: { verbose: true },
};
