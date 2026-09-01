/**
 * Seed parameters. Every number here is a constant from DATA_REALISM.md (cited
 * as DR §n) or an explicitly flagged assumption from it. Nothing is invented
 * at this layer, and nothing is hard-coded inside the generator — the research
 * flagged several of these KNOWN UNKNOWN, so each has to stay a tunable dial.
 */

/** DR §9 — determinism is the requirement; the value itself is arbitrary. */
export const RNG_SEED = 20240901;

export const PROPERTY = {
  property_id: 1,
  name: "The Brass Lantern Inn",
  town: "Stowe, VT",
  region: "stowe" as const,
  rooms: 12,
  timezone: "America/New_York",
  autumn_fee_pct: 0.13,
  /** Median OTA commission the owner is comparing against (persona Q2). */
  ota_commission_pct: 0.17,
  program_start_date: "2024-12-01",
};

/** DR §1 — blended 60% Stowe / 40% VT statewide, for a 12-room village inn. */
export const MONTHLY = [
  { m: 1,  occupancy: 0.75, adr: 254, roomNights: 280, season: "high" },
  { m: 2,  occupancy: 0.84, adr: 270, roomNights: 281, season: "peak" },
  { m: 3,  occupancy: 0.56, adr: 240, roomNights: 208, season: "high" },
  { m: 4,  occupancy: 0.26, adr: 183, roomNights: 94,  season: "trough" },
  { m: 5,  occupancy: 0.32, adr: 195, roomNights: 120, season: "trough" },
  { m: 6,  occupancy: 0.44, adr: 216, roomNights: 158, season: "shoulder" },
  { m: 7,  occupancy: 0.52, adr: 240, roomNights: 195, season: "shoulder" },
  { m: 8,  occupancy: 0.60, adr: 249, roomNights: 223, season: "shoulder" },
  { m: 9,  occupancy: 0.57, adr: 249, roomNights: 206, season: "high" },
  { m: 10, occupancy: 0.70, adr: 287, roomNights: 262, season: "peak" },
  { m: 11, occupancy: 0.36, adr: 193, roomNights: 130, season: "trough" },
  { m: 12, occupancy: 0.67, adr: 268, roomNights: 251, season: "peak" },
] as const;

/** DR §2 — shape from the Commodores Inn rate card, stretched one tier up. */
export const RATE_BANDS = {
  peak:     { midweek: 235_00, weekend: 315_00, holiday: 395_00 },
  high:     { midweek: 205_00, weekend: 270_00, holiday: 330_00 },
  shoulder: { midweek: 185_00, weekend: 250_00, holiday: 300_00 },
  trough:   { midweek: 145_00, weekend: 195_00, holiday: 235_00 },
} as const;

/** DR §3 — Vermont visitor surveys. Buckets are the annual blend. */
export const LEAD_TIME_BUCKETS = [
  { maxDays: 7,   share: 0.24 },
  { maxDays: 30,  share: 0.16 },
  { maxDays: 90,  share: 0.27 },
  { maxDays: 240, share: 0.33 },
] as const;

/** DR §3 — median days in advance shifts by season. */
export const LEAD_TIME_MEDIAN = { winter: 25, fall: 34, mud: 16, default: 30 } as const;

/** DR §3 — hotel visitors average 3.0 nights. */
export const NIGHTS_WEIGHTS = [
  { nights: 1, w: 0.18 }, { nights: 2, w: 0.42 },
  { nights: 3, w: 0.26 }, { nights: 4, w: 0.14 },
] as const;

/** DR §4a — arrivals. Friday dominates; a leisure stay starts Friday. */
export const DOW_ARRIVAL = [0.75, 0.60, 0.55, 0.60, 1.00, 2.20, 1.30]; // Sun..Sat
/** DR §4b — when people search and book. Monday dominates. Deliberately NOT §4a. */
export const DOW_SEARCH  = [0.67, 1.35, 1.28, 1.15, 1.05, 0.90, 0.60]; // Sun..Sat

