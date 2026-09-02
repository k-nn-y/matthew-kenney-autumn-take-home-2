import type { Metadata } from "next";
import Link from "next/link";
import {
  getProperty,
  getPeriods,
  getHeadline,
  getCostComparison,
  getIncrementality,
  getChannelBreakdown,
  getFeederMarkets,
  getRecentBookings,
  getOccupancy,
  getJourney,
  getHouseTotal,
  getReportedThrough,
} from "@/lib/queries";
import { dollars } from "@/lib/db";
import { spokenRangeWithYear, spokenShort } from "@/app/dates";
import { asWord } from "@/lib/words";
import { normalizePeriod } from "@/lib/periods";
import { PeriodPicker } from "@/components/PeriodPicker";
import { Door } from "@/components/Door";
import { InfoGlyph } from "@/components/InfoGlyph";
import { CountUp } from "@/components/CountUp";
import { Grow } from "@/components/Grow";
import { LedgerRow } from "@/components/LedgerRow";
import { channelLong, channelShort, CHANNEL_ORDER } from "@/lib/owner";

export const metadata: Metadata = { title: "How it happened · Autumn" };
export const dynamic = "force-dynamic";

/* ------------------------------------------------------------- shared bits */

const KICKER = "text-[12px] leading-[16px] tracking-[0.18em] font-label uppercase";
const COL_HEAD =
  "py-[7px] text-[12px] leading-[16px] tracking-[0.14em] font-label uppercase text-(--au-muted-strong) font-normal text-left";
const CELL = "py-[10px] border-t border-solid border-(--au-rule)";

/** Days that have actually reported inside the window. */
function reportedDays(
  windowStart: string,
  windowEnd: string,
  programStart: string | null,
  reportedThrough: string | null,
): number {
  if (!reportedThrough) return 0;
  const lo = programStart && programStart > windowStart ? programStart : windowStart;
  const hi = reportedThrough < windowEnd ? reportedThrough : windowEnd;
  const ms = Date.parse(`${hi}T00:00:00Z`) - Date.parse(`${lo}T00:00:00Z`);
  return ms < 0 ? 0 : Math.floor(ms / 86400000) + 1;
}

/** The little slate proportion track every panel row carries. */
function Bar({ share, delay = 0 }: { share: number; delay?: number }) {
  return (
    <span className="inline-flex w-[56px] h-[4px] rounded-[2px] shrink-0 bg-(--au-slate-tint)">
      {share > 0 ? (
        <Grow gate="au-bars-how" delay={delay} className="inline-flex w-full h-[4px]">
          <span
            className="h-[4px] rounded-[2px] bg-(--au-slate-deep)"
            style={{ width: `${Math.max(4, Math.round(share * 100))}%` }}
          />
        </Grow>
      ) : null}
    </span>
  );
}

/* -------------------------------------------------------------------- page */

