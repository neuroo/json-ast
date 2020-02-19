function showCodeFragment(source: string, linePosition: number, columnPosition: number): string {
  const lines = source.split(/\n|\r\n?|\f/);
  const line = lines[linePosition - 1];
  const marker = new Array(columnPosition).join(" ") + "^";

  return `${line}\n${marker}`;
}

class ParseError extends SyntaxError {
  constructor(message, source, linePosition, columnPosition) {
    const fullMessage = linePosition
      ? message + "\n" + showCodeFragment(source, linePosition, columnPosition)
      : message;
    super(fullMessage);
    this.message = message;
  }
}

export function error(message: string, source?: string, line?: number, column?: number): void {
  throw new ParseError(message, source, line, column);
}
