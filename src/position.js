
export default class Position {
  constructor(startLine, startColumn, startChar, endLine, endColumn, endChar) {
    this._start = {line : startLine, column : startColumn, char : startChar};
    this._end = {line : endLine, column : endColumn, char : endChar};
    this._human =
        `${startLine}:${startColumn} - ${endLine}:${endColumn} [${startChar}:${endChar}]`;
  }

  get start() { return this._start; }

  get end() { return this._end; }

  get human() { return this._human; }
};
