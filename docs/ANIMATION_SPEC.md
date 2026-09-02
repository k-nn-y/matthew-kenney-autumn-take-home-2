# Animation spec — Autumn owner dashboard (Stage D)

Draft for manual review (Prompt 8). Scope: the two screens, their loading, not-reported and heads-up states, and the info cards. Reader: an inn owner in their 50s or 60s, one to three minutes per visit. The page is a ledger, not an ad platform; motion exists to keep continuity and to show where something came from, never to perform.

Purposeful, calm, and information-supporting
Respect prefers-reduced-motion
No decorative animation without a user-comprehension purpose

Shell, first paint (sidebar, sheet frame, period control): page load, 0ms, none, the frame of the page is static so the owner knows where things will be before the numbers arrive
Skeleton to content: data arrives, 180ms, ease-out-quart (cubic-bezier(0.25, 1, 0.5, 1)), opacity crossfade so figures replace blocks in place without a flash; no shimmer on the skeleton while waiting
Season chart line, first view of the session only: sheet content visible, 600ms, ease-out-expo (cubic-bezier(0.16, 1, 0.3, 1)), the rolling line draws left to right via stroke-dashoffset so time reads in the right direction and the eye lands on the latest point; gradient area fades in over 200ms after the line completes; runs once per session, never on return visits or route changes
Season chart, latest-point marker and its label: after the line completes, 120ms, ease-out-quart, opacity 0 to 1 so "about 8 a month lately" arrives as the conclusion of the line, not before it
Period change (control "Showing"): selection made, 120ms, ease-out-quart, all figures dim to 60% opacity and the region is aria-busy while data loads; on arrival figures return to 100% in 150ms and the chart line re-draws in 400ms ease-out-quint (cubic-bezier(0.22, 1, 0.36, 1)) so the owner sees the shape change rather than snap
Route change (Your results to How it happened and back): link activated, 120ms out then 180ms in, ease-out-quart, opacity only; the sheet is one object that changes contents, so no slide or scale; the sidebar's active pill moves instantly, no sliding indicator
Info card (ⓘ) open: tap, click or keyboard focus plus Enter, 160ms, ease-out-quart, opacity 0 to 1 with translateY 4px to 0 anchored to the glyph so the card visibly belongs to the thing it explains; focus moves into the card
Info card close: Escape, outside tap, or the glyph again, 120ms, ease-in (cubic-bezier(0.4, 0, 1, 1)), opacity 1 to 0; exits are faster than entrances; focus returns to the glyph
Text doors ("See all 24, one by one", "All notes", "All four ways", "All 11 places", "All 24 bookings", "Your results" back link): hover or focus, 120ms, ease-out-quart, underline appears and the chevron moves 2px right via transform so a reader who relies on cues sees the door before clicking; focus ring is immediate
Sidebar nav row: hover, 120ms, ease-out-quart, background-color to a 4% ink tint; active state itself has no transition
Utility links (Ask about a number, How we count, Your agreement, Sign out): hover or focus, 120ms, ease-out-quart, text colour from muted to ink
Period control menu: open, 140ms, ease-out-quart, opacity with translateY 4px to 0; close 100ms ease-in
"Ask about a number" button: hover, 120ms, ease-out-quart, background from ink to ink-2; press has no scale; focus ring immediate
Chart hover or focus on a month: pointer over the plot or arrow keys across months, 0ms for the value tooltip and 80ms ease-out for the vertical guide and the month's dot on the thin line, so inspection feels immediate and the animation is never noticed
Ledger "All 24 bookings" reveal (inline expansion): activation, 180ms, ease-out-quart, the added rows fade in as one block with no height animation and no per-row stagger; the scroll position holds
Not-reported and heads-up states: page load, 0ms, none, the state is shown fully formed; nothing pulses, blinks or shimmers to announce it
Status pill (ALL CLEAR, HEADS UP) and all numerals: never animated; values appear complete, no count-up, no rolling digits

Patterns that should not be used:
- Count-up or rolling numerals; the numbers must appear as facts, not as a performance
- Skeleton shimmer or pulse while loading; the static skeleton plus the sentence naming what is being gathered is the loading state
- Bounce, elastic or spring overshoot easing anywhere
- Scale on hover or press for buttons, cards or rows
- A sliding indicator that travels between the two sidebar items
- Staggered reveals of list rows, table rows or stat columns
- Scroll-triggered reveals or parallax; the sheet is a document, not a landing page
- Animating height, width, top, left or margin; only opacity, transform and small colour transitions
- Replaying the chart draw on navigation, tab focus or period change beyond the 400ms re-draw
- Any feedback motion longer than 300ms; the only exception is the one-time 600ms chart draw
- Celebration effects (confetti, checkmark flourishes) for "all clear"
- Animated gradients, glows or blur transitions
- Autoplaying or looping motion of any kind

Fallback behavior:
- prefers-reduced-motion: reduce — every transition and animation runs at 0.01ms; the chart appears fully drawn with the marker and label present; skeleton to content is an instant swap; info cards and menus appear and disappear instantly; hover and focus states still change colour and underline, since colour is not motion
- No JavaScript — all content is server-rendered and complete; the chart is drawn complete; info cards use native details/summary; the period control submits as a form; no state depends on animation having run
- Slow network — the skeleton stays until data arrives with no timeout animation; after 8 seconds the loading sentence gains a second sentence, "Still gathering. Your numbers are safe; this page will fill in.", with no motion
- Low-end device or dropped frames — animations use transform and opacity only; if the chart draw cannot hold 60fps it is skipped for that session and the line appears complete

Implementation tokens (for Prompt 9):
- --au-ease-out-quart: cubic-bezier(0.25, 1, 0.5, 1)
- --au-ease-out-quint: cubic-bezier(0.22, 1, 0.36, 1)
- --au-ease-out-expo: cubic-bezier(0.16, 1, 0.3, 1)
- --au-ease-in: cubic-bezier(0.4, 0, 1, 1)
- --au-dur-fast: 120ms · --au-dur-base: 180ms · --au-dur-redraw: 400ms · --au-dur-draw-once: 600ms
- Chart draw runs once per browser session (sessionStorage flag), only when the sheet is in view
