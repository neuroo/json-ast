export function cannotTokenizeSymbol(symbol: string, line: number, column: number): string {
  return `Cannot tokenize symbol <${symbol}> at ${line}:${column}`;
}
