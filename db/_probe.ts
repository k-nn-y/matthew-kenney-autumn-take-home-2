import { getPeriods, getHeadline, getCostComparison, getIncrementality, getInsights, getMonthlySeries, getProperty } from "@/lib/queries";
import { pool } from "@/lib/db";

async function main() {
  const prop = await getProperty();
  console.log("PROPERTY", prop);
  for (const range of ["last_30", "last_90", "ytd", "last_12m"] as const) {
    const periods = await getPeriods(range);
    const [h, c, i] = await Promise.all([
      getHeadline(periods),
      getCostComparison(periods.current),
      getIncrementality(periods.current),
    ]);
    console.log("\n===", range, JSON.stringify(periods));
    console.log("headline", h);
    console.log("cost", c);
    console.log("incr", i);
  }
  const insights = await getInsights(6);
  console.log("\nINSIGHTS", JSON.stringify(insights, null, 2));
  const series = await getMonthlySeries(24);
  console.log("\nSERIES", JSON.stringify(series));
  await pool.end();
}
main();
