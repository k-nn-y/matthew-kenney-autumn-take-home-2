import Link from "next/link";
import { AppHeader } from "@/components/AppHeader";
import { PeriodPicker } from "@/components/PeriodPicker";
import { Stat } from "@/components/Stat";
import { dollars } from "@/lib/db";
import { normalizePeriod } from "@/lib/periods";
import {
  getCostComparison, getHeadline, getIncrementality, getInsights,
  getMonthlySeries, getPeriods, getProperty,
} from "@/lib/queries";
import styles from "./page.module.css";

export const dynamic = "force-dynamic";

const pct = (a: number, b: number) => (b === 0 ? null : Math.round(((a - b) / b) * 100));

/**
 * Screen 1 answers Don's first five questions and stops. The cut line from the
 * research: if it can only hold three things, it holds bookings, dollars, and
 * cost against the commission he would otherwise have paid.
 *
 * Deliberately absent: any alarm on a month-over-month move. At roughly ten
 * bookings a month a 45% swing is one standard deviation of ordinary noise, so a
 * dashboard that flagged it would cry wolf about a third of the time.
 */
export default async function Results({
  searchParams,
}: {
  searchParams: Promise<{ period?: string }>;
}) {
  const range = normalizePeriod((await searchParams).period);
  const [property, periods] = await Promise.all([getProperty(), getPeriods(range)]);
  if (!property) return null;

  const [headline, cost, inc, insights, series] = await Promise.all([
    getHeadline(periods),
    getCostComparison(periods.current),
    getIncrementality(periods.current),
    getInsights(4),
    getMonthlySeries(24),
  ]);

  const yoy = pct(headline.valueCents, headline.lastYearValueCents);
  const saved = cost.otaCommissionCents - cost.totalCostCents;
  const incTotal = inc.byName + inc.newToYou;

  return (
    <>
      <AppHeader propertyName={property.name} town={property.town} />
      <main className="au-shell">
        <div className={styles.head}>
          <div>
            <h1 className={styles.title}>What your marketing did</h1>
            <p className={styles.sub}>
              {property.name} · {periods.current.label.toLowerCase()}
            </p>
          </div>
          <PeriodPicker value={range} />
        </div>

        {/* Rank 1 — how many bookings, and what are they worth. Nothing else
            gets to be the first number on this screen. */}
        <section className={styles.headline} aria-labelledby="h-drove">
          <h2 id="h-drove" className="au-sr-only">Bookings we drove</h2>
          <Stat
            label="Bookings we drove"
            value={<span className="au-num au-figure">{headline.bookings}</span>}
            sub={`${periods.current.label.toLowerCase()}, from guests who arrived through a Google ad`}
          />
          <Stat
            label="What they're worth"
            value={<span className="au-num au-figure">{dollars(headline.valueCents)}</span>}
            sub="Room revenue from those bookings, before tax"
          />
        </section>

        {/* Rank 2 — his fluent subject and his stated worst pain. */}
        <section className={styles.card} aria-labelledby="h-cost">
          <h2 id="h-cost" className={styles.h2}>What it cost you</h2>
          <div className={styles.costGrid}>
            <Stat label="Google ad spend" value={<span className="au-num">{dollars(cost.adSpendCents)}</span>}
              sub="Paid by Autumn, not billed to you" />
            <Stat label={`Autumn's ${Math.round(cost.autumnFeePct * 100)}%`} value={<span className="au-num">{dollars(cost.autumnFeeCents)}</span>}
              sub="Only on the bookings above" />
            <Stat label="Your total cost" value={<span className="au-num">{dollars(cost.totalCostCents)}</span>}
              sub="Nothing fixed, nothing monthly" />
          </div>
          <p className={styles.note}>
            The same {headline.bookings} bookings through a travel agent at{" "}
            {Math.round(cost.otaCommissionPct * 100)}% commission would have cost{" "}
            <strong className="au-num">{dollars(cost.otaCommissionCents)}</strong>.{" "}
            {saved > 0
              ? <>That is <strong className="au-num">{dollars(saved)}</strong> that stayed with you.</>
              : <>That is <strong className="au-num">{dollars(-saved)}</strong> more than commission would have been this period.</>}
          </p>
        </section>

        {/* Rank 3 — the sophisticated doubt. Volunteering the caveat is what
            earns the number the right to be believed. */}
        <section className={styles.card} aria-labelledby="h-anyway">
          <h2 id="h-anyway" className={styles.h2}>Would you have got these anyway?</h2>
          <div className={styles.splitBar} aria-hidden="true">
            <span className={styles.splitByName} style={{ flexGrow: inc.byName || 1 }} />
            <span className={styles.splitNew} style={{ flexGrow: inc.newToYou || 1 }} />
          </div>
          <div className={styles.splitLegend}>
            <Stat label="Searched for you by name" value={<span className="au-num">{inc.byName}</span>} />
            <Stat label="Didn't know you yet" value={<span className="au-num">{inc.newToYou}</span>} />
          </div>
          <p className={styles.note}>
            Some of the {inc.byName} guests who searched for {property.name} by name would
            have found you without an ad — you rank first for your own name. The{" "}
            {inc.newToYou} who did not know you yet are the ones the advertising is really
            for. We show you both because the honest number is the useful one.
          </p>
        </section>

        {/* Rank 4 — his year is a reserve-building cycle, so the comparison that
            matters is the same dates last year, never last month. */}
        <section className={styles.card} aria-labelledby="h-year">
          <h2 id="h-year" className={styles.h2}>Against this time last year</h2>
          <p className={styles.lead}>
            {headline.lastYearBookings === 0 ? (
              <>We were not running your ads {periods.lastYear.label.toLowerCase()}, so there is
              nothing to compare against yet. Next year this line will have an answer.</>
            ) : (
              <>
                You booked <strong className="au-num">{headline.bookings}</strong> through us this
                period against <strong className="au-num">{headline.lastYearBookings}</strong> in the
                same dates last year, worth <strong className="au-num">{dollars(headline.valueCents)}</strong>{" "}
                against <strong className="au-num">{dollars(headline.lastYearValueCents)}</strong>
                {yoy !== null && <> — {yoy >= 0 ? "up" : "down"} {Math.abs(yoy)}%</>}.
              </>
            )}
          </p>
          <Trend series={series} />
          <p className={styles.footnote}>
            Two years of bookings we drove, by the month they were booked. Single months
            move around a lot at this size — a swing of up to about half is ordinary for an
            inn your size, so the shape over a season is the part worth reading.
          </p>
        </section>

        {/* Rank 5 + 7 — answered in sentences by a person, not inferred from a chart. */}
        <section className={styles.card} aria-labelledby="h-now">
          <h2 id="h-now" className={styles.h2}>Anything you need to know</h2>
          <ul role="list" className={styles.insights}>
            {insights.map((i) => (
              <li key={i.insight_id} className={styles.insight}>
                <p className={styles.insightWhen}>
                  {new Date(i.published_at).toLocaleDateString("en-US", {
                    month: "long", day: "numeric", year: "numeric",
                  })}
                </p>
                <h3 className={styles.insightHead}>{i.headline}</h3>
                <p className="au-body">{i.body}</p>
                <p className={styles.insightAction}>
                  {i.action_needed_from_owner ?? "Nothing needed from you."}
                </p>
              </li>
            ))}
          </ul>
        </section>

        <p className={styles.more}>
          <Link href={`/how-it-happened?period=${range}`} className="au-btn au-btn-primary">
            See how these bookings happened
          </Link>
        </p>
      </main>
    </>
  );
}

/** Two years of booking counts. Inline SVG in ink and rule — no chart library,
 *  no second series, no gridlines competing with the bars. */
function Trend({ series }: { series: { month: string; bookings: number }[] }) {
  if (series.length === 0) return null;
  const max = Math.max(...series.map((p) => p.bookings), 1);
  const W = 720, H = 132, gap = 3;
  const bw = (W - gap * (series.length - 1)) / series.length;

  return (
    <svg className={styles.trend} viewBox={`0 0 ${W} ${H}`} role="img"
      aria-label={`Bookings we drove each month. Highest month ${max}.`}>
      {series.map((p, i) => {
        const h = Math.max(1, (p.bookings / max) * (H - 22));
        return (
          <g key={p.month}>
            <rect x={i * (bw + gap)} y={H - 18 - h} width={bw} height={h}
              fill="var(--au-ink)" opacity={p.bookings === 0 ? 0.12 : 0.82} rx="1" />
            {i % 6 === 0 && (
              <text x={i * (bw + gap)} y={H - 4} fontSize="10" fill="var(--au-muted)">
                {new Date(`${p.month}-02`).toLocaleDateString("en-US", { month: "short", year: "2-digit" })}
              </text>
            )}
          </g>
        );
      })}
    </svg>
  );
}
