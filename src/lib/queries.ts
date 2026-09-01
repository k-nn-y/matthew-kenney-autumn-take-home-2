import { q } from "@/lib/db";
import type {
  BookingRow,
  ChannelRow,
  CostComparison,
  FeederRow,
  Headline,
  Incrementality,
  Insight,
  MonthPoint,
  Period,
} from "@/lib/types";

/**
 * The query layer. Two rules run through every function here.
 *
 * 1. TWO DATE AXES, NEVER CONFLATED. `booked_at` is the MARKETING axis — when a
 *    guest decided, which is when the ad did its work. `check_in` is the
 *    OCCUPANCY axis — when the room is actually slept in. A booking made in
 *    August for a February stay belongs to August on one axis and February on
 *    the other, and mixing them produces a number that is wrong in both
 *    directions. Every query below names its axis in the comment above it.
 *
 * 2. NO STORED RATES. Every ratio is a ratio of two sums taken in the same
 *    breath as the counts printed beside it, so the arithmetic on screen always
 *    reconciles. Money stays integer cents the whole way; only `dollars()` at
 *    the edge turns it into a currency string.
 *
 * Timestamps come back as property-local wall-clock ISO strings
 * ('2026-08-14T21:42:00', no offset) so a server rendering in UTC still prints
 * the hour the guest actually booked. Dates come back as 'YYYY-MM-DD'.
 *
 * Everything is empty-safe: the database may be mid-seed, so zero rows returns
 * zeros rather than throwing.
 */

/** Single-property build. Still passed as a bind parameter, never interpolated. */
const PROPERTY_ID = 1;

/* ------------------------------------------------------------------ helpers */

type NumLike = string | number | null | undefined;
const num = (v: NumLike): number => (v === null || v === undefined ? 0 : Number(v));

const DAY_MS = 86_400_000;
const asDate = (ymd: string) => new Date(`${ymd}T00:00:00Z`);
const ymd = (d: Date) => d.toISOString().slice(0, 10);
const addDays = (s: string, n: number) => ymd(new Date(asDate(s).getTime() + n * DAY_MS));
const addMonths = (s: string, n: number) => {
  const d = asDate(s);
  return ymd(new Date(Date.UTC(d.getUTCFullYear(), d.getUTCMonth() + n, d.getUTCDate())));
};
const addYears = (s: string, n: number) => addMonths(s, n * 12);
/** Inclusive day count, the way an innkeeper counts nights on a calendar. */
const spanDays = (p: Period) => Math.round((asDate(p.end).getTime() - asDate(p.start).getTime()) / DAY_MS) + 1;

/**
 * Converts an inclusive local date range into a half-open timestamptz window in
 * the property's own timezone. Half-open ([lo, hi)) so a booking taken at
 * 23:59:59 on the last evening is counted exactly once, and so the comparison
 * stays index-friendly on (property_id, booked_at).
 */
const MARKETING_WINDOW = `
  win AS (
    SELECT timezone(p.timezone, $2::timestamp)             AS lo,
           timezone(p.timezone, ($3::date + 1)::timestamp) AS hi
      FROM properties p
     WHERE p.property_id = $1
  )`;

/* ----------------------------------------------------------------- property */

export type Property = {
  property_id: number;
  name: string;
  town: string;
  region: string;
  rooms: number;
  timezone: string;
  /** Autumn's share of bookings it drove. Flagship is 13%, no fixed fees. */
  autumn_fee_pct: number;
  /** The commission the same booking would have carried through an OTA. */
  ota_commission_pct: number;
  program_start_date: string | null;
};

/** No date axis. The property card and every fee comparison on both screens. */
export async function getProperty(): Promise<Property | null> {
  const rows = await q<Property>(
    `SELECT property_id,
            name,
            town,
            region,
            rooms,
            timezone,
            autumn_fee_pct::float8     AS autumn_fee_pct,
            ota_commission_pct::float8 AS ota_commission_pct,
            to_char(program_start_date, 'YYYY-MM-DD') AS program_start_date
       FROM properties
      WHERE property_id = $1`,
    [PROPERTY_ID],
  );
  return rows[0] ?? null;
}

/* ------------------------------------------------------------------ periods */

export type RangeKey = "last_30" | "last_90" | "ytd" | "last_12m";

export type PeriodSet = {
  range: RangeKey;
  current: Period;
  /** The window immediately before the current one, same length. */
  prior: Period;
  /** The same calendar dates a year earlier — the only honest comparison for a
   *  seasonal property (persona rank 4). November against October is noise. */
  lastYear: Period;
  /** True when the range is long enough that prior and lastYear are the same
   *  window; the screen should then show only one of them. */
  priorIsLastYear: boolean;
};

