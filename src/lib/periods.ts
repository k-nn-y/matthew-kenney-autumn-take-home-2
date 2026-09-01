import type { RangeKey } from "./queries";

/**
 * The URL adapter for the period control. The window itself — its dates, its
 * two comparisons, its labels — is resolved by `getPeriods()` in queries.ts;
 * this file only decides what a query string is allowed to say and turns it
 * into that layer's `RangeKey`.
 *
 * It is separate from PeriodPicker because the picker is a client island and
 * a Server Component has to be able to read `?period=` without pulling the
 * island into its module graph. The import above is type-only, so nothing
 * from the query layer — least of all the pg pool — reaches the browser.
 *
 * The control is a contract, not a filter: one choice governs every number on
 * both screens, so no card can be quietly on a different window
 * (DASHBOARD_REFERENCES §5, "the single biggest trust device a report can
 * have").
 */

export type PeriodKey = RangeKey;

export const PERIOD_OPTIONS: readonly { key: PeriodKey; label: string }[] = [
  { key: "last_30", label: "Last 30 days" },
  { key: "last_90", label: "Last 90 days" },
  { key: "ytd", label: "Year to date" },
  { key: "last_12m", label: "Last 12 months" },
];

/**
 * Ninety days, matching `getPeriods()`'s own default. At roughly ten bookings
 * a month the relative noise on a single month is ~32% and on three months
 * ~18% (METRIC_SEMANTICS — "the rolling-three-month recommendation is endorsed
 * as-is"), and the research is explicit that a rolling quarter belongs as the
 * default view rather than as an option buried on screen 2.
 */
export const DEFAULT_PERIOD: PeriodKey = "last_90";

/** The picker's own wording for a key, for prose that has to name the choice. */
export function periodLabel(key: PeriodKey): string {
  return PERIOD_OPTIONS.find((option) => option.key === key)!.label;
}

/**
 * A query string is untrusted input. Anything that is not one of the four
 * offered windows falls back to the default rather than erroring — a stale
 * bookmark should show the owner his numbers, not a stack trace.
 */
export function normalizePeriod(raw: string | string[] | undefined): PeriodKey {
  const value = Array.isArray(raw) ? raw[0] : raw;
  return PERIOD_OPTIONS.some((option) => option.key === value)
    ? (value as PeriodKey)
    : DEFAULT_PERIOD;
}
