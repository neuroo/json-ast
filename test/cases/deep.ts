import {
  createArray,
  createDocument,
  createObject,
  createObjectKey,
  createObjectProperty,
  createString,
} from "../types";

const key = createObjectKey;

const object = createObject;
const prop = createObjectProperty;
const array = createArray;
const string = createString;
const doc = createDocument;

const n = array([string("n")] /*, position()*/);
const m = array([string("m"), n] /*, position()*/);
const l = array([string("l"), m] /*, position()*/);
const k = array([string("k"), l] /*, position()*/);
const j = array([string("j"), k] /*, position()*/);
const i = array([string("i"), j] /*, position()*/);
const h = array([string("h"), i] /*, position()*/);
const g = object([prop(key("g"), h)] /*, position()*/);
const f = object([prop(key("f"), g)] /*, position()*/);
const e = object([prop(key("e"), f)] /*, position()*/);
const d = object([prop(key("d"), e)] /*, position()*/);
const c = object([prop(key("c"), d)] /*, position()*/);
const b = object([prop(key("b" /*, position(3, 5, 15, 3, 8, 18)*/), c)] /*, position()*/);
const a = object([prop(key("a" /*, position(2, 3, 4, 2, 6, 7)*/), b)] /*, position(1, 1, 0, 29, 2, 516)*/);

export = {
  ast: doc(a),
  options: { verbose: false },
};
