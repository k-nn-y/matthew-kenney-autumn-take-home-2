/**
 * Presentation-only date words. The query layer speaks ISO and the reader
 * doesn't, so the translation happens here at the edge — parsed as plain
 * strings, never through Date-with-timezone, because "2026-06-03" must be
 * June 3 in the inn's world no matter where the server happens to run.
 */

const MONTHS = [
  "January", "February", "March", "April", "May", "June",
  "July", "August", "September", "October", "November", "December",
];

const parts = (iso: string) => {
  const [y, m, d] = iso.slice(0, 10).split("-").map(Number);
  return { y, m, d };
};

/** "June 3" */
export function spoken(iso: string): string {
  const { m, d } = parts(iso);
  return `${MONTHS[m - 1]} ${d}`;
}

/** "June 3, 2026" */
export function spokenWithYear(iso: string): string {
  return `${spoken(iso)}, ${parts(iso).y}`;
}

/**
 * The two ends of a window, worded the way a person would say them: years
 * only when the window crosses one, said once each.
 */
export function spokenRange(start: string, end: string): [string, string] {
  const a = parts(start);
  const b = parts(end);
  if (a.y === b.y) return [spoken(start), spoken(end)];
  return [spokenWithYear(start), spokenWithYear(end)];
}

/**
 * A whole window as one phrase with its year said exactly once:
 * "June 3 to August 31, 2026" — or twice when it genuinely crosses one.
 */
export function spokenRangeWithYear(start: string, end: string): string {
  const a = parts(start);
  const b = parts(end);
  if (a.y === b.y) return `${spoken(start)} to ${spoken(end)}, ${a.y}`;
  return `${spokenWithYear(start)} to ${spokenWithYear(end)}`;
}

/** "Aug 26" — the ledger's column width budget. */
export function spokenShort(iso: string): string {
  const { m, d } = parts(iso);
  return `${MONTHS[m - 1].slice(0, 3)} ${d}`;
}

/** "DEC ’25" — the chart's annotation tags. */
export function monthTag(iso: string): string {
  const { y, m } = parts(iso);
  return `${MONTHS[m - 1].slice(0, 3).toUpperCase()} \u2019${String(y).slice(2)}`;
}