const RANGE_LABELS: Record<RangeKey, [current: string, prior: string, lastYear: string]> = {
  last_30: ["Last 30 days", "The 30 days before", "The same 30 days last year"],
  last_90: ["Last 90 days", "The 90 days before", "The same 90 days last year"],
  ytd: ["This year so far", "The same stretch before that", "The same stretch last year"],
  last_12m: ["Last 12 months", "The 12 months before", "The same 12 months last year"],
};

/**
 * MARKETING axis anchor. Reads the last day the data actually covers rather
 * than trusting the wall clock, so "last 30 days" never stretches across a
 * trailing week of empty days while a seed is still running or the export is a
 * day behind. Falls back to today when the table is empty.
 */
async function getAnchorDate(): Promise<string> {
  const rows = await q<{ anchor: string | null }>(
    `SELECT to_char(
              LEAST(
                current_date,
                COALESCE(
                  (SELECT max((b.booked_at AT TIME ZONE p.timezone)::date)
                     FROM bookings b
                    WHERE b.property_id = p.property_id),
                  current_date
                )
              ), 'YYYY-MM-DD') AS anchor
       FROM properties p
      WHERE p.property_id = $1`,
    [PROPERTY_ID],
  );
  return rows[0]?.anchor ?? ymd(new Date());
}

/**
 * MARKETING axis. Serves persona rank 4 ("better or worse than last year").
 * Default is the rolling 90 days: at roughly ten bookings a month a single
 * month swings +/-45% on noise alone, and three months cuts the relative noise
 * from 32% to 18%. That is why month-against-last-month is not offered.
 */
export async function getPeriods(range: RangeKey = "last_90"): Promise<PeriodSet> {
  const anchor = await getAnchorDate();

  let start: string;
  switch (range) {
    case "last_30":
      start = addDays(anchor, -29);
      break;
    case "last_90":
      start = addDays(anchor, -89);
      break;
    case "ytd":
      start = `${anchor.slice(0, 4)}-01-01`;
      break;
    case "last_12m":
      start = addDays(addMonths(anchor, -12), 1);
      break;
  }

  const [curLabel, priorLabel, lastYearLabel] = RANGE_LABELS[range];
  const current: Period = { start, end: anchor, label: curLabel };

  // Prior = the same length of time, ending the day before the current window.
  const priorEnd = addDays(start, -1);
  const priorStart =
    range === "last_12m" ? addMonths(start, -12) : addDays(priorEnd, -(spanDays(current) - 1));
  const prior: Period = { start: priorStart, end: priorEnd, label: priorLabel };

  const lastYear: Period = {
    start: addYears(current.start, -1),
    end: addYears(current.end, -1),
    label: lastYearLabel,
  };

  return {
    range,
    current,
    prior,
    lastYear,
    priorIsLastYear: prior.start === lastYear.start && prior.end === lastYear.end,
  };
}

/* ----------------------------------------------------------------- headline */

const EMPTY_HEADLINE: Headline = {
  bookings: 0,
  valueCents: 0,
  priorBookings: 0,
  priorValueCents: 0,
  lastYearBookings: 0,
  lastYearValueCents: 0,
};

/**
 * MARKETING axis (booked_at). Persona rank 1 — "how many bookings did you get
 * me and what are they worth" — with rank 4's two comparisons alongside, so all
 * three windows are counted in one pass and cannot drift apart.
 * Cancellations are excluded everywhere: a cancelled booking is not revenue,
 * and counting it would be the exact overclaim this screen exists to avoid.
 */
