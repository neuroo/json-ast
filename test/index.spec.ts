import * as fs from "fs";
import * as path from "path";
import { JsonComment, JsonDocument, JsonKey, JsonProperty, parse, ParseSettings, toJSON, Visitor } from "../src";
import { IJsonValue } from "../src/ast";

function readFile(file: string): string {
  let src = fs.readFileSync(file, "utf8");
  // normalize line endings
  src = src.replace(/\r\n/, "\n");
  // remove trailing newline
  src = src.replace(/\n$/, "");

  return src;
}

function getCases(
  dirname: string,
  callback: (
    caseName: string,
    inputFile: string,
    expectedFile: { ast: JsonDocument; options: ParseSettings; error: Error; visitor: any },
  ) => void,
): void {
  const folderPath = path.join(__dirname, dirname);
  const folder = fs.readdirSync(folderPath);
  const cases = folder
    .filter(function(_case) {
      return path.extname(_case) === ".json" && _case.charAt(0) !== "_";
    })
    .map(function(fileName) {
      return path.basename(fileName, ".json");
    });

  for (const _case of cases) {
    const inputFile = readFile(path.join(folderPath, _case + ".json"));
    // eslint-disable-next-line @typescript-eslint/no-var-requires
    const expectedFile = require(path.join(folderPath, _case + ".ts"));
    if (callback) {
      callback(_case, inputFile, expectedFile);
    }
  }
}

describe("Test cases", function() {
  getCases("cases", function(caseName, inputFile, expectedFile) {
    it(caseName, function() {
      const parsedFile = parse(inputFile, expectedFile.options);
      // Now that we include methods in each Node, a simple way to test for
      // equality is to serialize the objects.
      expect(JSON.stringify(parsedFile)).toEqual(JSON.stringify(expectedFile.ast));
    });
  });
});

describe("Error test cases", function() {
  getCases("error-cases", function(caseName, inputFile, expectedFile) {
    it(caseName, function() {
      try {
        parse(inputFile, expectedFile.options);
        expect(false).toBeTruthy();
      } catch (e) {
        expect(expectedFile.error.message).toEqual(e.message);
      }
    });
  });
});

// A simple visitor that will aggregate the values by type of Node
class TestAccumulatorVisitor extends Visitor {
  private store: any;

  constructor(store) {
    super();
    this.store = store;
  }

  public comment(commentNode: JsonComment): void {
    this.store.comments = this.store.comments || [];
    this.store.comments.push(commentNode.value);
  }

  public key(keyNode: JsonKey): void {
    this.store.keys = this.store.keys || [];
    this.store.keys.push(keyNode.value);
  }

  public value(valueNode: IJsonValue): void {
    this.store.values = this.store.values || [];
    this.store.values.push(valueNode.value);
  }
}

describe("Visitor cases", function() {
  getCases("visitor-cases", function(caseName, inputFile, expectedFile) {
    it(caseName, function() {
      const documentNode = parse(inputFile);
      const store: any = {};
      const accVisitor = new TestAccumulatorVisitor(store);

      documentNode.accept(accVisitor);
      expect(store.comments).toEqual(expectedFile.visitor.comments);
      expect(store.keys).toEqual(expectedFile.visitor.keys);
      expect(store.values).toEqual(expectedFile.visitor.values);
    });
  });
});

class SkipAfterAKey extends Visitor {
  private _store: any;

  constructor(store) {
    super();
    this._store = store;
  }

  public property(propNode: JsonProperty): void {
    const keyNode = propNode.key;
    // stop when the first prop key name has more than 2 char
    if (keyNode.value.length > 1) this.stop = true;
  }

  public value(valueNode: IJsonValue): void {
    this._store.push(valueNode.value);
  }
}

describe("Visitor pattern", function() {
  it("should stop traversal when the user decides to", function() {
    const JSON_TESTCASE = `{
      "a": 1,
      "b": {
        "ba": 2
      },
      "c": 3,
    }`;

    const documentNode = parse(JSON_TESTCASE);
    const store = [];
    const accVisitor = new SkipAfterAKey(store);

    documentNode.accept(accVisitor);
    expect(store).toEqual([1]);
  });
});

describe("Object conversion to native JSON", function() {
  it("should convert properly basic structures", function() {
    const JSON_TESTCASE = {
      a: 1,
      b: { ba: 2 },
      c: 3,
      d: {
        da: [1, 2, 3, "4"],
        db: { true: true, false: false, float: -1.0223, null: null },
        dc: [
          {
            true: true,
            false: false,
            float: -15345345.0223,
            null: null,
          },
          {
            true: true,
            false: false,
            float: -1.0233323,
            null: null,
          },
        ],
      },
      e: null,
    };

    const NORMAL_JSON_BUFFER = JSON.stringify(JSON_TESTCASE);
    const documentNode = parse(NORMAL_JSON_BUFFER);

    expect(JSON_TESTCASE).toEqual(toJSON(documentNode));
  });
});
