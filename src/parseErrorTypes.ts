export function unexpectedEnd(): string {
  return "Unexpected end of JSON input";
}

export function unexpectedToken(token: string, line: number, column: number): string {
  return `Unexpected token <${token}> at ${line}:${column}`;
}
