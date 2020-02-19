interface PositionLocation {
  line: number;
  column: number;
  char: number;
}

export class JsonPosition {
  constructor(
    private readonly startLine: number,
    private readonly startColumn: number,
    private readonly startChar: number,
    private readonly endLine: number,
    private readonly endColumn: number,
    private readonly endChar: number,
  ) {}

  get start(): PositionLocation {
    return {
      line: this.startLine,
      column: this.startColumn,
      char: this.startChar,
    };
  }

  get end(): PositionLocation {
    return { line: this.endLine, column: this.endColumn, char: this.endChar };
  }

  get human(): string {
    return `${this.startLine}:${this.startColumn} - ${this.endLine}:${this.endColumn} [${this.startChar}:${this.endChar}]`;
  }
}
