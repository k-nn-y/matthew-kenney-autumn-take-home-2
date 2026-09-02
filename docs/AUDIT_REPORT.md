# Audit report — Autumn owner dashboard, Stage D frames

Date: 2026-09-01. Scope: the two Paper boards that are the current spec, "Results · Screen 1 · Stage D" and "How it happened · Screen 2 · Stage D", plus the two state boards beside them. Method: direct inspection of the exported markup and rendered frames against a fixed checklist (contrast, targets, type hierarchy and line length, chart encoding, reconciliation, banned vocabulary), a dual-agent design critique, a brief re-alignment check with refutation, and a hardening pass. Screenshots for submission are in `docs/screenshots/`.

Nothing in this report is a deployment, v0, or animation decision. Implementation has not started.

## 1. Issues found

| # | Issue | Severity | Fixed on frames | Notes |
|---|-------|----------|-----------------|-------|
| 1 | Screen 2 band promised "every figure below counts those 24 and nothing else" while the page showed appearances, visits, room nights and spend | P1 | Yes | Sentence narrowed to the three sections that do reconcile |
| 2 | Screen 2 closing repeated screen 1's note at 36px, used a second ink surface and the same action twice | P1 | Yes | Reverted to the quiet occupancy card plus one "Ask about a number" button |
| 3 | Ledger lost its channel column; 12 rows by default vs 6 on mobile | P2 | Yes | HOW THEY FOUND YOU column from real data; 6 rows; door "All 24 bookings" |
| 4 | Handoff between screens: unnamed door under "24 bookings"; $13,895 missing from screen 2's band; kicker claimed a comparison it never showed | P2 | Yes | Named door; band carries $13,895; kicker in real dates with years |
| 5 | Account and utility links existed only in a screen 2 footer | P2 | Yes | Text-only cluster in the sidebar on both screens; no footer |
| 6 | Note did not say what changed or what Autumn did (two of the brief's six owner questions) | P1 | Yes | Two-column note: status pill, headline, body, byline; dated "What changed" timeline from the insights table |
| 7 | Zero on the Maps row sat under ALL CLEAR without comment | P2 | Yes | Sentence in the channels footnote |
| 8 | Sidebar pattern: icons-free descriptions under nav items, avatar row, white panel with rule | P2 | Yes | Mobbin-derived spec: canvas-colour rail, two plain labels, white hairline active pill, text utility cluster, no avatar |
| 9 | Redundant page header row above the sheet | P2 | Yes | Removed; the sheet head is the page header |
| 10 | Drop shadow on the sheets | P3 | Yes | Removed |
| 11 | Stat groups inconsistent: journey strip had numbers above labels | P2 | Yes | Label, value, caption everywhere |
| 12 | Season chart: single black line, dots on every month, no scale, cramped at 96px | P2 | Yes | Slate line and gradient, thin single-month line, labelled gridlines, dashed average, one marker on the latest point, 160px tall |
| 13 | Single-month line at 32% opacity below 3:1 non-text contrast | P2 | Yes | 60% |
| 14 | Split bar segment on the ink band at 32% below 3:1 | P2 | Yes | 45% |
| 15 | Touch targets: nav rows 36px, utility links 32px, period control 40px, text doors 20px, info icons 14px | P1 | Partly | Nav, links, control and doors now 44px; info icon hit areas are a build item |
| 16 | Labels at 10.5–11px; muted text at the faint end for readers in their 50s–60s | P2 | Yes | 12px floor; new token `--au-muted-strong` #5F5D57 (≈6.3:1) on both screens |
| 17 | Twenty-one distinct type sizes with neighbours 1.04× apart | P2 | No | Consolidate to one scale in CSS tokens at build time: 12 · 14 · 16 · 20 · 26 · 33 · 45 · 54 plus the 96 numeral; nothing below 12px |
| 18 | Body lines up to 150–170 characters (whole-book line, places line, chart small print, ledger footnote) | P2 | Yes | Capped at 680px (ledger footnote 760px) |
| 19 | Chart y labels carried no unit | P3 | Yes | Top label reads "18 bookings" |
| 20 | Chart values exist only as SVG geometry | P1 | No (build) | Needs a title, a description naming the latest value and average, and a visually hidden month table |
| 21 | Panel share bars and the band's split bar do not state what they encode | P2 | Partly | Adjacent counts expose values; aria-labels and a "bar shows share of the 24" phrase are build items |
| 22 | Cost per booking absent | P2 | Yes | "about $75 per booking" under Autumn's 13% |
| 23 | Journey numbers were raw with no comparison | P2 | Yes | Year-ago figures under all three; "8 in 100 of your site visits" from the traffic table |
| 24 | The 24 never placed inside the inn's whole book | P2 | Yes | 225 direct bookings, 24 through the ads, on both screens; data confirmed from the bookings table |
| 25 | Room count: occupancy card implies 12 rooms; persona document says 14 | P2 | No | Seed and frames agree on 12; the persona document should change. Not a frame defect |
| 26 | Deliverables (live URL, README with setup and seeding, screenshots including the reference dashboard) | P1 | Partly | Screenshots exported to `docs/screenshots/`; README and live URL belong to implementation |
| 27 | Frames imply surfaces beyond the two pages (All notes, All 24 bookings, All 11 places, Your agreement, How we count, Sign out) | P2 | No | Scope decision: ship as doors to the same data views or as honest "coming soon" pages; the brief warns against unrelated surfaces |
| 28 | Full-width sentences and a rigid two-line verdict would overflow on longer windows or larger counts | P2 | Yes | Widths capped; verdict rows may wrap; no door underline at zero |
| 29 | Banned vocabulary (ROAS, metasearch, parity, funnel, first-party data, ecosystem, leverage, seamless, data-driven) | — | Pass | Zero hits on both screens and both sidebars |
| 30 | Reconciliation to 24 / $13,895 across channels, markets, split, whole book, year-ago delta, cost math, note figures | — | Pass | All sums verified by hand |
| 31 | Design detector (AI-pattern scan) | — | Pass | Exit 0 on all exported markup; no gradient text, no palette tells, all colours token-bound except inert SVG fills |

Totals: 31 items; 22 fixed on the frames, 4 partly fixed with the remainder in the build, 3 not fixed (17, 25, 27), 3 passes with no action.

## 2. Severity summary

- P1: 6 found; 4 fixed, 2 carried to the build (chart accessibility, info-icon targets) or to deliverables (README, live URL).
- P2: 20 found; 15 fixed, 2 partly, 3 open by decision (type scale in CSS, room-count document, implied surfaces).
- P3: 2 found; both fixed.

## 3. Remaining limitations

- The frames are desktop only. Tablet and phone behaviour is written as a spec on the canvas board "Stage D · responsive and state spec" and in section 6 below, not drawn.
- The error state ("Couldn't open") exists only as an older frame in the previous shell; it needs the sidebar shell in the build. Loading states for both screens are now drawn in the Stage D shell.
- The dashed NOT REPORTED box cannot be drawn in Paper (text nodes take no border); the state board shows the sentence plain.
- Six info-icon cards have one written example (the counting rule); the other five need copy.
- The type scale is not yet a single scale on the frames; it should become one in CSS tokens rather than by editing 21 sizes on the canvas.
- Occupancy figures assume 12 rooms; the persona document says 14.

## 4. Accessibility risks

- Every text pair measures 4.7:1 or better against its actual background; the smallest text is 12px caps. The remaining risk is tables, tabs and doors drawn as divs: the build must use `table`, `th scope`, real anchors and buttons, a visible 2px focus ring, and `aria-current` on the active nav item.
- The season chart is geometry only. Without an SVG title, a description and a hidden data table, a screen reader gets nothing.
- Info icons are hover-only on the frames; they must open on tap and focus with a 44px hit area.
- Status is never colour alone (ALL CLEAR, HEADS UP are words), and no hue carries meaning, so colour-blind readers lose nothing.
- Muted text uses one token across both screens; keep it that way in CSS.

## 5. Responsive risks

- The chart is a fixed 1120px SVG with absolutely positioned annotations. Below 1280 it must scale, and its annotations must be positioned from data.
- The ledger uses fixed column widths (150/150/70/100/grow/220). At 390 it must drop to three columns with the rest behind a row tap.
- The verdict is two flex rows; at 390 it must wrap freely at 30/36.
- The sidebar has no drawn collapsed form; below 1024 it becomes a top strip with the two destinations as text links and the utility cluster under the sheet.
- The long-inn-name stress board shows a three-line wrap in the rail; clamp to two lines with the full name on hover.

## 6. State and edge-case coverage

| State | Designed | Where |
|-------|----------|-------|
| Normal, all clear | Yes | Both Stage D boards |
| Heads up (one thing to look at) | Yes | Stress board: pill, headline, timeline current row |
| First days of a window, nothing reported yet, zero bookings | Yes | State board: verdict template, lag sentence, $0 cost row, no door |
| Long inn name, long window, custom period label, long market names | Yes | Stress board |
| Zero-booking rows in tables | Yes | Maps row on screen 2 keeps its row with 0 and $0 |
| Loading skeleton | Yes | Two boards, "Results · Stage D · loading state" and "How it happened · Stage D · loading state": shell and sidebar painted, skeleton blocks in the final geometry, head reads OPENING YOUR LEDGER on Results and OPENING THE LEDGER, ONE BOOKING AT A TIME on How it happened, one sentence names what is being gathered |
| Couldn't open (error, retry) | Older frame only | Needs the sidebar shell |
| Too few days for visit counts (short windows) | Spec only | Replace the journey strip with one sentence |
| Not yet live (program not started) | Spec only | One sentence in place of the verdict |
| Phone and tablet | Spec only | Canvas spec board and section 5 |

## 7. Recommended checks after the Next.js implementation

1. `npm run test:reconcile` stays green; add an assertion that whole-book totals and the year-ago figures come from the same window as the 24.
2. Axe or equivalent on both routes: zero violations; verify `table`/`th scope`, `aria-current`, focus rings, and the chart's title, description and hidden table.
3. Keyboard-only pass: every door and the period control reachable in a sensible order; info cards open on Enter and Space and close on Escape.
4. Contrast recheck in the browser against the real CSS tokens, including `--au-muted-strong` on `--au-ground-alt`.
5. Viewport pass at 1440, 1280, 1024 and 390: no horizontal scroll, chart scales, ledger collapses, sidebar collapses, verdict wraps.
6. State pass with seeded data: force each of the ten states in section 6 and screenshot them.
7. Copy pass: banned-word grep on the rendered HTML; every sentence-caption ends with a period; the three doors use one grammar.
8. Performance: no layout shift on load (skeleton matches final geometry), fonts preloaded, the chart renders server-side.
9. `prefers-reduced-motion` honoured for whatever `docs/ANIMATION_SPEC.md` specifies.
10. README carries the live URL, setup and seeding steps, the "no sign-in" statement or test credentials, and the five screenshots in `docs/screenshots/`.

## 8. Screenshots

- `docs/screenshots/00-reference-current-dashboard-overview.png` and `00-reference-current-dashboard-website-traffic.png` — the current Autumn dashboard from the brief (extracted from the PDF).
- `docs/screenshots/01-results-screen-1.png` — Screen 1, Stage D.
- `docs/screenshots/02-how-it-happened-screen-2.png` — Screen 2, Stage D.
- `docs/screenshots/03-results-state-not-reported-yet.png` — zero-booking, not-yet-reported state.
- `docs/screenshots/04-results-stress-heads-up.png` — long-content stress with a heads-up note.

READY FOR MANUAL REVIEW

---

HARD STOP — MANUAL APPROVAL REQUIRED

Do not start Dev Engineering, v0, Next.js implementation, or animation until you:
1. Approve the primary workflow and Paper direction
2. Confirm scope cuts and core states
3. Finalize docs/ANIMATION_SPEC.md
4. Confirm the remaining time budget supports implementation
