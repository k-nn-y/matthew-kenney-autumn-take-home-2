# RESKIN_MAP.md

The target map for the visual direction pass driven by `PAPER_PROMPT.md` Phase 3.

Everything below is what exists **today**. The data plumbing — `src/lib/`, `db/`,
the two routes, the `?period=` contract — is stable and the reskin is applied
onto it. The visuals are a placeholder skin.

---

## Shared shell

| Component | Client? | Data it receives | States it supports |
|---|---|---|---|
| `app/layout.tsx` | server | `PROPERTY.name`, `PROPERTY.town` from `db/params.ts` (constants, not the DB) | one — always renders |
| `components/AppHeader.tsx` | **client** (`usePathname`) | `propertyName: string`, `town: string` | current-route marking via `aria-current`; no loading or empty variant |
| `components/Logo.tsx` | server | `width`, `height`, `title`, `className` | one |
| `components/PeriodPicker.tsx` | **client** | `value: PeriodKey` | idle · `pending` (from `useTransition`, exposed as `data-pending` + `aria-busy`) · no-JS (`<noscript>` submit button) |
| `components/Stat.tsx` | server | `label: string`, `value: ReactNode`, `sub?: ReactNode`, `size: "lead" \| "quiet"` | value-present only. `sub` omitted is the one honest absence it models |

The period control is the only interactive control on either screen. It writes
`?period=` and the server re-reads it, so **every number on both screens is
governed by one window**. `PeriodKey` is one of `last_30 · last_90 · ytd ·
last_12m`; anything else falls back to `last_90`.

---

## Screen 1 — `/` · Results

`export const dynamic = "force-dynamic"`. Awaits `getProperty()` + `getPeriods()`,
then five queries in parallel.

| Section (in DOM order) | Data it receives | States today |
|---|---|---|
| Page head — `h1`, property + period line, `PeriodPicker` | `property.name`, `periods.current.label`, `range` | loaded only |
| **Rank 1 — the verdict.** Two `Stat`s: bookings driven, what they're worth | `Headline.bookings`, `Headline.valueCents` | loaded only. `0` renders as `0`, not as an empty state |
| **Rank 2 — what it cost.** Three `Stat`s + a comparison sentence | `CostComparison` — `adSpendCents`, `autumnFeeCents`, `totalCostCents`, `otaCommissionCents`, `otaCommissionPct`, `autumnFeePct` | two — savings positive vs negative, branched in the sentence |
| **Rank 3 — would you have got these anyway.** A two-part proportional bar + two `Stat`s + note | `Incrementality` — `byName`, `newToYou` | one, with a `\|\| 1` guard so a zero segment still has width |
| **Rank 4 — against last year.** Sentence + `<Trend>` SVG + footnote | `Headline.lastYear*`, `periods.lastYear.label`, `MonthPoint[]` (24 months) | **three** — no last-year data (own sentence), last-year present, and `Trend` returns `null` on an empty series |
| **Rank 5 — anything you need to know.** `<ul>` of dated notes | `Insight[]` (limit 4) — `published_at`, `headline`, `body`, `action_needed_from_owner`, plus unused `kind` and `pinned` | two — action needed vs "Nothing needed from you." **No empty state**: zero insights renders an empty `<ul>` |
| Door to screen 2 — `Link` to `/how-it-happened?period=…` | `range` | one |

`Trend` is a hand-rolled inline `<svg>`, 720×132, one bar per month in
`--au-ink` at 0.82 opacity (0.12 for a zero month), month label every 6th bar.
No chart library.

---

## Screen 2 — `/how-it-happened` · How it happened

`force-dynamic`. Same two setup queries, then four in parallel. Totals on this
screen are derived in the component by summing `ChannelRow[]` — which is what
makes them reconcile with screen 1 rather than being queried separately.