/**
 * DR §5 channel seed values, as revised by METRIC_SEMANTICS §2.2. Where the two
 * disagree the reconciled Phase 2 value wins — non-branded CTR 4.0%, blended
 * CVR ~3.10%, cost per booking ~$54 — and the disagreement stays on the record.
 */
export const CHANNELS = {
  branded_search: {
    display_name: "Guests searching for you by name",
    // cvr 0.040, not DR §5's 0.051: METRIC_SEMANTICS §2.2 files this as its most
    // consequential DISAGREE (3.87% blended is above the entire boutique booking
    // band). 0.040 across this table blends to 3.14% ≈ the reconciled 3.10%, and
    // lands cost per booking at ~$51, inside the $48–$55 the same section cites.
    clickShare: 0.55, ctr: 0.150, cpc_cents: 110, cvr: 0.040, impressionShare: 0.92,
  },
  nonbranded_search: {
    display_name: "Guests looking for a place to stay near you",
    clickShare: 0.24, ctr: 0.040, cpc_cents: 300, cvr: 0.010, impressionShare: 0.50,
  },
  hotel_ads: {
    display_name: "Guests comparing room prices",
    clickShare: 0.15, ctr: 0.050, cpc_cents: 140, cvr: 0.038, impressionShare: 0.78,
  },
  maps: {
    display_name: "Guests finding you on the map",
    clickShare: 0.06, ctr: 0.055, cpc_cents: 90, cvr: 0.022, impressionShare: 0.85,
  },
} as const;

/** DR §6 — fail loudly rather than emit implausible volume for a 12-room inn. */
export const GUARDRAILS = {
  monthlyImpressions: [1_800, 4_200],
  monthlyClicks: [175, 390],
  monthlySpendCents: [290_00, 650_00],
} as const;

/** DR §6 — expected Autumn-attributed bookings per month at steady state. */
export const BOOKINGS_BY_MONTH = [13.3, 14.8, 10.8, 7.0, 7.6, 9.1, 10.4, 11.4, 11.2, 13.8, 7.9, 12.8];

/** DR §7 — Stowe drive-time weights. */
export const FEEDER_WEIGHTS = [
  { market: "Boston metro", w: 0.20 },
  { market: "New York City metro", w: 0.17 },
  { market: "Rest of US", w: 0.12 },
  { market: "Montreal", w: 0.09 },
  { market: "Hartford / central CT", w: 0.07 },
  { market: "Burlington & Vermont", w: 0.07 },
  { market: "New Hampshire", w: 0.07 },
  { market: "Albany / Capital District", w: 0.05 },
  { market: "Northern New Jersey", w: 0.05 },
  { market: "Rest of New England", w: 0.05 },
  { market: "Philadelphia", w: 0.04 },
  { market: "International", w: 0.02 },
] as const;

/** DR §7 — winter pulls Montreal and NYC up; fall pulls Boston and the south up. */
export const FEEDER_SEASONAL = {
  winter: { Montreal: 1.6, "New York City metro": 1.15 },
  fall:   { "Boston metro": 1.2, "Hartford / central CT": 1.15, Philadelphia: 1.2 },
} as const;

/** DR §8 — the two phases differ; mobile researches, desktop books. */
export const DEVICE_SEARCH  = { mobile: 0.62, desktop: 0.33, tablet: 0.05 } as const;
export const DEVICE_BOOKING = { mobile: 0.44, desktop: 0.52, tablet: 0.04 } as const;

/** DR §8 — booking hour. Near zero overnight, evening peak, 9PM Monday strongest. */
export const HOUR_WEIGHTS = [
  0.15, 0.10, 0.10, 0.10, 0.10, 0.15, 0.30, 0.60, 0.85, 1.00, 1.20, 1.10,
  1.05, 1.10, 1.15, 1.20, 1.45, 1.85, 2.00, 1.85, 1.70, 1.45, 0.90, 0.45,
];

/**
 * DR §9 — the 24-month arc. Multiplier scales ad activity; `ads:false` means the
 * program was not running, which is what gives screen 1 an honest before.
 */
