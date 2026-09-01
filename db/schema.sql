-- Autumn marketing dashboard — schema
-- Source of truth: docs/DATA_MODEL.md. Money is integer cents, never float.
-- Instants are timestamptz (UTC); calendar concepts are date in property-local time.
-- No rate is ever stored: rates do not aggregate, and a stored rate drifts from
-- the counts printed beside it. Every ratio is a ratio-of-sums at query time.

DROP VIEW  IF EXISTS monthly_summary;
DROP TABLE IF EXISTS insights, traffic_daily, bookings, ad_metrics_daily, campaigns, properties CASCADE;

CREATE TABLE properties (
  property_id        smallint PRIMARY KEY,
  name               text NOT NULL,
  town               text NOT NULL,
  region             text NOT NULL CHECK (region IN ('stowe','berkshires','hudson_valley')),
  rooms              smallint NOT NULL,
  timezone           text NOT NULL DEFAULT 'America/New_York',
  autumn_fee_pct     numeric(4,3) NOT NULL DEFAULT 0.130,
  ota_commission_pct numeric(4,3) NOT NULL DEFAULT 0.170,
  program_start_date date
);

CREATE TABLE campaigns (
  campaign_id  smallint PRIMARY KEY,
  property_id  smallint NOT NULL REFERENCES properties,
  category     text NOT NULL CHECK (category IN
               ('branded_search','nonbranded_search','hotel_ads','maps')),
  display_name text NOT NULL,
  started_on   date NOT NULL,
  ended_on     date,
  UNIQUE (property_id, category)
);

CREATE TABLE ad_metrics_daily (
  property_id          smallint NOT NULL REFERENCES properties,
  campaign_id          smallint NOT NULL REFERENCES campaigns,
  metric_date          date     NOT NULL,
  impressions          integer  NOT NULL DEFAULT 0,
  eligible_impressions integer  NOT NULL DEFAULT 0,
  clicks               integer  NOT NULL DEFAULT 0,
  cost_cents           integer  NOT NULL DEFAULT 0,
  PRIMARY KEY (property_id, campaign_id, metric_date),
  CHECK (clicks <= impressions AND impressions <= eligible_impressions)
);

CREATE TABLE bookings (
  booking_id        integer PRIMARY KEY GENERATED ALWAYS AS IDENTITY,
  property_id       smallint NOT NULL REFERENCES properties,
  booked_at         timestamptz NOT NULL,
  check_in          date NOT NULL,
  nights            smallint NOT NULL CHECK (nights BETWEEN 1 AND 21),
  room_rate_cents   integer NOT NULL,
  total_value_cents integer NOT NULL,
  attribution       text NOT NULL CHECK (attribution IN
                    ('autumn_ads','organic_direct','repeat_guest','other_direct')),
  campaign_id       smallint REFERENCES campaigns,
  feeder_market     text NOT NULL,
  device            text NOT NULL CHECK (device IN ('mobile','desktop','tablet')),
  cancelled_at      timestamptz,
  CHECK ((attribution = 'autumn_ads') = (campaign_id IS NOT NULL))
);

CREATE TABLE traffic_daily (
  property_id smallint NOT NULL REFERENCES properties,
  metric_date date     NOT NULL,
  device      text     NOT NULL CHECK (device IN ('mobile','desktop','tablet')),
  sessions    integer  NOT NULL DEFAULT 0,
  PRIMARY KEY (property_id, metric_date, device)
);

-- The trust surface. Authored by a person, not generated — Don's ranked
-- questions 5 and 7 are "is anything wrong" and "what did you actually do",
-- and both are answered in sentences, not charts.
CREATE TABLE insights (
  insight_id   integer PRIMARY KEY GENERATED ALWAYS AS IDENTITY,
  property_id  smallint NOT NULL REFERENCES properties,
  published_at timestamptz NOT NULL,
  period_start date NOT NULL,
  period_end   date NOT NULL CHECK (period_end >= period_start),
  kind         text NOT NULL CHECK (kind IN
               ('what_changed','what_we_did','heads_up','all_clear','resolved')),
  headline     text NOT NULL,
  body         text NOT NULL,
  action_needed_from_owner text,
  related_campaign_id smallint REFERENCES campaigns,
  pinned       boolean NOT NULL DEFAULT false
);

CREATE VIEW monthly_summary AS
SELECT
  b.property_id,
  date_trunc('month', b.booked_at AT TIME ZONE p.timezone)::date AS booked_month,
  count(*) FILTER (WHERE b.attribution = 'autumn_ads')                  AS autumn_bookings,
  count(*)                                                              AS all_direct_bookings,
  sum(b.total_value_cents) FILTER (WHERE b.attribution = 'autumn_ads')  AS autumn_value_cents,
  sum(b.total_value_cents)                                              AS all_direct_value_cents
FROM bookings b JOIN properties p USING (property_id)
WHERE b.cancelled_at IS NULL
GROUP BY 1, 2;

-- Indexes: at ~10k rows Postgres will seq-scan happily. These exist so the
-- pattern is right if properties multiply, and so the first query after Neon
-- resumes from scale-to-zero is not the slow one.
CREATE INDEX idx_bookings_marketing ON bookings (property_id, booked_at)
  INCLUDE (attribution, total_value_cents, nights);
CREATE INDEX idx_bookings_stay      ON bookings (property_id, check_in)
  INCLUDE (nights, total_value_cents);
CREATE INDEX idx_bookings_feeder    ON bookings (property_id, feeder_market, booked_at);
CREATE INDEX idx_bookings_device    ON bookings (property_id, device, booked_at);
CREATE INDEX idx_insights_recent    ON insights (property_id, published_at DESC);
CREATE INDEX idx_admetrics_date     ON ad_metrics_daily (property_id, metric_date)
  INCLUDE (campaign_id, impressions, eligible_impressions, clicks, cost_cents);
