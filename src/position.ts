interface PositionLocation {
  line: number;
  column: number;
  char: string;
}

export default class Position {
  constructor(
    private readonly startLine: number,
    private readonly startColumn: number,
    private readonly startChar: number,
    private readonly endLine: number,
    private readonly endColumn: number,
    private readonly endChar: number
  ) {}

  get start() {
    return {
      line: this.startLine,
      column: this.startColumn,
      char: this.startChar
    };
  }

  get end() {
    return { line: this.endLine, column: this.endColumn, char: this.endChar };
  }

  get human() {
    return `${this.startLine}:${this.startColumn} - ${this.endLine}:${this.endColumn} [${this.startChar}:${this.endChar}]`;
  }
}
