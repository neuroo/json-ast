import { createDocument, createObject, position } from "../types";

const object = createObject;
const doc = createDocument;

export = {
  ast: doc(object([], position(1, 1, 0, 1, 3, 2))),
  options: { verbose: true },
};
