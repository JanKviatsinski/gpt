export function createArrayFromText(text: string): string[] {
  return text.trim().split(/(?<=[.!?])\s+/);
}