export const STORY_ARC: Record<string, { mult: number; ads: boolean; note?: string }> = {
  "2024-09": { mult: 0, ads: false }, "2024-10": { mult: 0, ads: false },
  "2024-11": { mult: 0, ads: false },
  "2024-12": { mult: 0.40, ads: true, note: "branded only" },
  "2025-01": { mult: 0.70, ads: true }, "2025-02": { mult: 0.95, ads: true },
  "2025-03": { mult: 1.0, ads: true }, "2025-04": { mult: 1.0, ads: true },
  "2025-05": { mult: 1.0, ads: true }, "2025-06": { mult: 1.0, ads: true },
  "2025-07": { mult: 1.0, ads: true }, "2025-08": { mult: 1.0, ads: true },
  "2025-09": { mult: 1.0, ads: true }, "2025-10": { mult: 1.0, ads: true },
  "2025-11": { mult: 1.0, ads: true }, "2025-12": { mult: 1.0, ads: true },
  "2026-01": { mult: 1.0, ads: true }, "2026-02": { mult: 1.0, ads: true },
  "2026-03": { mult: 1.0, ads: true }, "2026-04": { mult: 1.0, ads: true },
  "2026-05": { mult: 1.0, ads: true },
  "2026-06": { mult: 0.62, ads: true, note: "competitor bidding on the inn's name" },
  "2026-07": { mult: 1.08, ads: true }, "2026-08": { mult: 1.08, ads: true },
};

/** DR §9 — hard story constraints. The generator asserts these and re-draws. */
export const ARC_ASSERTIONS = {
  bestRevenueMonth: "2025-10",
  bestOccupancyMonth: "2026-02",
} as const;

/**
 * DR §9 — at λ≈10 bookings/month, ±45% month-over-month is one standard
 * deviation of ordinary noise. A dashboard that alarms on a single month cries
 * wolf about a third of the time, so nothing on screen 1 flags a MoM move.
 */
export const NOISE = { momOneSigmaAtTen: 0.45, clickNoise: 0.12 } as const;

/* ────────────────────────────────────────────────────────────────────────────
 * Dials the generator needs that the tables above do not carry. Same rule as
 * the rest of this file: every number is from the research or is an explicitly
 * flagged assumption, and none of them is written inside seed.ts.
 * ──────────────────────────────────────────────────────────────────────────── */

/** The seed window. Marketing data stops at the cutoff; stays run past it,
 *  because in a real book the autumn leaf-season stays are already sold. */
export const WINDOW = {
  firstStayMonth: "2024-09",
  lastStayMonth: "2026-08",
  /** Stays already on the books beyond the cutoff (persona Q10, "what next"). */
  tailStayMonth: "2026-12",
  cutoff: "2026-08-31",
} as const;

/**
 * DR §9 — the campaigns start in the order the arc describes: brand first in
 * Dec 2024, non-branded and hotel listings in the January ramp, Maps last.
 */
export const CAMPAIGN_STARTS = {
  branded_search: "2024-12-01",
  nonbranded_search: "2025-01-01",
  hotel_ads: "2025-01-01",
  maps: "2025-02-01",
} as const;

/**
 * DR §9 — "conversion below the mature rate as bidding settles". Solving DR's
 * own click ramp (~40% / ~70% / ~95% of steady state) against the bookings the
 * arc multiplier allows gives these three factors on the blended booking rate.
 */
export const RAMP_CVR_FACTOR: Record<string, number> = {
  "2024-12": 0.80,
  "2025-01": 0.90,
  "2025-02": 0.97,
};

/**
 * DR §9 dip event, in full. The month multiplier lives in STORY_ARC; these are
 * the two numbers that make the dip *visible on screen 2* rather than merely
 * smaller: brand impression share 92% → 68%, and cost per booking ~$58 (up from
 * ~$51). The CPC uplift needed to hit that cost per booking is solved for, not
 * asserted, so the three numbers can never disagree with each other.
 */
