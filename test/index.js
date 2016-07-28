var fs = require('fs');
var path = require('path');
var util = require('util');
var assert = require('assert');
var _ = require('lodash');
var json_to_ast = require('../src');

var parse = json_to_ast.parse;
var Visitor = json_to_ast.Visitor;

function readFile(file) {
  var src = fs.readFileSync(file, 'utf8');
  // normalize line endings
  src = src.replace(/\r\n/, '\n');
  // remove trailing newline
  src = src.replace(/\n$/, '');

  return src;
}

function getCases(dirname, callback) {
  var folderPath = path.join(__dirname, dirname);
  var folder = fs.readdirSync(folderPath);
  var cases =
      folder
          .filter(function(_case) {
            return path.extname(_case) === '.json' && _case.charAt(0) !== '_';
          })
          .map(function(fileName) { return path.basename(fileName, '.json'); });

  cases.forEach(function(_case) {
    var inputFile = readFile(path.join(folderPath, _case + '.json'));
    var expectedFile = require(path.join(folderPath, _case + '.js'));
    if (callback) {
      callback(_case, inputFile, expectedFile);
    }
  });
}

describe('Test cases', function() {
  getCases('cases', function(caseName, inputFile, expectedFile) {
    it(caseName, function() {
      var parsedFile = parse(inputFile, expectedFile.options);
      // Now that we include methods in each Node, a simple way to test for
      // equality is to serialize the objects.
      assert.deepEqual(JSON.stringify(parsedFile),
                       JSON.stringify(expectedFile.ast), 'asts are not equal');
    });
  });
});

describe('Error test cases', function() {
  getCases('error-cases', function(caseName, inputFile, expectedFile) {
    it(caseName, function() {
      try {
        parse(inputFile, expectedFile.options);
        assert(false);
      } catch (e) {
        assert.deepEqual(expectedFile.error.message, e.rawMessage,
                         'asts are not equal');
      }
    });
  });
});

// A simple visitor that will aggregate the values by type of Node
class TestAccumulatorVisitor extends Visitor {
  constructor(store) {
    super();
    this.store = store;
  }

  comment(commentNode) {
    this.store.comments = this.store.comments || [];
    this.store.comments.push(commentNode.value);
  };

  key(keyNode) {
    this.store.keys = this.store.keys || [];
    this.store.keys.push(keyNode.value);
  };

  value(valueNode) {
    this.store.values = this.store.values || [];
    this.store.values.push(valueNode.value);
  }
};

describe('Visitor cases', function() {
  getCases('visitor-cases', function(caseName, inputFile, expectedFile) {
    it(caseName, function() {
      const documentNode = parse(inputFile, inputFile, expectedFile);
      const store = {};
      const accVisitor = new TestAccumulatorVisitor(store);

      documentNode.accept(accVisitor);
      assert.deepEqual(store.comments, expectedFile.visitor.comments);
      assert.deepEqual(store.keys, expectedFile.visitor.keys);
      assert.deepEqual(store.values, expectedFile.visitor.values);
    });
  });
});
