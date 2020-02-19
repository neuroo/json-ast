import { createDocument, createObject, createObjectKey, createObjectProperty, createString } from "../types";

const object = createObject;
const key = createObjectKey;
const prop = createObjectProperty;
const string = createString;
const doc = createDocument;

const ast = object([
  prop(key('quota\\"tion'), string("reverse\\\\solidus")),
  prop(key("soli\\/dus"), string("back\\bspace")),
  prop(key("form\\ffeed"), string("new\\nline")),
  prop(key("re\\rturn"), string("tab\\tsymbol")),
  prop(key("hex\\u0001digit"), string("")),
  prop(key('\\"\\"\\"\\"'), string("\\\\\\\\\\\\")),
  prop(key("\\/"), string("\\b")),
  prop(key('\\"\\/'), string('\\"\\\\\\/\\b\\f\\n\\r\\t\\u0001')),
]);

export = {
  ast: doc(ast),
  options: { verbose: false },
};
