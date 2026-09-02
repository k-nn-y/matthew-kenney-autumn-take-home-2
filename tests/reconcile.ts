/**
 * Reconciliation assert, read-only: for every period, every screen-2 section
 * (split, channels, markets — counts and dollars — and the full ledger) must
 * derive from the same booking set as screen 1's verdict. Exits non-zero on
 * the first screen that could show an owner two different truths.
 *
 * Run: npm run test:reconcile
 */
import { pool } from "../src/lib/db";
import {
  getChannelBreakdown, getFeederMarkets, getHeadline, getIncrementality,
  getPeriods, getRecentBookings, type RangeKey,
} from "../src/lib/queries";

async function main() {
const RANGES: RangeKey[] = ["last_30", "last_90", "ytd", "last_12m"];

let failures = 0;

function check(range: RangeKey, name: string, actual: number, expected: number) {
  const ok = actual === expected;
  if (!ok) failures++;
  console.log(
    `${ok ? "  ok " : "FAIL "} ${range.padEnd(9)} ${name.padEnd(28)} ${actual} ${ok ? "==" : "!="} ${expected}`,
  );
}

for (const range of RANGES) {
  const periods = await getPeriods(range);
  const [headline, inc, channels, feeders, ledger] = await Promise.all([
    getHeadline(periods),
    getIncrementality(periods.current),
    getChannelBreakdown(periods.current),
    getFeederMarkets(periods.current),
    getRecentBookings(periods.current, 100000),
  ]);

  const verdictBookings = headline.bookings;
  const verdictValue = headline.valueCents;

  check(range, "split: byName + newToYou", inc.byName + inc.newToYou, verdictBookings);
  check(range, "channels: sum bookings", channels.reduce((t, c) => t + c.bookings, 0), verdictBookings);
  check(range, "channels: sum dollars", channels.reduce((t, c) => t + c.valueCents, 0), verdictValue);
  check(range, "markets: sum bookings", feeders.reduce((t, f) => t + f.bookings, 0), verdictBookings);
  check(range, "markets: sum dollars", feeders.reduce((t, f) => t + f.valueCents, 0), verdictValue);
  check(range, "ledger: row count", ledger.length, verdictBookings);
  check(range, "ledger: sum dollars", ledger.reduce((t, b) => t + b.totalValueCents, 0), verdictValue);
}

await pool.end();

if (failures > 0) {
  console.error(`\n${failures} reconciliation failure(s) — screen 2 is not counting screen 1's bookings.`);
  process.exit(1);
}
console.log("\nAll sections reconcile with the verdict, all periods.");
}

main().catch((err) => {
  console.error(err);
  process.exit(1);
});
