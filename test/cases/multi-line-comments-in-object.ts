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
    object(
      [
        prop(key("a"), number("1")),
        prop(key("b"), array([number("1")], null, [comment(" null-value"), comment("/* /* /* /* /* /")])),
      ],
      null,
      [comment(" first-comment"), comment("\n\n    This is a multi-line comment\n\n  "), comment(" second-comment")],
    ),
    null,
    [
      comment(" before-everything - 1"),
      comment(" before-everything - 2"),
      comment(" after-everything"),
      comment("\n\nYet another comment\n\n"),
    ],
  ),
  options: { verbose: false },
};
