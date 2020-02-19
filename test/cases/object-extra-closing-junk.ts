import {
  createArray,
  createComment,
  createDocument,
  createNumber,
  createObject,
  createObjectKey,
  createObjectProperty,
} from "../types";

const doc = createDocument;
const comment = createComment;
const object = createObject;
const array = createArray;
const key = createObjectKey;
const prop = createObjectProperty;
const number = createNumber;

export = {
  ast: doc(
    object([prop(key("a"), number("1")), prop(key("b"), array([number("1"), number("2"), number("3")]))]),
    null,
    [comment(" Some stuff we don't care about"), comment(" Yet another")],
  ),
  options: { verbose: false, junker: true },
};
