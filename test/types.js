function position(startLine, startColumn, startChar, endLine, endColumn,
                  endChar) {
  return {
    start: {line : startLine, column : startColumn, char : startChar},
        end: {line : endLine, column : endColumn, char : endChar},
        human:
            `${startLine}:${startColumn} - ${endLine}:${endColumn} [${startChar}:${endChar}]`
  }
}

function createDocument(value, position, comments) {
  var result = {
    type : 'document',
    value : value,
    comments : comments || [],
    accept : function() {}
  };

  if (position) {
    result.position = position;
  }

  return result;
}

function createObjectKey(value, position) {
  var result = {type : 'key', value : value, accept : function() {}};

  if (position) {
    result.position = position;
  }

  return result;
}

function createObjectProperty(key, value) {
  return {
    type: 'property', key: key, value: value, accept: function() {}
  }
}

function createObject(properties, position, comments) {
  var result = {
    type : 'object',
    properties : properties,
    comments : comments || [],
    accept : function() {}
  };

  if (position) {
    result.position = position;
  }

  return result;
}

function createArray(items, position, comments) {
  var result = {
    type : 'array',
    items : items,
    comments : comments || [],
    accept : function() {}
  };

  if (position) {
    result.position = position;
  }

  return result;
}

function createComment(value, position) {
  var result = {type : 'comment', value : value, accept : function() {}};

  if (position) {
    result.position = position;
  }

  return result;
}

function createString(value, position) {
  var result = {type : 'string', value : value, accept : function() {}};

  if (position) {
    result.position = position;
  }

  return result;
}

function createNumber(value, position) {
  var result = {type : 'number', value : value, accept : function() {}};

  if (position) {
    result.position = position;
  }

  return result;
}

function createTrue(position) {
  var result = {type : 'true', value : null, accept : function() {}};

  if (position) {
    result.position = position;
  }

  return result;
}

function createFalse(position) {
  var result = {type : 'false', value : null, accept : function() {}};

  if (position) {
    result.position = position;
  }

  return result;
}

function createNull(position) {
  var result = {type : 'null', value : null, accept : function() {}};

  if (position) {
    result.position = position;
  }

  return result;
}

module.exports = {
  position : position,
  createDocument : createDocument,
  createComment : createComment,
  createObjectKey : createObjectKey,
  createObjectProperty : createObjectProperty,
  createObject : createObject,
  createArray : createArray,
  createString : createString,
  createNumber : createNumber,
  createTrue : createTrue,
  createFalse : createFalse,
  createNull : createNull
};