export async function getHeadline(periods: PeriodSet): Promise<Headline> {
  const { current, prior, lastYear } = periods;
  const rows = await q<{
    bookings: NumLike;
    value_cents: NumLike;
    prior_bookings: NumLike;
    prior_value_cents: NumLike;
    last_year_bookings: NumLike;
    last_year_value_cents: NumLike;
  }>(
    `WITH w AS (
       SELECT timezone(p.timezone, $2::timestamp)             AS c_lo,
              timezone(p.timezone, ($3::date + 1)::timestamp) AS c_hi,
              timezone(p.timezone, $4::timestamp)             AS p_lo,
              timezone(p.timezone, ($5::date + 1)::timestamp) AS p_hi,
              timezone(p.timezone, $6::timestamp)             AS y_lo,
              timezone(p.timezone, ($7::date + 1)::timestamp) AS y_hi
         FROM properties p
        WHERE p.property_id = $1
     )
     SELECT count(b.booking_id) FILTER (WHERE b.booked_at >= w.c_lo AND b.booked_at < w.c_hi) AS bookings,
            COALESCE(sum(b.total_value_cents)
                     FILTER (WHERE b.booked_at >= w.c_lo AND b.booked_at < w.c_hi), 0)        AS value_cents,
            count(b.booking_id) FILTER (WHERE b.booked_at >= w.p_lo AND b.booked_at < w.p_hi) AS prior_bookings,
            COALESCE(sum(b.total_value_cents)
                     FILTER (WHERE b.booked_at >= w.p_lo AND b.booked_at < w.p_hi), 0)        AS prior_value_cents,
            count(b.booking_id) FILTER (WHERE b.booked_at >= w.y_lo AND b.booked_at < w.y_hi) AS last_year_bookings,
            COALESCE(sum(b.total_value_cents)
                     FILTER (WHERE b.booked_at >= w.y_lo AND b.booked_at < w.y_hi), 0)        AS last_year_value_cents
       FROM w
       LEFT JOIN bookings b
              ON b.property_id  = $1
             AND b.attribution  = 'autumn_ads'
             AND b.cancelled_at IS NULL
             AND b.booked_at   >= LEAST(w.c_lo, w.p_lo, w.y_lo)
             AND b.booked_at   <  GREATEST(w.c_hi, w.p_hi, w.y_hi)`,
    [PROPERTY_ID, current.start, current.end, prior.start, prior.end, lastYear.start, lastYear.end],
  );

  const r = rows[0];
  if (!r) return EMPTY_HEADLINE;
  return {
    bookings: num(r.bookings),
    valueCents: num(r.value_cents),
    priorBookings: num(r.prior_bookings),
    priorValueCents: num(r.prior_value_cents),
    lastYearBookings: num(r.last_year_bookings),
    lastYearValueCents: num(r.last_year_value_cents),
  };
}

/* ----------------------------------------------------------- cost vs commission */

/**
 * MARKETING axis (ad_metrics_daily.metric_date for spend, booked_at for value).
 * Persona rank 2 — the fluent question, "is this cheaper than the commission I
 * would have paid".
 *
 * What the owner is billed is the Autumn fee alone: Flagship has no fixed fees,
 * takes 13% of bookings driven, and Autumn covers the ad spend. So
 * `totalCostCents === autumnFeeCents`, and `adSpendCents` is what Autumn spent
 * on his behalf — proof of work, not a line on his invoice. Any screen that
 * adds the two together is telling him he paid for something he did not.
 *
 * Both fee figures are computed from the same summed booking value that feeds
 * the headline, so the comparison and the headline can never disagree.
 */
export async function getCostComparison(period: Period): Promise<CostComparison> {
  const rows = await q<{
    ad_spend_cents: NumLike;
    autumn_fee_cents: NumLike;
    ota_commission_cents: NumLike;
    autumn_fee_pct: NumLike;
    ota_commission_pct: NumLike;
  }>(
    `WITH p AS (
       SELECT property_id, timezone, autumn_fee_pct, ota_commission_pct
         FROM properties WHERE property_id = $1
     ),${MARKETING_WINDOW},
     spend AS (
       SELECT COALESCE(sum(a.cost_cents), 0) AS cents
         FROM ad_metrics_daily a
        WHERE a.property_id = $1
          AND a.metric_date BETWEEN $2::date AND $3::date
     ),
     driven AS (
       SELECT COALESCE(sum(b.total_value_cents), 0) AS cents
         FROM bookings b, win w
        WHERE b.property_id  = $1
          AND b.attribution  = 'autumn_ads'
          AND b.cancelled_at IS NULL
          AND b.booked_at   >= w.lo
          AND b.booked_at   <  w.hi
     )
     SELECT spend.cents                                          AS ad_spend_cents,
            round(p.autumn_fee_pct * driven.cents)::bigint       AS autumn_fee_cents,
            round(p.ota_commission_pct * driven.cents)::bigint   AS ota_commission_cents,
            p.autumn_fee_pct::float8                             AS autumn_fee_pct,
            p.ota_commission_pct::float8                         AS ota_commission_pct
       FROM p, spend, driven`,
    [PROPERTY_ID, period.start, period.end],
  );

  const r = rows[0];
  const autumnFeeCents = num(r?.autumn_fee_cents);
  return {
    adSpendCents: num(r?.ad_spend_cents),
    autumnFeeCents,
    // Autumn covers the ad spend, so the fee IS the total the owner pays.
    totalCostCents: autumnFeeCents,
    otaCommissionCents: num(r?.ota_commission_cents),
    otaCommissionPct: num(r?.ota_commission_pct),
    autumnFeePct: num(r?.autumn_fee_pct),
  };
}

