import {
  createComment,
  createDocument,
  createNumber,
  createObject,
  createObjectKey,
  createObjectProperty,
} from "../types";

const object = createObject;
const key = createObjectKey;
const prop = createObjectProperty;
const number = createNumber;
const doc = createDocument;
const comment = createComment;

const ast = object([prop(key("a"), number("1")), prop(key("b"), number("2"))], null, [
  comment(" This is a comment"),
  comment(" This is another comment"),
]);

export = {
  ast: doc(ast),
  options: { verbose: false },
};
