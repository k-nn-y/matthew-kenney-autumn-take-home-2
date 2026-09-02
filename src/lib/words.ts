/**
 * Small counts said the way a person says them. The verdict's comparison
 * sentence reads "One booking fewer", not "1 booking fewer"; past twenty the
 * digits are clearer than the words.
 */

const SMALL = [
  "zero", "one", "two", "three", "four", "five", "six", "seven", "eight",
  "nine", "ten", "eleven", "twelve", "thirteen", "fourteen", "fifteen",
  "sixteen", "seventeen", "eighteen", "nineteen", "twenty",
];

export function asWord(n: number): string {
  return n >= 0 && n <= 20 ? SMALL[n] : String(n);
}

export function asWordCap(n: number): string {
  const w = asWord(n);
  return w.charAt(0).toUpperCase() + w.slice(1);
}

/** "one booking" / "two bookings" — count plus its noun, agreed. */
export function countNoun(n: number, noun: string): string {
  return `${asWord(n)} ${noun}${n === 1 ? "" : "s"}`;
}