/* --------------------------------------------------------------- honesty note */

/**
 * MARKETING axis (booked_at). Persona rank 3 — "would I have got these anyway".
 * Branded search is the guest who already knew the inn's name; the cross-vertical
 * pause-study evidence says roughly half of those clicks were coming regardless
 * when the property holds the top organic rank. Everything else is a guest who
 * was looking for a place to stay, not for this place. Splitting them on screen
 * is the difference between a report and a sales document.
 */
export async function getIncrementality(period: Period): Promise<Incrementality> {
  const rows = await q<{ by_name: NumLike; new_to_you: NumLike }>(
    `WITH${MARKETING_WINDOW}
     SELECT count(b.booking_id) FILTER (WHERE c.category  = 'branded_search') AS by_name,
            count(b.booking_id) FILTER (WHERE c.category <> 'branded_search') AS new_to_you
       FROM win w
       LEFT JOIN bookings b
              ON b.property_id  = $1
             AND b.attribution  = 'autumn_ads'
             AND b.cancelled_at IS NULL
             AND b.booked_at   >= w.lo
             AND b.booked_at   <  w.hi
       LEFT JOIN campaigns c ON c.campaign_id = b.campaign_id`,
    [PROPERTY_ID, period.start, period.end],
  );
  const r = rows[0];
  return { byName: num(r?.by_name), newToYou: num(r?.new_to_you) };
}

/* ----------------------------------------------------------------- insights */

/**
 * No date axis — insights are authored, not derived. Persona ranks 5 and 7,
 * "is anything wrong right now" and "what did you actually do", both answered
 * in sentences. Pinned first so a live heads-up outranks a newer all-clear.
 */
export async function getInsights(limit = 4): Promise<Insight[]> {
  const rows = await q<Insight>(
    `SELECT i.insight_id,
            to_char(i.published_at AT TIME ZONE p.timezone, 'YYYY-MM-DD"T"HH24:MI:SS') AS published_at,
            i.kind,
            i.headline,
            i.body,
            i.action_needed_from_owner,
            i.pinned
       FROM insights i
       JOIN properties p ON p.property_id = i.property_id
      WHERE i.property_id = $1
      ORDER BY i.pinned DESC, i.published_at DESC, i.insight_id DESC
      LIMIT $2`,
    [PROPERTY_ID, limit],
  );
  return rows;
}

/* ------------------------------------------------------------- monthly trend */

/**
 * MARKETING axis (booked_at, bucketed in property-local months). Persona rank 4.
 * The month spine is generated, not derived from the rows, so months before the
 * program started come back as honest zeros instead of vanishing — the "before"
 * is the most credible part of the chart.
 */
export async function getMonthlySeries(months = 24): Promise<MonthPoint[]> {
  const rows = await q<{ month: string; bookings: NumLike; value_cents: NumLike }>(
    `WITH p AS (SELECT timezone FROM properties WHERE property_id = $1),
     anchor AS (
       SELECT COALESCE(
                (SELECT max(date_trunc('month', b.booked_at AT TIME ZONE (SELECT timezone FROM p)))
                   FROM bookings b WHERE b.property_id = $1),
                date_trunc('month', current_date::timestamp)
              ) AS m
     ),
     spine AS (
       SELECT generate_series(
                a.m - ($2::int - 1) * interval '1 month',
                a.m,
                interval '1 month'
              )::date AS month
         FROM anchor a
     )
     SELECT to_char(s.month, 'YYYY-MM')                     AS month,
            count(b.booking_id)                             AS bookings,
            COALESCE(sum(b.total_value_cents), 0)           AS value_cents
       FROM spine s
       LEFT JOIN bookings b
              ON b.property_id  = $1
             AND b.attribution  = 'autumn_ads'
             AND b.cancelled_at IS NULL
             AND date_trunc('month', b.booked_at AT TIME ZONE (SELECT timezone FROM p))::date = s.month
      GROUP BY s.month
      ORDER BY s.month`,
    [PROPERTY_ID, Math.max(1, Math.trunc(months))],
  );
  return rows.map((r) => ({
    month: r.month,
    bookings: num(r.bookings),
    valueCents: num(r.value_cents),
  }));
}

