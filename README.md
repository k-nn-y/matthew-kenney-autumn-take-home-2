# The owner's results — Autumn take-home

A two-screen dashboard for the owner of a twelve-room Vermont inn, reporting
what Autumn's ads brought in, what they cost, and how it happened. Everything
on screen is written in the owner's language: bookings, dollars, nights and
plain sentences — one verdict, then the receipts behind it.

- **Screen 1 — Your results**: the verdict, what it cost against the
  commission a booking site would have taken, the shape of the season, and a
  note written by a person.
- **Screen 2 — How it happened**: the guest's path from search to stay, the
  four ways the ads work, where guests come from, and a ledger with one row
  per booking.

**Live production URL:** https://matthew-kenney-autumn-take-home-2-rust.vercel.app

There is no sign-in. The dashboard opens directly on the owner's results;
"Sign out" leads to a plain signed-out page with a single link back in.

## Reference screenshots

The two frames the build is held against, then the build itself, live in
[`docs/screenshots`](docs/screenshots):

1. `00-reference-current-dashboard-overview.png` — the current dashboard this replaces
2. `00-reference-current-dashboard-website-traffic.png` — its traffic view
3. `01`–`06` — both screens, loading and state frames
4. `07` — the responsive and state spec
5. `09`–`12` — not-yet-live, error, and 390px builds

## Setup

```bash
# .env.local
DATABASE_URL=postgres://…   # a Postgres/Neon connection string
ASK_EMAIL=owner-team@example.com

npm install
npm run seed   # ONLY against an empty database — creates 720 days of data
npm run dev
```

`npm run seed` writes the schema's tables and two years of believable inn
data (bookings, journeys, spend, occupancy, notes). Never run it against a
database that already has data.

`REPORT_ANCHOR_DATE` (YYYY-MM-DD) pins "today" for local state testing —
for example, a date past the reported-through date shows the not-reported
state. It is never set in production.

## The reconciliation test

```bash
npm run test:reconcile
```

For every period the picker offers, it proves the sheet agrees with itself:
the four ways add up to the verdict's booking count and dollars, the ledger
has exactly one row per booking and sums to the same dollars, and the
cost row's 13% is exactly 13% of those dollars. If any section could drift
from the verdict, this fails.

## Notes

- All dates render through `src/app/dates.ts`; all dollars through
  `Intl.NumberFormat` in `src/lib/db.ts`. Components never format either.
- States (loading, not reported, heads-up, too-few-days, not-yet-live,
  error) are driven by data and time only — no query-string overrides, no
  hard-coding.
- No hue carries meaning anywhere; the only accent is a single slate.