export default async function HowItHappenedPage({
  searchParams,
}: {
  searchParams: Promise<Record<string, string | string[] | undefined>>;
}) {
  const params = await searchParams;
  const range = normalizePeriod(
    typeof params.period === "string" ? params.period : undefined,
  );
  const allWays = params.ways === "all";
  const allPlaces = params.places === "all";
  const allRows = params.rows === "all";

  const [property, periods, reportedThrough] = await Promise.all([
    getProperty(),
    getPeriods(range),
    getReportedThrough(),
  ]);
  const { current, lastYear } = periods;

  const [headline, cost, split, channels, markets, bookings, occupancy, journey, house] =
    await Promise.all([
      getHeadline(periods),
      getCostComparison(current),
      getIncrementality(current),
      getChannelBreakdown(current),
      getFeederMarkets(current),
      getRecentBookings(current, allRows ? 500 : 6),
      getOccupancy(current),
      getJourney(current, lastYear),
      getHouseTotal(current),
    ]);

  const notLive = !property?.program_start_date;
  const total = headline.bookings;
  const days = reportedDays(
    current.start,
    current.end,
    property?.program_start_date ?? null,
    reportedThrough,
  );
  const tooFewDays = !notLive && days > 0 && days < 30;

  /* Four ways, one row per guest intent, zero rows kept. */
  const byCategory = new Map<
    string,
    { bookings: number; valueCents: number; clicks: number; costCents: number }
  >();
  for (const c of channels) {
    const agg = byCategory.get(c.category) ?? {
      bookings: 0,
      valueCents: 0,
      clicks: 0,
      costCents: 0,
    };
    agg.bookings += c.bookings;
    agg.valueCents += c.valueCents;
    agg.clicks += c.clicks;
    agg.costCents += c.costCents;
    byCategory.set(c.category, agg);
  }
  const ways = CHANNEL_ORDER.map((category) => ({
    category,
    name: channelLong(category),
    ...(byCategory.get(category) ?? {
      bookings: 0,
      valueCents: 0,
      clicks: 0,
      costCents: 0,
    }),
  })).sort(
    (a, b) =>
      b.bookings - a.bookings ||
      b.valueCents - a.valueCents ||
      CHANNEL_ORDER.indexOf(a.category) - CHANNEL_ORDER.indexOf(b.category),
  );
  const topWay = ways[0]?.bookings ?? 0;
  const quietWays = ways.filter((w) => w.bookings === 0);

  /* Eleven places: four named, the rest gathered into one honest row. */
  const named = allPlaces || markets.length <= 5 ? markets : markets.slice(0, 4);
  const tail = allPlaces || markets.length <= 5 ? [] : markets.slice(4);
  const tailBookings = tail.reduce((s, m) => s + m.bookings, 0);
  const tailValue = tail.reduce((s, m) => s + m.valueCents, 0);
  const tailMax = tail.reduce((s, m) => Math.max(s, m.bookings), 0);
  const tailEach =
    tailMax <= 1 ? "one booking each" : tailMax <= 2 ? "one or two bookings each" : "a few bookings each";
  const topPlace = markets[0]?.bookings ?? 0;

  const visitsShare =
    journey.siteSessions > 0
      ? Math.max(1, Math.round((journey.visits / journey.siteSessions) * 100))
      : 0;
  const occupancyPct = Math.round(occupancy.occupancy * 100);
  const splitTotal = split.byName + split.newToYou;
  const byNameShare = splitTotal > 0 ? split.byName / splitTotal : 0;

  const askEmail = process.env.ASK_EMAIL;

  const qs = (extra?: Record<string, string>) => {
    const p = new URLSearchParams({ period: range });
    if (allWays) p.set("ways", "all");
    if (allPlaces) p.set("places", "all");
    if (allRows) p.set("rows", "all");
    for (const [k, v] of Object.entries(extra ?? {})) {
      if (v === "") p.delete(k);
      else p.set(k, v);
    }
    return `/how-it-happened?${p.toString()}`;
  };

  return (
    <div className="w-full max-w-[1216px] flex flex-col grow pt-[20px] pb-[36px] px-[24px] xl:px-[32px] rounded-(--au-r-card) bg-(--au-ground) border border-solid border-(--au-rule)">
      {/* head row */}
      <div className="flex items-center justify-between flex-wrap gap-x-[16px] gap-y-[8px] w-full pb-[16px]">
        <p className="flex items-center flex-wrap gap-x-[10px] min-h-[44px] min-w-0">
          <Link
            href={`/?period=${range}`}
            scroll={false}
            className="au-door text-[14.5px] leading-[22px] tracking-[-0.01em] text-(--au-body)"
          >
            <svg
              viewBox="0 0 16 16"
              width="13"
              height="13"
              aria-hidden="true"
              focusable="false"
              className="au-door-chev"
            >
              <path
                d="M10 3.5 5.5 8 10 12.5"
                fill="none"
                stroke="currentColor"
                strokeWidth="1.6"
                strokeLinecap="round"
                strokeLinejoin="round"
              />
            </svg>
            <span>Your results</span>
          </Link>
          <span className={`${KICKER} text-(--au-muted-strong)`}>
            <span className="hidden sm:inline">· </span>
            Bookings made {spokenRangeWithYear(current.start, current.end)} ·
            Against {spokenRangeWithYear(lastYear.start, lastYear.end)}
          </span>
        </p>
        <PeriodPicker value={range} />
      </div>

      {/* hero: the count this whole sheet reconciles back to */}
      <section
        aria-labelledby="hero"
        className="flex flex-col w-full pt-[32px] pb-[30px] rounded-(--au-r-card) gap-[26px] px-[24px] sm:px-[36px] bg-(--au-ink-ground)"
      >
        {notLive ? (
          <h1
            id="hero"
            className="text-[34px] leading-[42px] tracking-[-0.026em] text-(--au-on-ink) max-w-[680px]"
          >
            Your ads have not started yet. Once they are live, the bookings
            they bring will appear here, one by one.
          </h1>
        ) : (
          <div className="flex items-end justify-between flex-wrap w-full gap-x-[40px] gap-y-[20px]">
            <h1 id="hero" className="flex items-end sm:items-baseline gap-[18px]">
              <span className="text-[64px] leading-[64px] sm:text-[96px] sm:leading-[92px] tracking-[-0.04em] text-(--au-on-ink) opsz-32">
                <CountUp value={total} text={String(total)} gate="au-nums-how" />
              </span>
              <span className="text-row tracking-[-0.024em] text-(--au-on-ink)">
                {total === 1 ? "booking, on its own." : "bookings, one by one."}
              </span>
            </h1>
            <p className="text-[14.5px] leading-[22px] tracking-[-0.01em] max-w-[360px] sm:text-right text-(--au-on-ink-muted)">
              {total === 0
                ? "No bookings have been confirmed in these dates yet. Google confirms a booking a few days after it is made, so the last few days are still filling in."
                : `Your inn took ${house.bookings.toLocaleString("en-US")} direct bookings in these dates. These ${total} came through our ads, worth ${dollars(headline.valueCents)}, and the four ways, the ${asWord(markets.length)} place${markets.length === 1 ? "" : "s"} and the ledger below all add back up to them.`}
            </p>
          </div>
        )}

        {!notLive && total > 0 ? (
          <div className="flex flex-col w-full pt-[24px] gap-[18px] border-t border-solid border-t-(--au-rule-on-ink)">
            <h2 className={`${KICKER} text-(--au-on-ink-muted)`}>
              Would you have got these anyway?
            </h2>
            <div className="flex items-start w-full gap-x-[48px] gap-y-[24px] flex-wrap">
              <div className="flex flex-col w-[240px] sm:w-[280px] shrink-0 gap-[6px]">
                <p className="text-[44px] leading-[48px] sm:text-[56px] sm:leading-[58px] tracking-[-0.032em] text-(--au-on-ink)">
                  <CountUp
                    value={split.byName}
                    text={String(split.byName)}
                    gate="au-nums-how"
                  />
                </p>
                <p className="text-[16px] leading-[23px] tracking-[-0.014em] text-(--au-on-ink)">
                  searched for you by name
                </p>
                <p className="text-[13.5px] leading-[20px] tracking-[-0.008em] text-(--au-on-ink-muted)">
                  Some would have found you anyway.
                </p>
              </div>
              <div className="flex flex-col w-[240px] sm:w-[280px] shrink-0 gap-[6px]">
                <p className="text-[44px] leading-[48px] sm:text-[56px] sm:leading-[58px] tracking-[-0.032em] text-(--au-on-ink)">
                  <CountUp
                    value={split.newToYou}
                    text={String(split.newToYou)}
                    gate="au-nums-how"
                  />
                </p>
                <p className="text-[16px] leading-[23px] tracking-[-0.014em] text-(--au-on-ink)">
                  didn&rsquo;t know you yet
                </p>
                <p className="text-[13.5px] leading-[20px] tracking-[-0.008em] text-(--au-on-ink-muted)">
                  The guests the advertising is really for.
                </p>
              </div>
              <div className="flex flex-col grow basis-[280px] min-w-[250px] pt-[8px] gap-[14px]">
                <div className="flex w-full h-[10px] shrink-0" aria-hidden="true">
                  {splitTotal > 0 ? (
                    <Grow gate="au-bars-how" className="flex w-full h-[10px] gap-[3px]">
                      <span
                        className="h-[10px] opacity-[0.45] rounded-[2px] bg-(--au-on-ink)"
                        style={{ width: `${Math.round(byNameShare * 1000) / 10}%` }}
                      />
                      <span className="grow h-[10px] rounded-[2px] bg-(--au-on-ink)" />
                    </Grow>
                  ) : (
                    <span className="grow h-[10px] opacity-[0.2] rounded-[2px] bg-(--au-on-ink)" />
                  )}
                </div>
                <p className="text-[14.5px] leading-[22px] tracking-[-0.01em] max-w-[46ch] text-(--au-on-ink-muted)">
                  When you don&rsquo;t advertise your own name, the booking
                  sites&rsquo; ads sit on top of it in the search results.
                </p>
              </div>
            </div>
          </div>
        ) : null}
      </section>

      {/* shown → visited → booked */}
      {tooFewDays ? (
        <p className="w-full mt-[20px] py-[16px] px-[4px] text-[16.5px] leading-[25px] tracking-[-0.016em] text-(--au-body) max-w-[680px] border-t border-b border-solid border-(--au-rule)">
          Only {asWord(days)} of these days have reported so far, too few to
          set fairly against last year; this comparison returns once thirty
          days are in.
        </p>
      ) : (
        <div className="flex items-center justify-between flex-wrap w-full mt-[20px] py-[16px] px-[4px] gap-x-[24px] gap-y-[16px] border-t border-b border-solid border-(--au-rule)">
          <dl className="flex flex-col items-start gap-y-[16px] sm:flex-row sm:items-center sm:flex-wrap">
            <div className="flex flex-col sm:pr-[20px] gap-[5px]">
              <dt className={`${KICKER} tracking-[0.18em] text-(--au-muted-strong) w-max`}>
                Times you appeared
              </dt>
              <dd className="text-[26px] leading-[30px] tracking-[-0.02em] text-(--au-ink) w-max">
                <CountUp
                  value={journey.appeared}
                  text={journey.appeared.toLocaleString("en-US")}
                  gate="au-nums-how"
                />
              </dd>
              <dd className="text-[12.5px] leading-[17px] tracking-[-0.006em] text-(--au-muted-strong) w-max">
                {journey.appearedLastYear.toLocaleString("en-US")} the same
                dates last year
              </dd>
            </div>
            <div className="hidden sm:block w-px h-[40px] shrink-0 bg-(--au-rule-strong)" aria-hidden="true" />
            <div className="flex flex-col sm:px-[20px] gap-[5px]">
              <dt className={`${KICKER} tracking-[0.18em] text-(--au-muted-strong) w-max`}>
                Visits from Google
              </dt>
              <dd className="text-[26px] leading-[30px] tracking-[-0.02em] text-(--au-ink) w-max">
                <CountUp
                  value={journey.visits}
                  text={journey.visits.toLocaleString("en-US")}
                  gate="au-nums-how"
                />
              </dd>
              <dd className="text-[12.5px] leading-[17px] tracking-[-0.006em] text-(--au-muted-strong) w-max">
                {journey.visitsLastYear.toLocaleString("en-US")} last year
                {visitsShare > 0
                  ? ` · ${visitsShare} in 100 of your site visits`
                  : ""}
              </dd>
            </div>
            <div className="hidden sm:block w-px h-[40px] shrink-0 bg-(--au-rule-strong)" aria-hidden="true" />
            <div className="flex flex-col sm:pl-[20px] gap-[5px]">
              <dt className={`${KICKER} tracking-[0.18em] text-(--au-muted-strong) w-max`}>
                Bookings
              </dt>
              <dd className="text-[26px] leading-[30px] tracking-[-0.02em] text-(--au-ink) w-max">
                <CountUp value={total} text={String(total)} gate="au-nums-how" />
              </dd>
              <dd className="text-[12.5px] leading-[17px] tracking-[-0.006em] text-(--au-muted-strong) w-max">
                {headline.lastYearBookings} the same dates last year
              </dd>
            </div>
          </dl>
          <p className="w-full lg:w-[380px] lg:text-right text-[13.5px] leading-[19px] tracking-[-0.006em] shrink-0 text-(--au-muted-strong)">
            Shown, visited, booked. These three only prove the ads did their
            job; the bookings above are what count. Autumn paid the{" "}
            {dollars(cost.adSpendCents)} the ads cost.
          </p>
        </div>
      )}

      {/* the two panels */}
      <div className="flex flex-col xl:flex-row w-full pt-[20px] gap-[24px] items-stretch">
        {/* how our ads drove them */}
        <section
          aria-labelledby="ways-head"
          className="flex flex-col w-full xl:w-[548px] shrink-0 rounded-(--au-r-btn) overflow-clip border border-solid border-(--au-rule)"
        >
          <div className="flex flex-col items-start gap-y-[2px] py-[8px] sm:flex-row sm:items-baseline sm:justify-between sm:py-[6px] w-full pl-[16px] pr-[8px] gap-x-[16px]">
            <span className="flex items-center gap-[2px]">
              <h2
                id="ways-head"
                className="text-[15.5px] leading-[22px] tracking-[-0.014em] text-(--au-ink)"
              >
                How our ads drove them
              </h2>
              <InfoGlyph
                label="What this table counts"
                answers="Which of the four kinds of ad each booking came through."
                count="Each booking is counted once, under the ad its guest clicked, so the rows always add back up to the total above."
                means="Guests who found you on their own are not in this table."
              />
            </span>
            <Door href={allWays ? qs({ ways: "" }) : qs({ ways: "all" })} className="shrink-0">
              {allWays ? "Just the bookings" : "All four ways"}
            </Door>
          </div>
          <table className="w-full border-collapse">
            <caption className="sr-only">
              Bookings and value by the way each guest found you, {current.label}
            </caption>
            <thead>
              <tr className="bg-(--au-ground-alt)">
                <th scope="col" className={`${COL_HEAD} pl-[16px] border-t border-solid border-(--au-rule)`}>
                  How they found you
                </th>
                <th scope="col" className={`${COL_HEAD} text-right w-[112px] pl-[12px] border-t border-solid border-(--au-rule)`}>
                  Bookings
                </th>
                <th scope="col" className={`${COL_HEAD} text-right w-[104px] pl-[16px] pr-[16px] border-t border-solid border-(--au-rule)`}>
                  Value
                </th>
              </tr>
            </thead>
            <tbody>
              {ways.map((w, i) => (
                <tr key={w.category}>
                  <th
                    scope="row"
                    className={`${CELL} pl-[16px] pr-[12px] text-left font-medium text-[14.5px] leading-[21px] tracking-[-0.01em] text-(--au-ink)`}
                  >
                    {w.name}
                    {allWays ? (
                      <span className="block text-[12.5px] leading-[17px] tracking-[-0.006em] text-(--au-muted-strong) font-normal">
                        {w.clicks.toLocaleString("en-US")} visit
                        {w.clicks === 1 ? "" : "s"} · {dollars(w.costCents)} of
                        ads, paid by Autumn
                      </span>
                    ) : null}
                  </th>
                  <td className={`${CELL} pl-[12px] text-right align-middle`}>
                    <span className="inline-flex items-center justify-end gap-[8px]">
                      <Bar share={topWay > 0 ? w.bookings / topWay : 0} delay={i * 60} />
                      <span className="w-[28px] text-right text-[14.5px] leading-[20px] tabular-nums text-(--au-ink)">
                        {w.bookings}
                      </span>
                    </span>
                  </td>
                  <td
                    className={`${CELL} pr-[16px] text-center text-[13.5px] leading-[21px] text-(--au-muted-strong)`}
                  >
                    {dollars(w.valueCents)}
                  </td>
                </tr>
              ))}
            </tbody>
            <tfoot>
              <tr>
                <th
                  scope="row"
                  className="py-[10px] pl-[16px] pr-[12px] text-left font-medium text-[14.5px] leading-[21px] tracking-[-0.01em] text-(--au-ink) border-t border-solid border-(--au-rule-strong)"
                >
                  All four ways, together
                </th>
                <td className="py-[10px] pl-[12px] text-right align-middle text-[14.5px] leading-[20px] tabular-nums text-(--au-ink) border-t border-solid border-(--au-rule-strong)">
                  {total}
                </td>
                <td className="py-[10px] pr-[16px] text-center text-[13.5px] leading-[21px] text-(--au-ink) border-t border-solid border-(--au-rule-strong)">
                  {dollars(headline.valueCents)}
                </td>
              </tr>
            </tfoot>
          </table>
          <p className="w-full grow pt-[14px] pb-[16px] px-[16px] text-[13.5px] leading-[19px] tracking-[-0.006em] text-(--au-body) bg-(--au-ground-alt) border-t border-solid border-t-(--au-rule)">
            Each booking is counted once, under the ad its guest clicked, so
            the four rows always add up to the {total} above.
            {quietWays.some((w) => w.category === "maps")
              ? " The map ads have not brought a booking in these dates."
              : ""}
          </p>
        </section>

        {/* where guests come from */}
        <section
          aria-labelledby="places-head"
          className="flex flex-col grow rounded-(--au-r-btn) overflow-clip border border-solid border-(--au-rule)"
        >
          <div className="flex flex-col items-start gap-y-[2px] py-[8px] sm:flex-row sm:items-baseline sm:justify-between sm:py-[6px] w-full pl-[16px] pr-[8px] gap-x-[16px]">
            <span className="flex items-center gap-[2px]">
              <h2
                id="places-head"
                className="text-[15.5px] leading-[22px] tracking-[-0.014em] text-(--au-ink)"
              >
                Where guests come from
              </h2>
              <InfoGlyph
                label="What this table counts"
                answers="Where each guest was when they searched."
                count="Counted by the place of the search, not the guest's home, so a search made from Boston counts as Boston."
                means="It shows where your name is being seen and answered."
              />
            </span>
            {markets.length > 5 ? (
              <Door
                href={allPlaces ? qs({ places: "" }) : qs({ places: "all" })}
                className="shrink-0"
              >
                {allPlaces
                  ? "The top places"
                  : `All ${markets.length} places`}
              </Door>
            ) : null}
          </div>
          <table className="w-full border-collapse">
            <caption className="sr-only">
              Bookings and value by the place each guest searched from, {current.label}
            </caption>
            <thead>
              <tr className="bg-(--au-ground-alt)">
                <th scope="col" className={`${COL_HEAD} pl-[16px] border-t border-solid border-(--au-rule)`}>
                  Searched from
                </th>
                <th scope="col" className={`${COL_HEAD} text-right w-[112px] pl-[12px] border-t border-solid border-(--au-rule)`}>
                  Bookings
                </th>
                <th scope="col" className={`${COL_HEAD} text-right w-[104px] pl-[16px] pr-[16px] border-t border-solid border-(--au-rule)`}>
                  Value
                </th>
              </tr>
            </thead>
            <tbody>
              {markets.length === 0 ? (
                <tr>
                  <td
                    colSpan={3}
                    className={`${CELL} px-[16px] text-[14.5px] leading-[21px] text-(--au-muted-strong)`}
                  >
                    No places to show yet. The first booking of these dates
                    will appear here.
                  </td>
                </tr>
              ) : (
                <>
                  {named.map((m, i) => (
                    <tr key={m.market}>
                      <th
                        scope="row"
                        className={`${CELL} pl-[16px] pr-[12px] text-left font-medium text-[14.5px] leading-[21px] tracking-[-0.01em] text-(--au-ink)`}
                      >
                        {m.market}
                      </th>
                      <td className={`${CELL} pl-[12px] text-right align-middle`}>
                        <span className="inline-flex items-center justify-end gap-[8px]">
                          <Bar share={topPlace > 0 ? m.bookings / topPlace : 0} delay={i * 60} />
                          <span className="w-[28px] text-right text-[14.5px] leading-[20px] tabular-nums text-(--au-ink)">
                            {m.bookings}
                          </span>
                        </span>
                      </td>
                      <td
                        className={`${CELL} pr-[16px] text-center text-[13.5px] leading-[21px] text-(--au-muted-strong)`}
                      >
                        {dollars(m.valueCents)}
                      </td>
                    </tr>
                  ))}
                  {tail.length > 0 ? (
                    <tr>
                      <th
                        scope="row"
                        className={`${CELL} pl-[16px] pr-[12px] text-left font-normal text-[14.5px] leading-[21px] tracking-[-0.01em] text-(--au-muted-strong)`}
                      >
                        {tail.length} other place{tail.length === 1 ? "" : "s"},{" "}
                        {tailEach}
                      </th>
                      <td className={`${CELL} pl-[12px] text-right align-middle`}>
                        <span className="inline-flex items-center justify-end">
                          <span className="w-[28px] text-right text-[14.5px] leading-[20px] tabular-nums text-(--au-ink)">
                            {tailBookings}
                          </span>
                        </span>
                      </td>
                      <td
                        className={`${CELL} pr-[16px] text-center text-[13.5px] leading-[21px] text-(--au-muted-strong)`}
                      >
                        {dollars(tailValue)}
                      </td>
                    </tr>
                  ) : null}
                </>
              )}
            </tbody>
          </table>
          <p className="w-full grow pt-[14px] pb-[16px] px-[16px] text-[13.5px] leading-[19px] tracking-[-0.006em] text-(--au-body) bg-(--au-ground-alt) border-t border-solid border-t-(--au-rule)">
            Where each guest was when they searched, not where they live, so
            the {asWord(Math.max(markets.length, 1))} place
            {markets.length === 1 ? "" : "s"} add
            {markets.length === 1 ? "s" : ""} up to the {total} above.
          </p>
        </section>
      </div>

      {/* the ledger */}
      <section aria-labelledby="ledger-head" className="flex flex-col w-full pt-[20px]">
        <div className="flex flex-col w-full rounded-(--au-r-btn) overflow-clip border border-solid border-(--au-rule)">
          <div className="flex items-baseline justify-between flex-wrap w-full py-[6px] pl-[16px] pr-[8px] gap-x-[16px]">
            <span className="flex items-baseline flex-wrap gap-x-[12px]">
              <span className="flex items-center gap-[2px]">
                <h2
                  id="ledger-head"
                  className="text-[15.5px] leading-[22px] tracking-[-0.014em] text-(--au-ink)"
                >
                  The bookings themselves
                </h2>
                <InfoGlyph
                  label="What this ledger counts"
                  answers="Every booking behind the numbers, one row each."
                  count="Each row is one confirmed booking traced to an ad click; cancelled bookings are taken out and never billed."
                  means="Both dates in a row can be looked up in your own booking system."
                />
              </span>
              <span className="text-[13.5px] leading-[19px] tracking-[-0.008em] text-(--au-muted-strong)">
                {allRows
                  ? `All ${total} · newest first`
                  : `The ${Math.min(6, bookings.length)} most recent of ${total} · newest first`}
              </span>
            </span>
            {total > 6 ? (
              <Door
                href={allRows ? qs({ rows: "" }) : qs({ rows: "all" })}
                className="shrink-0"
              >
                {allRows ? "The 6 most recent" : `All ${total} bookings`}
              </Door>
            ) : null}
          </div>
          <table className="w-full border-collapse">
            <caption className="sr-only">
              Each booking made through Autumn&rsquo;s ads, newest first,{" "}
              {current.label}
            </caption>
            <thead>
              <tr className="bg-(--au-ground-alt)">
                <th scope="col" className={`${COL_HEAD} pl-[16px] w-[150px] border-t border-solid border-(--au-rule)`}>
                  Booked
                </th>
                <th scope="col" className={`${COL_HEAD} w-[150px] border-t border-solid border-(--au-rule) hidden sm:table-cell`}>
                  Arriving
                </th>
                <th scope="col" className={`${COL_HEAD} text-right w-[70px] border-t border-solid border-(--au-rule) hidden sm:table-cell`}>
                  Nights
                </th>
                <th scope="col" className={`${COL_HEAD} text-right w-[100px] border-t border-solid border-(--au-rule)`}>
                  Value
                </th>
                <th scope="col" className={`${COL_HEAD} pl-[44px] border-t border-solid border-(--au-rule) hidden sm:table-cell`}>
                  Guest came from
                </th>
                <th scope="col" className={`${COL_HEAD} w-[220px] pr-[16px] pl-[20px] border-t border-solid border-(--au-rule)`}>
                  How they found you
                </th>
              </tr>
            </thead>
            <tbody>
              {bookings.length === 0 ? (
                <tr>
                  <td
                    colSpan={6}
                    className={`${CELL} px-[16px] text-[14.5px] leading-[21px] text-(--au-muted-strong)`}
                  >
                    No bookings to list for these dates yet.
                  </td>
                </tr>
              ) : (
                bookings.map((b, i) => (
                  <LedgerRow
                    key={b.booking_id}
                    reveal={allRows && i >= 6}
                    booked={spokenShort(b.booked_at)}
                    arriving={spokenShort(b.check_in)}
                    nights={b.nights}
                    value={dollars(b.totalValueCents)}
                    from={b.feeder_market}
                    found={channelShort(b.category)}
                  />
                ))
              )}
            </tbody>
          </table>
          <div className="w-full pt-[14px] pb-[16px] px-[16px] bg-(--au-ground-alt) border-t border-solid border-t-(--au-rule)">
            <p className="max-w-[760px] text-[13.5px] leading-[19px] tracking-[-0.006em] text-(--au-body)">
              Every row carries the two dates you can look up in your own booking
              system, the day it was booked and the day the guest arrives, plus
              the ad the guest clicked before booking.
            </p>
          </div>
        </div>
      </section>

      {/* occupancy + ask */}
      <div className="flex justify-between flex-wrap w-full pt-[20px] items-start gap-x-[64px] gap-y-[24px]">
        <section
          aria-labelledby="occupancy-head"
          className="flex w-full lg:w-[600px] shrink-0 pt-[18px] pb-[20px] rounded-(--au-r-card) gap-[8px] flex-col px-[22px] bg-(--au-ink-ground)"
        >
          <div className="flex items-center gap-[2px]">
            <h2 id="occupancy-head" className={`${KICKER} text-(--au-on-ink-muted)`}>
              Occupancy
            </h2>
            <InfoGlyph
              label="What occupancy counts"
              onInk
              answers="How full the whole house was, from every source."
              count="Room nights sold, counted by the night the guest stayed, not the day they booked."
              means="The nights our guests stayed sit inside this number, not on top of it."
            />
          </div>
          <p className="text-[24px] leading-[30px] sm:text-[28px] sm:leading-[32px] tracking-[-0.024em] text-(--au-on-ink)">
            {occupancy.roomNights.toLocaleString("en-US")} of{" "}
            {occupancy.capacityNights.toLocaleString("en-US")} room nights
            sold. {occupancyPct}% full.
          </p>
          <p className="text-[14px] leading-[20px] tracking-[-0.01em] text-(--au-on-ink-muted)">
            {occupancy.autumnRoomNights} of those nights came from guests we
            brought, counted by the night they stayed.
          </p>
        </section>
        <div className="flex flex-col items-start lg:items-end grow basis-[0%] min-w-[280px] pt-[4px] gap-[16px]">
          <p className="max-w-[420px] lg:text-right text-[14.5px] leading-[22px] tracking-[-0.01em] text-(--au-muted-strong)">
            Nothing here needs anything from you. If a number looks wrong, ask.
            A person answers, not a form.
          </p>
          {askEmail ? (
            <a
              href={`mailto:${askEmail}?subject=${encodeURIComponent("A number on my results")}`}
              className="au-ask flex items-center py-[12px] px-[18px] rounded-(--au-r-btn) gap-[10px] bg-(--au-ink) min-h-[44px]"
            >
              <span className="text-[14.5px] leading-[20px] tracking-[-0.01em] w-max shrink-0 text-(--au-on-ink)">
                Ask about a number
              </span>
              <svg
                viewBox="0 0 16 16"
                width="14"
                height="14"
                aria-hidden="true"
                focusable="false"
              >
                <path
                  d="M3 8h10M9 4l4 4-4 4"
                  fill="none"
                  stroke="var(--au-on-ink)"
                  strokeWidth="1.6"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                />
              </svg>
            </a>
          ) : (
            <p className="text-[14.5px] leading-[22px] tracking-[-0.01em] text-(--au-muted-strong)">
              Reply to any monthly note from your team.
            </p>
          )}
        </div>
      </div>
    </div>
  );
}