/* ------------------------------------------------------------ where you appeared */

/**
 * MARKETING axis — spend on metric_date, bookings on booked_at, aggregated
 * separately and then joined on the campaign so neither side fans the other
 * out. Screen 2, persona rank 7 ("what did you actually do") and the
 * saw → visited → booked path.
 *
 * Campaigns are listed if they overlapped the window at all, so a channel that
 * was live and did nothing still shows its zero rather than quietly disappearing.
 */
export async function getChannelBreakdown(period: Period): Promise<ChannelRow[]> {
  const rows = await q<{
    category: string;
    display_name: string;
    impressions: NumLike;
    eligible: NumLike;
    clicks: NumLike;
    cost_cents: NumLike;
    bookings: NumLike;
    value_cents: NumLike;
  }>(
    `WITH${MARKETING_WINDOW},
     ads AS (
       SELECT a.campaign_id,
              sum(a.impressions)          AS impressions,
              sum(a.eligible_impressions) AS eligible,
              sum(a.clicks)               AS clicks,
              sum(a.cost_cents)           AS cost_cents
         FROM ad_metrics_daily a
        WHERE a.property_id = $1
          AND a.metric_date BETWEEN $2::date AND $3::date
        GROUP BY a.campaign_id
     ),
     booked AS (
       SELECT b.campaign_id,
              count(*)                    AS bookings,
              sum(b.total_value_cents)    AS value_cents
         FROM bookings b, win w
        WHERE b.property_id  = $1
          AND b.attribution  = 'autumn_ads'
          AND b.cancelled_at IS NULL
          AND b.booked_at   >= w.lo
          AND b.booked_at   <  w.hi
        GROUP BY b.campaign_id
     )
     SELECT c.category,
            c.display_name,
            COALESCE(ads.impressions, 0) AS impressions,
            COALESCE(ads.eligible, 0)    AS eligible,
            COALESCE(ads.clicks, 0)      AS clicks,
            COALESCE(ads.cost_cents, 0)  AS cost_cents,
            COALESCE(booked.bookings, 0) AS bookings,
            COALESCE(booked.value_cents, 0) AS value_cents
       FROM campaigns c
       LEFT JOIN ads    ON ads.campaign_id    = c.campaign_id
       LEFT JOIN booked ON booked.campaign_id = c.campaign_id
      WHERE c.property_id = $1
        AND c.started_on <= $3::date
        AND (c.ended_on IS NULL OR c.ended_on >= $2::date)
      ORDER BY COALESCE(booked.bookings, 0) DESC,
               COALESCE(booked.value_cents, 0) DESC,
               COALESCE(ads.clicks, 0) DESC,
               c.category`,
    [PROPERTY_ID, period.start, period.end],
  );
  return rows.map((r) => ({
    category: r.category,
    display_name: r.display_name,
    impressions: num(r.impressions),
    eligible: num(r.eligible),
    clicks: num(r.clicks),
    costCents: num(r.cost_cents),
    bookings: num(r.bookings),
    valueCents: num(r.value_cents),
  }));
}

/* ----------------------------------------------------- where guests come from */

/**
 * MARKETING axis (booked_at). Screen 2, persona rank 6 — "are the right guests
 * finding me". Ranked by bookings, then by value, because two markets tie on
 * count often at this volume and the tie-break he cares about is dollars.
 */
export async function getFeederMarkets(period: Period): Promise<FeederRow[]> {
  const rows = await q<{ market: string; bookings: NumLike; value_cents: NumLike }>(
    `WITH${MARKETING_WINDOW}
     SELECT b.feeder_market                AS market,
            count(*)                       AS bookings,
            sum(b.total_value_cents)       AS value_cents
       FROM bookings b, win w
      WHERE b.property_id  = $1
        AND b.attribution  = 'autumn_ads'
        AND b.cancelled_at IS NULL
        AND b.booked_at   >= w.lo
        AND b.booked_at   <  w.hi
      GROUP BY b.feeder_market
      ORDER BY count(*) DESC, sum(b.total_value_cents) DESC, b.feeder_market`,
    [PROPERTY_ID, period.start, period.end],
  );
  return rows.map((r) => ({
    market: r.market,
    bookings: num(r.bookings),
    valueCents: num(r.value_cents),
  }));
}

/* ------------------------------------------------------------ the actual book */

