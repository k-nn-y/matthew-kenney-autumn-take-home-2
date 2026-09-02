import type { Metadata } from "next";
import {
  getProperty,
  getPeriods,
  getHeadline,
  getCostComparison,
  getInsights,
  getMonthlySeries,
  getFeederMarkets,
  getHouseTotal,
  getReportedThrough,
} from "@/lib/queries";
import type { Insight } from "@/lib/types";
import { dollars } from "@/lib/db";
import { spoken, spokenRange, spokenRangeWithYear, spokenWithYear } from "@/app/dates";
import { asWord, asWordCap } from "@/lib/words";
import { normalizePeriod } from "@/lib/periods";
import { PeriodPicker } from "@/components/PeriodPicker";
import { Door } from "@/components/Door";
import { InfoGlyph } from "@/components/InfoGlyph";
import { SeasonChart } from "@/components/SeasonChart";

export const metadata: Metadata = { title: "Your results · Autumn" };
export const dynamic = "force-dynamic";

/* ------------------------------------------------------------- shared bits */

const KICKER = "text-[12px] leading-[16px] tracking-[0.18em] font-label uppercase";
const STAT_SUB =
  "text-[14px] leading-[20px] tracking-[-0.01em] text-(--au-muted-strong)";

const KIND_CHIP: Record<Insight["kind"], string> = {
  all_clear: "All clear",
  heads_up: "Heads up",
  what_changed: "What changed",
  what_we_did: "What we did",
  resolved: "Resolved",
};

/** "Heads up. Another property began bidding…" — prefix plus authored headline. */
function rowText(insight: Insight): string {
  const head = insight.headline.trim();
  return `${KIND_CHIP[insight.kind]}. ${head}${/[.?!]$/.test(head) ? "" : "."}`;
}

/** WHAT CHANGED THIS SUMMER when the window sits inside one season. */
function seasonHeading(startIso: string, endIso: string): string {
  const seasons: Record<string, number[]> = {
    winter: [12, 1, 2],
    spring: [3, 4, 5],
    summer: [6, 7, 8],
    fall: [9, 10, 11],
  };
  const months = new Set<number>();
  const d = new Date(`${startIso.slice(0, 7)}-01T00:00:00`);
  const end = new Date(`${endIso.slice(0, 7)}-01T00:00:00`);
  while (d <= end && months.size <= 4) {
    months.add(d.getMonth() + 1);
    d.setMonth(d.getMonth() + 1);
  }
  for (const [name, set] of Object.entries(seasons)) {
    if ([...months].every((m) => set.includes(m))) {
      return `What changed this ${name}`;
    }
  }
  return "What changed";
}

/** "One booking fewer than the same dates last year, worth $991 more." */
function comparison(
  bookings: number,
  valueCents: number,
  lyBookings: number,
  lyValueCents: number,
): string {
  const db = bookings - lyBookings;
  const dv = valueCents - lyValueCents;
  const value =
    dv === 0
      ? "worth about the same"
      : `worth ${dollars(Math.abs(dv))} ${dv > 0 ? "more" : "less"}`;
  if (db === 0) {
    return `The same number of bookings as the same dates last year, ${value}.`;
  }
  const word = asWordCap(Math.abs(db));
  const noun = Math.abs(db) === 1 ? "booking" : "bookings";
  return `${word} ${noun} ${db > 0 ? "more" : "fewer"} than the same dates last year, ${value}.`;
}

/** "Of these 24, five booked from Boston metro, three from…" */
function feederSentence(
  total: number,
  markets: { market: string; bookings: number }[],
): string {
  if (total === 0 || markets.length === 0) {
    return "No places to show for these dates.";
  }
  const top = markets.slice(0, 3);
  const parts = top.map(
    (m, i) =>
      `${asWord(m.bookings)}${i === 0 ? " booked" : ""} from ${m.market}`,
  );
  const listed =
    parts.length > 1
      ? `${parts.slice(0, -1).join(", ")} and ${parts[parts.length - 1]}`
      : parts[0];
  const rest = total - top.reduce((s, m) => s + m.bookings, 0);
  const restPlaces = markets.length - top.length;
  if (rest <= 0 || restPlaces <= 0) {
    return `Of these ${total}, ${listed}.`;
  }
  return `Of these ${total}, ${listed}; the other ${asWord(rest)} came from ${asWord(restPlaces)} more place${restPlaces === 1 ? "" : "s"}.`;
}

