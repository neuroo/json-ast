import { createDocument, createObject, position } from "../types";

var object = createObject;
var doc = createDocument;

export = {
  ast: doc(object([], position(1, 1, 0, 1, 3, 2))),
  options: { verbose: true }
};