| Section (in DOM order) | Data it receives | States today |
|---|---|---|
| Page head — back link, `h1`, property + period line, `PeriodPicker` | `property.name`, `periods.current.label`, `range` | loaded only |
| **Saw you → visited → booked.** Three `Stat`s + a sentence | summed from `ChannelRow[]`: `impressions`, `clicks`, `bookings`, `costCents` | loaded only |
| **Where you appeared.** `<table>` with `<caption>` and scoped row headers | `ChannelRow[]` — `display_name`, `impressions`, `clicks`, `bookings`, `costCents` (`eligible` and `valueCents` fetched, unused on screen) | **no empty state** — zero rows renders a header-only table |
| **Where guests come from.** Ranked `<ul>`, top 8, with a proportional bar per row | `FeederRow[]` — `market`, `bookings`, `valueCents`; bar width is a share of `feeders[0].bookings` | **no empty state** — zero rows renders an empty `<ul>`; `topFeeder` is guarded to avoid divide-by-zero |
| **The bookings themselves.** Horizontally scrollable `<table>`, the drill-down floor | `BookingRow[]` (limit 12) — `booked_at`, `check_in`, `nights`, `totalValueCents`, `feeder_market` (`device`, `campaignName` fetched, unused on screen) | **no empty state** — header-only table when there are none |
| **How full the inn was.** One sentence + footnote | `Occupancy` — `roomNights`, `capacityNights`, `rooms`, `occupancy`, `autumnRoomNights` | one. This is the only figure on either screen counted on the **stay** axis rather than the booking axis |
| **What happens next.** Closing copy + `Link` back to `/` | `range` | one |

---

## What the reskin has to add, because it does not exist yet

These are gaps, not choices. `PAPER_PROMPT.md` asks for all three as first-class
surfaces and none of them is currently designed.

1. **No loading state anywhere.** There is no `loading.tsx`, no `error.tsx`, and
   no `<Suspense>` in the tree. Both pages `await` every query before the first
   byte, so the browser holds a blank document until Neon answers — and Neon
   scales to zero after five idle minutes, so the first request of a session
   pays the wake cost. The prompt's skeleton-that-names-what-it-is-gathering has
   nowhere to mount today.
2. **No not-yet-reported state.** `getProperty()` returning `null` makes the page
   `return null` — a blank body inside the shell. Every list and table degrades
   to an empty container with its headers still showing. The prompt's
   `NOT REPORTED` treatment applies to at least six places, marked above.
3. **The insight note is not a state machine.** `Insight.kind`
   (`what_changed · what_we_did · heads_up · all_clear · resolved`) and
   `Insight.pinned` are queried and typed but never read by the UI — every note
   renders identically. The prompt's *all clear → heads up → resolved* lifecycle
   is already in the data; only the presentation is missing.
4. **The rolling-three-month line does not exist.** `Trend` draws 24 raw monthly
   bars. The prompt asks for a solid rolling line over faint raw marks, which is
   a change to `<Trend>` only — `getMonthlySeries()` already returns the 24
   points it needs.

## Known defect to resolve during the pass

**`AppHeader` and `<main>` are each rendered twice.** `layout.tsx` renders an
`AppHeader` (from `db/params.ts` constants) plus `<main id="results">`, and both
page components render their own `AppHeader` (from the DB row) plus
`<main className="au-shell">` inside it. Confirmed in the served HTML: two
`<header>` and two nested `<main>` elements on both routes.

The two are not interchangeable, so this is a decision the design pass should
make rather than a mechanical delete:

- **Keep the layout's**, and the shell paints before Neon wakes — which is the
  point of the loading state in gap 1 — but the skip link's `#results` target and
  the `au-shell` width container both move, and pages lose their DB-sourced
  property name.
- **Keep the pages'**, and the current markup and widths are untouched, but the
  shell can no longer render ahead of the database and `layout.tsx`'s
  `PROPERTY` import goes unused.

Left as-is for now, deliberately — it is a shell-architecture question and the
reskin owns the shell.

## Off limits

`src/lib/` · `db/` · the two route paths · the `?period=` contract · the
`db/params.ts` constants · the frozen seed. The deferred seed TODOs (band
tightness, which channel absorbs the June dip, checksum stability) stay deferred.