/**
 * MARKETING axis (booked_at), newest first. Screen 2, persona rank 8 — the row
 * he checks line by line against his own reservation system. It carries both
 * dates on purpose: the night he took the booking and the night the guest
 * arrives are the two things he can look up.
 */
export async function getRecentBookings(period: Period, limit = 12): Promise<BookingRow[]> {
  const rows = await q<{
    booking_id: number;
    booked_at: string;
    check_in: string;
    nights: number;
    total_value_cents: NumLike;
    feeder_market: string;
    device: string;
    campaign_name: string | null;
  }>(
    `SELECT b.booking_id,
            to_char(b.booked_at AT TIME ZONE pr.timezone,
                    'YYYY-MM-DD"T"HH24:MI:SS')  AS booked_at,
            to_char(b.check_in, 'YYYY-MM-DD')   AS check_in,
            b.nights,
            b.total_value_cents,
            b.feeder_market,
            b.device,
            c.display_name                      AS campaign_name
       FROM bookings b
       JOIN properties pr     ON pr.property_id = b.property_id
       LEFT JOIN campaigns c  ON c.campaign_id  = b.campaign_id
      WHERE b.property_id  = $1
        AND b.attribution  = 'autumn_ads'
        AND b.cancelled_at IS NULL
        AND b.booked_at   >= timezone(pr.timezone, $2::timestamp)
        AND b.booked_at   <  timezone(pr.timezone, ($3::date + 1)::timestamp)
      ORDER BY b.booked_at DESC, b.booking_id DESC
      LIMIT $4`,
    [PROPERTY_ID, period.start, period.end, limit],
  );
  return rows.map((r) => ({
    booking_id: Number(r.booking_id),
    booked_at: r.booked_at,
    check_in: r.check_in,
    nights: Number(r.nights),
    totalValueCents: num(r.total_value_cents),
    feeder_market: r.feeder_market,
    device: r.device,
    campaignName: r.campaign_name,
  }));
}

/* ---------------------------------------------------------------- occupancy */

export type Occupancy = {
  /** Room nights that fall inside the window, from every source. */
  roomNights: number;
  /** rooms x days. The most rooms that could have been sold. */
  capacityNights: number;
  rooms: number;
  days: number;
  /** Ratio of the two sums above. 0 when there is no capacity to divide by. */
  occupancy: number;
  /** Of those room nights, the ones traced to an Autumn ad click. */
  autumnRoomNights: number;
};

/**
 * OCCUPANCY axis (check_in), and the only query here that uses it. Nights are
 * clipped to the window rather than counted whole, so a five-night stay that
 * straddles the last day contributes only the nights actually inside it —
 * otherwise occupancy can exceed 100% at a boundary and the number stops being
 * believable. Every attribution counts: this is the house, not the campaign.
 */
export async function getOccupancy(period: Period): Promise<Occupancy> {
  const rows = await q<{
    room_nights: NumLike;
    autumn_room_nights: NumLike;
    rooms: NumLike;
    days: NumLike;
  }>(
    `WITH p AS (SELECT rooms FROM properties WHERE property_id = $1),
     stays AS (
       SELECT COALESCE(sum(
                GREATEST(0, LEAST(b.check_in + b.nights::int, $3::date + 1)
                            - GREATEST(b.check_in, $2::date))
              ), 0) AS room_nights,
              COALESCE(sum(
                GREATEST(0, LEAST(b.check_in + b.nights::int, $3::date + 1)
                            - GREATEST(b.check_in, $2::date))
              ) FILTER (WHERE b.attribution = 'autumn_ads'), 0) AS autumn_room_nights
         FROM bookings b
        WHERE b.property_id  = $1
          AND b.cancelled_at IS NULL
          AND b.check_in    <= $3::date
          AND (b.check_in + b.nights::int) > $2::date
     )
     SELECT s.room_nights,
            s.autumn_room_nights,
            COALESCE(p.rooms, 0)         AS rooms,
            ($3::date - $2::date + 1)    AS days
       FROM stays s
       LEFT JOIN p ON true`,
    [PROPERTY_ID, period.start, period.end],
  );

  const r = rows[0];
  const roomNights = num(r?.room_nights);
  const rooms = num(r?.rooms);
  const days = num(r?.days);
  const capacityNights = rooms * days;
  return {
    roomNights,
    capacityNights,
    rooms,
    days,
    occupancy: capacityNights > 0 ? roomNights / capacityNights : 0,
    autumnRoomNights: num(r?.autumn_room_nights),
  };
}