export const DIP_EVENT = {
  month: "2026-06",
  brandedImpressionShare: 0.68,
  /** DR §9: "branded clicks fall ~35%". Only the name searches move — the map,
   *  the hotel comparisons and the non-name searches carry on as usual, which is
   *  what makes the event legible on screen 2 instead of just smaller. The extra
   *  loss lands on the branded booking rate (a guest who has just been shown a
   *  competitor converts worse), solved so the month totals hit STORY_ARC. */
  brandedClickMult: 0.65,
  /**
   * What the competitor does to the price of the name. DR §9 states the outcome
   * as "cost per booking rises to ~$58" — but that $58 was 1.35× its own $43
   * baseline, and METRIC_SEMANTICS §2.2 superseded the $43. The RATIO is the
   * part that survives, so it is the ratio that is seeded and asserted, and the
   * absolute lands wherever this composition puts it.
   */
  brandedCpcUplift: 1.35,
  costPerBookingRatioBand: [1.25, 1.85],
} as const;

/**
 * METRIC_SEMANTICS §2.2 — the reconciled booking rate raises clicks ~25%, so the
 * DR §6 bounds in GUARDRAILS move with it: "Phase 1 monthly range × 1.25".
 * GUARDRAILS stays on the record above; this is what the generator asserts.
 */
export const GUARDRAILS_RECONCILED = {
  monthlyImpressions: [2_700, 5_900],
  monthlyClicks: [225, 480],
  monthlySpendCents: [375_00, 800_00],
} as const;

/**
 * DR §6 — "never above ~10,000 impressions or ~1,000 clicks in a month for a
 * property this size without an explicit reason in the data story". Spend
 * ceiling is Revolution Media's top of band for a 10–25 room property.
 */
export const ABSOLUTE_CEILING = {
  monthlyImpressions: 10_000,
  monthlyClicks: 1_000,
  monthlySpendCents: 1_200_00,
} as const;

/**
 * Autumn's attributed share of the book, asserted after the draw. DR §6 lands
 * at 13% of rooms revenue; the 10–20% band is the claim Autumn makes out loud,
 * and anything outside it is a credibility failure, not a rounding difference.
 */
export const ATTRIBUTION_SHARE_BOUNDS = [0.10, 0.20] as const;

/**
 * `ASSUMPTION:` the rest of the book. No source splits an inn's non-paid direct
 * business three ways; the shape (repeat guests a third of it) is the common
 * innkeeper figure and is a dial, not a fact. `KNOWN UNKNOWN`.
 */
export const NON_AUTUMN_MIX = [
  { attribution: "organic_direct", w: 0.47 },
  { attribution: "repeat_guest", w: 0.32 },
  { attribution: "other_direct", w: 0.21 },
] as const;

/**
 * Site-wide booking rate used to size total sessions. Revolution Media's worked
 * example assumes 2% on a hotel website, and boutique booking conversion is
 * reported at 0.73–2.25% (METRIC_SEMANTICS §2.1), so the paid sessions convert
 * at the reconciled ~3.1% and the rest of the site's traffic dilutes it to 2%.
 */
export const SITE_BOOKING_RATE = 0.020;

/**
 * `ASSUMPTION:` cancellations. No source in the dossier covers cancellation rate
 * for a small inn — `KNOWN UNKNOWN`, kept low and kept out of every headline,
 * since the views exclude cancelled rows.
 */
export const CANCELLATION_RATE = 0.05;

/**
 * Calendar facts, not market data: the nights an inn in Stowe prices as holiday
 * or event nights (DR §2's third rate column). Month/day pairs, inclusive.
 */
export const HOLIDAY_PERIODS: Array<[string, string]> = [
  ["12-23", "01-02"], // Christmas through New Year
  ["01-16", "01-20"], // Martin Luther King Jr weekend
  ["02-13", "02-22"], // Presidents' week
  ["05-22", "05-27"], // Memorial Day weekend
  ["07-01", "07-07"], // Independence Day week
  ["08-29", "09-02"], // Labor Day weekend
  ["10-08", "10-14"], // Columbus Day / peak foliage weekend
  ["11-25", "11-30"], // Thanksgiving
];

