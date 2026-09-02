/** The contract between the query layer and the two screens. */

export type Period = { start: string; end: string; label: string };

/** Screen 1, rank 1: how many bookings, worth what. */
export type Headline = {
  bookings: number;
  valueCents: number;
  priorBookings: number;
  priorValueCents: number;
  lastYearBookings: number;
  lastYearValueCents: number;
};

/** Screen 1, rank 2: what it cost, against the commission he'd have paid. */
export type CostComparison = {
  adSpendCents: number;
  autumnFeeCents: number;
  totalCostCents: number;
  otaCommissionCents: number;
  otaCommissionPct: number;
  autumnFeePct: number;
};

/** Screen 1, rank 3: the honesty note. Would he have got these anyway? */
export type Incrementality = {
  byName: number;
  newToYou: number;
};

/** Screen 1, rank 5 + 7: the trust surface, authored by a person. */
export type Insight = {
  insight_id: number;
  published_at: string;
  kind: "what_changed" | "what_we_did" | "heads_up" | "all_clear" | "resolved";
  headline: string;
  body: string;
  action_needed_from_owner: string | null;
  pinned: boolean;
};

/** Screen 2: the path from appearing to booking, per campaign category. */
export type ChannelRow = {
  category: string;
  display_name: string;
  impressions: number;
  eligible: number;
  clicks: number;
  costCents: number;
  bookings: number;
  valueCents: number;
};

/** Screen 2: the individual bookings, so he can check them against his own book. */
export type BookingRow = {
  booking_id: number;
  booked_at: string;
  check_in: string;
  nights: number;
  totalValueCents: number;
  feeder_market: string;
  device: string;
  campaignName: string | null;
  /** The ad category the booking is credited to, for the "found you" column. */
  category: string | null;
};

export type FeederRow = { market: string; bookings: number; valueCents: number };
export type MonthPoint = { month: string; bookings: number; valueCents: number };