/* -------------------------------------------------------------------- page */

export default async function ResultsPage({
  searchParams,
}: {
  searchParams: Promise<Record<string, string | string[] | undefined>>;
}) {
  const params = await searchParams;
  const range = normalizePeriod(
    typeof params.period === "string" ? params.period : undefined,
  );
  const allNotes = params.notes === "all";

  const [property, periods, reportedThrough] = await Promise.all([
    getProperty(),
    getPeriods(range),
    getReportedThrough(),
  ]);
  const { current } = periods;

  const [headline, cost, insights, series, markets, house] = await Promise.all([
    getHeadline(periods),
    getCostComparison(current),
    getInsights(48),
    getMonthlySeries(24),
    getFeederMarkets(current),
    getHouseTotal(current),
  ]);

  const notLive = !property?.program_start_date;
  const notReported =
    !notLive && (!reportedThrough || reportedThrough < current.start);
  const zero = headline.bookings === 0;
  const [rangeStart, rangeEnd] = spokenRange(current.start, current.end);

  const feePct = Math.round((cost.autumnFeePct || 0.13) * 100);
  const otaPct = Math.round((cost.otaCommissionPct || 0.17) * 100);
  const kept = Math.max(0, cost.otaCommissionCents - cost.totalCostCents);
  const perBooking =
    headline.bookings > 0
      ? Math.round(cost.autumnFeeCents / 100 / headline.bookings)
      : 0;

  /* The note is the pinned insight (a live heads-up outranks a newer all-clear). */
  const note = insights[0] ?? null;
  const timelineAll = [...insights].sort((a, b) =>
    a.published_at.localeCompare(b.published_at),
  );
  /* Default timeline: the notes that carried consequence. Routine what-changed
     and what-we-did rows live behind "All notes", and of the all-clears only
     the most recent earns a line — three rows that tell the season's story. */
  const signal = timelineAll.filter(
    (i) => i.kind !== "what_changed" && i.kind !== "what_we_did",
  );
  const lastClear = signal.filter((i) => i.kind === "all_clear").at(-1);
  const timeline = signal
    .filter((i) => i.kind !== "all_clear" || i === lastClear)
    .slice(-3);

  /* "All notes" opens beneath the note as its own full-width ledger, newest
     first and grouped by year, split into two columns on a wide screen so a
     two-year list is not a single tall strip beside an empty column. The
     split falls on a row boundary; a column that starts mid-year repeats the
     year so the reader always knows where they are. */
  type NoteRow =
    | { kind: "year"; year: string; cont: boolean }
    | { kind: "note"; insight: Insight; latest: boolean };
  const newestFirst = [...timelineAll].reverse();
  const noteRows: NoteRow[] = [];
  for (const [i, insight] of newestFirst.entries()) {
    const year = insight.published_at.slice(0, 4);
    if (i === 0 || newestFirst[i - 1].published_at.slice(0, 4) !== year) {
      noteRows.push({ kind: "year", year, cont: false });
    }
    noteRows.push({ kind: "note", insight, latest: i === 0 });
  }
  const half = Math.ceil(noteRows.length / 2);
  const noteCols: NoteRow[][] = [noteRows.slice(0, half), noteRows.slice(half)];
  if (noteCols[1].length && noteCols[1][0].kind === "note") {
    const y = noteCols[1][0].kind === "note" ? noteCols[1][0].insight.published_at.slice(0, 4) : "";
    noteCols[1].unshift({ kind: "year", year: y, cont: true });
  }
  const noteDate = (iso: string) =>
    spoken(iso).replace(/(\w+) (\d+)/, (_, m, d) => `${m.slice(0, 3)} ${d}`);

  const doorTo = (extra: string) =>
    `${extra}${extra.includes("?") ? "&" : "?"}period=${range}`;

  /* Ads not yet live: the sheet holds one plain promise of what will appear,
     nothing else. Shown only when the property has no program start date. */
  if (notLive) {
    return (
      <div className="w-full max-w-[1216px] flex flex-col grow pt-[20px] pb-[48px] px-[24px] xl:px-[32px] rounded-(--au-r-card) bg-(--au-ground) border border-solid border-(--au-rule)">
        <div className="flex items-center justify-between flex-wrap gap-x-[16px] gap-y-[8px] w-full pb-[10px]">
          <p className="min-w-0">
            <span className={`${KICKER} text-(--au-ink)`}>Your results</span>{" "}
            <span className={`${KICKER} text-(--au-muted-strong)`}>
              · Not reported yet
            </span>
          </p>
          <PeriodPicker value={range} />
        </div>
        <section aria-labelledby="verdict" className="flex flex-col w-full gap-[4px]">
          <h1
            id="verdict"
            className="text-[34px] leading-[42px] sm:text-[45px] sm:leading-[50px] tracking-[-0.026em] text-(--au-ink) max-w-[900px] pt-[8px]"
          >
            Nothing to show yet — and that&rsquo;s expected.
          </h1>
          <p className="text-[16.5px] tracking-[-0.016em] leading-[25px] text-(--au-body) max-w-[680px] pt-[8px]">
            Your report begins the day your ads start running. Once the first
            guest clicks through, the numbers appear here the next morning
            — and we&rsquo;ll email you when that happens. Nothing is needed
            from you.
          </p>
        </section>
        <div className="flex flex-col w-full mt-[28px]">
          {[
            [
              "What it cost you",
              "will show your ad spend against the commission you\u2019d have paid",
            ],
            [
              "The shape of the season",
              "fills in as the months accumulate",
            ],
            [
              "A note from Autumn",
              "a person writes the first one the week your ads go live",
            ],
          ].map(([head, tail]) => (
            <p
              key={head}
              className="flex items-baseline flex-wrap gap-x-[10px] gap-y-[2px] py-[18px] border-t border-dashed border-t-(--au-rule-strong)"
            >
              <span className={`${KICKER} text-(--au-muted-strong)`}>{head}</span>
              <span className="text-[14.5px] leading-[20px] tracking-[-0.01em] text-(--au-body)">
                — {tail}
              </span>
            </p>
          ))}
        </div>
      </div>
    );
  }

  return (
    <div className="w-full max-w-[1216px] flex flex-col grow pt-[20px] pb-[28px] px-[24px] xl:px-[32px] rounded-(--au-r-card) bg-(--au-ground) border border-solid border-(--au-rule)">
      {/* head row */}
      <div className="flex items-center justify-between flex-wrap gap-x-[16px] gap-y-[8px] w-full pb-[10px]">
        <p className="min-w-0">
          <span className={`${KICKER} text-(--au-ink)`}>Your results</span>{" "}
          <span className={`${KICKER} text-(--au-muted-strong)`}>
            · Bookings made {spokenRangeWithYear(current.start, current.end)}
            {reportedThrough ? ` · Reported through ${spoken(reportedThrough)}` : ""}
          </span>
        </p>
        <PeriodPicker value={range} />
      </div>

      {/* verdict */}
      <section aria-labelledby="verdict" className="flex flex-col w-full pb-[12px] gap-[4px]">
        {zero ? (
          <h1
            id="verdict"
            className="text-[34px] leading-[42px] sm:text-[45px] sm:leading-[50px] tracking-[-0.026em] max-w-[900px]"
          >
            <span className="text-(--au-body)">
              From {rangeStart} to {rangeEnd},{" "}
            </span>
            <span className="text-(--au-ink)">
              no bookings have come through Autumn&rsquo;s ads yet.
            </span>
          </h1>
        ) : (
          <h1 id="verdict" className="flex flex-col gap-[4px]">
            <span className="flex items-baseline flex-wrap gap-x-[13px]">
              <span className="text-[34px] leading-[42px] sm:text-[45px] sm:leading-[50px] tracking-[-0.026em] text-(--au-body)">
                From {rangeStart} to {rangeEnd},
              </span>
              <span className="pb-[3px] border-b-[2.5px] border-solid border-b-(--au-rule-strong)">
                <span className="text-[34px] leading-[42px] sm:text-[45px] sm:leading-[50px] tracking-[-0.026em] text-(--au-ink)">
                  {headline.bookings}{" "}
                  {headline.bookings === 1 ? "booking" : "bookings"}
                </span>
              </span>
            </span>
            <span className="flex items-baseline flex-wrap gap-x-[13px]">
              <span className="text-[34px] leading-[42px] sm:text-[45px] sm:leading-[50px] tracking-[-0.026em] text-(--au-body)">
                came through Autumn&rsquo;s ads, worth
              </span>
              <span className="text-[42px] leading-[46px] sm:text-[54px] sm:leading-[54px] tracking-[-0.03em] text-(--au-ink) opsz-32">
                {dollars(headline.valueCents)}.
              </span>
            </span>
          </h1>
        )}

        {notReported ? (
          <div className="flex flex-col gap-[6px] max-w-[680px] mt-[8px] py-[14px] px-[16px] border border-dashed border-(--au-rule-strong) rounded-(--au-r-btn)">
            <p className={`${KICKER} text-(--au-muted-strong)`}>Not reported yet</p>
            <p className="text-[16.5px] tracking-[-0.016em] leading-[25px] text-(--au-body)">
              Google confirms a booking a few days after it is made, so the
              last few days are still filling in. You are never billed on a
              booking we haven&rsquo;t confirmed.
            </p>
          </div>
        ) : (
          <div className="flex pt-[12px] items-baseline justify-between flex-wrap gap-x-[24px] gap-y-[4px] w-full">
            <p className="text-[16.5px] tracking-[-0.016em] leading-[25px] text-(--au-body)">
              {comparison(
                headline.bookings,
                headline.valueCents,
                headline.lastYearBookings,
                headline.lastYearValueCents,
              )}
            </p>
            {!zero && (
              <Door href={doorTo("/how-it-happened")}>
                See all {headline.bookings}, one by one
              </Door>
            )}
          </div>
        )}

        {(
          <p className="text-[14.5px] tracking-[-0.01em] leading-caption max-w-[680px] pt-[2px] text-(--au-slate-deep)">
            {notReported
              ? house.bookings > 0
                ? `Your inn took ${house.bookings} direct booking${house.bookings === 1 ? "" : "s"} so far in these dates, worth ${dollars(house.valueCents)}. None came through the ads yet, which is ordinary in the first days of a window.`
                : "Your inn's other bookings will appear here as they are reported."
              : `Your inn took ${house.bookings} direct bookings in these dates, worth ${dollars(house.valueCents)}. These ${headline.bookings} are the ones our ads brought; the other ${house.bookings - headline.bookings} were already yours.`}
          </p>
        )}
      </section>

      {/* cost row */}
      <section
        aria-label="What it cost"
        className="grid grid-cols-2 gap-x-[24px] gap-y-[20px] w-full py-[12px] border-t border-solid border-t-(--au-rule) sm:flex sm:items-start sm:justify-between sm:gap-x-[48px] sm:flex-wrap"
      >
        <div className="flex flex-col gap-[8px] sm:w-[200px] sm:shrink-0">
          <h2 className={`${KICKER} text-(--au-muted-strong)`}>Google ad spend</h2>
          <p className="text-[33px] leading-[38px] tracking-[-0.024em] text-(--au-ink)">
            {dollars(cost.adSpendCents)}
          </p>
          <p className={STAT_SUB}>Paid by Autumn, never billed to you.</p>
        </div>
        <div className="flex flex-col gap-[8px] sm:w-[200px] sm:shrink-0">
          <h2 className={`${KICKER} text-(--au-muted-strong)`}>
            Autumn&rsquo;s {feePct}%
          </h2>
          <p className="text-[33px] leading-[38px] tracking-[-0.024em] text-(--au-ink)">
            {dollars(cost.autumnFeeCents)}
          </p>
          <p className={STAT_SUB}>
            {headline.bookings > 0
              ? `Only on the bookings above · about $${perBooking.toLocaleString("en-US")} per booking.`
              : `Nothing yet. The ${feePct}% only starts once a booking lands.`}
          </p>
        </div>
        <div className="flex flex-col gap-[8px] sm:w-[200px] sm:shrink-0">
          <h2 className={`${KICKER} text-(--au-muted-strong)`}>Your total cost</h2>
          <p className="text-[33px] leading-[38px] tracking-[-0.024em] text-(--au-ink)">
            {dollars(cost.totalCostCents)}
          </p>
          <p className={STAT_SUB}>Nothing fixed, nothing monthly.</p>
        </div>
        <div className="flex flex-col items-start min-w-0 gap-[10px] sm:grow sm:basis-[240px]">
          <h2 className={`${KICKER} text-(--au-muted-strong)`}>
            Against the commission
          </h2>
          <p className="text-[15.5px] leading-[24px] tracking-[-0.012em] text-(--au-body) max-w-[680px]">
            {headline.bookings > 0
              ? `The same ${headline.bookings} bookings through a booking site at ${otaPct}% commission would have cost ${dollars(cost.otaCommissionCents)}.`
              : `Nothing to compare yet. Once bookings land, this shows what a booking site's ${otaPct}% would have taken.`}
          </p>
          <p className="flex items-center py-[8px] px-[12px] rounded-(--au-r-btn) bg-(--au-slate-tint)">
            <span className="text-[15.5px] leading-caption tracking-[-0.012em] text-(--au-slate-deep)">
              {headline.bookings > 0
                ? `${dollars(kept)} stayed with you this period.`
                : `$0 so far this period.`}
            </span>
          </p>
        </div>
      </section>

      {/* season chart */}
      <section
        aria-label="The shape of the season"
        className="flex flex-col w-full py-[18px] gap-[10px] border-t border-solid border-t-(--au-rule)"
      >
        <div className="flex items-center w-full gap-[16px]">
          <div className="flex items-center gap-[2px]">
            <h2 className={`${KICKER} text-(--au-muted-strong)`}>
              The shape of the season
            </h2>
            <InfoGlyph
              label="What this chart counts"
              answers="How busy each month has run for the last two years."
              count="Each point is the month's bookings from our ads, counted by the month the guest booked, not the month they stayed."
              means="Quiet months are ordinary for an inn; the dashed line is your own average to judge them against."
            />
          </div>
        </div>
        <SeasonChart
          series={series}
          programStart={property?.program_start_date ?? null}
        />
        <p className="text-[12.5px] leading-[17px] tracking-[-0.006em] max-w-[680px] pt-[8px] text-(--au-muted-strong)">
          Counted by the month each guest booked. Solid line: the three-month
          average · thin line: each month on its own · dashed line: your
          two-year average.
        </p>
        <p className="text-[14px] tracking-[-0.01em] leading-[20px] max-w-[680px] pt-[8px] text-(--au-body)">
          {notReported
            ? "No places to show yet. The first booking of these dates will appear here, and in the ledger on the next page."
            : feederSentence(headline.bookings, markets)}
        </p>
      </section>

      {/* note + timeline */}
      <div className="flex w-full grow pt-[24px] gap-[40px] flex-col xl:flex-row border-t border-solid border-t-(--au-rule)">
        <section
          aria-label="A note from Autumn"
          className="flex flex-col w-full xl:w-prose shrink-0 gap-[12px]"
        >
          {note ? (
            <>
              <div className="flex items-center gap-[12px]">
                <span className="flex items-center py-[4px] px-[10px] rounded-lamp border border-solid border-(--au-rule-strong)">
                  <span className={`${KICKER} text-(--au-ink)`}>
                    {KIND_CHIP[note.kind]}
                  </span>
                </span>
                <span className="text-[14px] leading-[20px] tracking-[-0.01em] text-(--au-muted-strong)">
                  A note from Autumn · {spoken(note.published_at)}
                </span>
              </div>
              <h2 className="text-lead leading-[28px] tracking-[-0.018em] text-(--au-ink)">
                {note.headline}
                {/[.?!]$/.test(note.headline.trim()) ? "" : "."}
              </h2>
              <p className="text-[16px] leading-[24px] tracking-[-0.012em] text-(--au-body)">
                {note.body}
              </p>
              <p className="text-[14px] leading-[20px] tracking-[-0.01em] text-(--au-muted-strong)">
                — Your team at Autumn
              </p>
            </>
          ) : (
            <p className="text-[16px] leading-[24px] tracking-[-0.012em] text-(--au-body)">
              Notes from your team will appear here.
            </p>
          )}
        </section>

        <section
          aria-label="What changed"
          className="flex flex-col grow basis-0 min-w-0 lg:pl-[40px] lg:border-l border-solid border-l-(--au-rule)"
        >
          <div className="flex items-center justify-between pb-[10px] gap-[16px]">
            <h2 className={`${KICKER} text-(--au-muted-strong)`}>
              {seasonHeading(current.start, current.end)}
            </h2>
            {allNotes ? (
              <Door href={doorTo("/")} className="text-[14px] leading-[20px]">
                The latest three
              </Door>
            ) : timelineAll.length > timeline.length ? (
              <Door
                href={doorTo("/?notes=all")}
                className="text-[14px] leading-[20px]"
              >
                All notes
              </Door>
            ) : null}
          </div>
          {allNotes ? (
            <p className="py-[10px] text-[14.5px] leading-[20px] tracking-[-0.01em] text-(--au-body) border-t border-b border-solid border-(--au-rule)">
              {`All ${timelineAll.length} notes from the last two years are below, newest first.`}
            </p>
          ) : (
            timeline.map((insight, i) => {
              const latest = i === timeline.length - 1;
              return (
                <div
                  key={insight.insight_id}
                  className={`flex items-start py-[10px] gap-[16px] border-t border-solid border-t-(--au-rule) ${latest ? "border-b border-b-(--au-rule)" : ""}`}
                >
                  <span
                    className={`w-[64px] shrink-0 pt-[2px] text-[12px] tracking-[0.14em] leading-[16px] font-label uppercase ${latest ? "text-(--au-ink)" : "text-(--au-muted-strong)"}`}
                  >
                    {noteDate(insight.published_at)}
                  </span>
                  <span
                    className={`text-[14.5px] leading-[20px] tracking-[-0.01em] ${latest ? "text-(--au-ink)" : "text-(--au-body)"}`}
                  >
                    {rowText(insight)}
                  </span>
                </div>
              );
            })
          )}
        </section>
      </div>

      {/* every note: full width, newest first, two columns on a wide screen */}
      {allNotes && (
        <section
          aria-label="Every note from Autumn"
          className="flex flex-col w-full pt-[20px] mt-[24px] border-t border-solid border-t-(--au-rule)"
        >
          <div className="flex items-center justify-between pb-[10px] gap-[16px]">
            <h2 className={`${KICKER} text-(--au-muted-strong)`}>
              {`Every note · ${timelineAll.length} since ${timelineAll[0] ? spokenWithYear(timelineAll[0].published_at) : ""}`}
            </h2>
            <Door href={doorTo("/")} className="text-[14px] leading-[20px]">
              The latest three
            </Door>
          </div>
          <div className="grid grid-cols-1 xl:grid-cols-2 gap-x-[40px]">
            {noteCols.map((col, c) => (
              <div key={c} className="flex flex-col">
                {col.map((row) =>
                  row.kind === "year" ? (
                    <div
                      key={`y-${row.year}-${c}`}
                      className={`${row.cont ? "hidden xl:flex" : "flex"} items-center pt-[18px] pb-[6px]`}
                    >
                      <span className={`${KICKER} text-(--au-muted-strong)`}>
                        {row.cont ? `${row.year}, continued` : row.year}
                      </span>
                    </div>
                  ) : (
                    <div
                      key={row.insight.insight_id}
                      className="flex items-start py-[10px] gap-[16px] border-t border-solid border-t-(--au-rule)"
                    >
                      <span
                        className={`w-[64px] shrink-0 pt-[2px] text-[12px] tracking-[0.14em] leading-[16px] font-label uppercase ${row.latest ? "text-(--au-ink)" : "text-(--au-muted-strong)"}`}
                      >
                        {noteDate(row.insight.published_at)}
                      </span>
                      <span
                        className={`text-[14.5px] leading-[20px] tracking-[-0.01em] ${row.latest ? "text-(--au-ink)" : "text-(--au-body)"}`}
                      >
                        {rowText(row.insight)}
                      </span>
                    </div>
                  ),
                )}
              </div>
            ))}
          </div>
        </section>
      )}
    </div>
  );
}