/** DR §3 — which lead-time median applies in which stay month. */
export const LEAD_SEASON_BY_MONTH: Record<number, keyof typeof LEAD_TIME_MEDIAN> = {
  1: "winter", 2: "winter", 3: "winter", 4: "mud", 5: "mud", 6: "default",
  7: "default", 8: "default", 9: "fall", 10: "fall", 11: "fall", 12: "winter",
};

/** DR §7 — which feeder-market shift applies in which stay month. */
export const FEEDER_SEASON_BY_MONTH: Record<number, keyof typeof FEEDER_SEASONAL | null> = {
  1: "winter", 2: "winter", 3: "winter", 4: null, 5: null, 6: null,
  7: null, 8: null, 9: "fall", 10: "fall", 11: "fall", 12: "winter",
};

/** DR §9 — Jul–Aug 2026 must come in above the same months in 2025 for the
 *  maturity note to be true. Asserted on the pair, not on either month alone. */
export const SUMMER_YOY_MONTHS = {
  prior: ["2025-07", "2025-08"],
  current: ["2026-07", "2026-08"],
  /** DR §9 puts the recovery ~8% up, and PRODUCT's claim is a 10–20% RANGE, never
   *  a ceiling. At ~20 bookings a pair of months, Poisson alone can throw +60%,
   *  which reads as a boast rather than a result — so the draw is held to a band
   *  a skeptical innkeeper would believe. */
  liftBand: [0.04, 0.16],
} as const;

/**
 * `ASSUMPTION:` from DR §9 — during the ramp the brand impression share "climbs
 * past 85%", clearing the sourced warning threshold; these are the three months
 * before it settles at the CHANNELS value. Visible on screen 2 as a rising share.
 */
export const RAMP_BRAND_IMPRESSION_SHARE: Record<string, number> = {
  "2024-12": 0.80,
  "2025-01": 0.86,
  "2025-02": 0.90,
};

/**
 * DR §1 publishes an explicit seed RANGE for each month's occupancy, not just a
 * point. That range is the tolerance the generator is held to: a month outside
 * it is not noise, it is a broken generator. Percentage points.
 */
export const OCCUPANCY_RANGE: Record<number, [number, number]> = {
  1: [0.69, 0.81], 2: [0.78, 0.90], 3: [0.50, 0.62], 4: [0.20, 0.32],
  5: [0.26, 0.38], 6: [0.38, 0.50], 7: [0.46, 0.58], 8: [0.54, 0.66],
  9: [0.51, 0.63], 10: [0.64, 0.76], 11: [0.30, 0.42], 12: [0.61, 0.73],
};

/**
 * `ASSUMPTION:` the whole book is drawn to a nights target, not as a Poisson
 * count. DR §9's Poisson argument is explicitly about the ~10 program-driven
 * bookings a month, and that layer keeps it. The property's total room nights
 * are managed against the season — rates and inventory are moved to hold the
 * curve — so a ±3% band around the DR §1 room-night figure is the honest model,
 * and it keeps every month inside DR's own published occupancy range.
 */
export const TOTAL_BOOK_NOISE = 0.03;

/**
 * `ASSUMPTION:` how tightly the month's visits from Google track the month's
 * bookings. DATA_MODEL §5.6 derives clicks from bookings (coupling 1.0);
 * DR §9 gives clicks their own independent ±12% auction noise (coupling 0.0).
 * Neither extreme is right: a busy month really does bring more searching, but
 * hundreds of clicks do not inherit the ±45% Poisson swing of ten bookings.
 * `KNOWN UNKNOWN` — no source measures this correlation at property scale.
 */
export const CLICK_BOOKING_COUPLING = 0.45;

/**
 * How far a month's Poisson draw may stray from its expectation before it stops
 * being ordinary noise. DR §9 is emphatic that ±45% month over month is normal
 * at ten bookings, and the dashboard must not alarm at it — but a month that
 * lands at a fifth of expectation makes the written note beside it read as a
 * lie, so the draw is bounded and the noise inside the bound is left alone.
 */
export const DRAW_SANITY_BAND = [0.40, 2.0] as const;
