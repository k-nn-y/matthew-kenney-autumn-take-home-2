import Link from "next/link";
import { AppHeader } from "@/components/AppHeader";
import { PeriodPicker } from "@/components/PeriodPicker";
import { Stat } from "@/components/Stat";
import { dollars } from "@/lib/db";
import { normalizePeriod } from "@/lib/periods";
import {
  getChannelBreakdown, getFeederMarkets, getOccupancy, getPeriods,
  getProperty, getRecentBookings,
} from "@/lib/queries";
import styles from "./page.module.css";

export const dynamic = "force-dynamic";

const n = (v: number) => v.toLocaleString("en-US");
const day = (iso: string) =>
  new Date(iso).toLocaleDateString("en-US", { month: "short", day: "numeric", year: "2-digit" });

/**
 * Screen 2 explains screen 1's headline rather than opening a new subject —
 * that is what makes the two connected rather than adjacent. It carries the
 * credibility test: the individual bookings he can check line by line against
 * his own reservation system.
 */
export default async function HowItHappened({
  searchParams,
}: {
  searchParams: Promise<{ period?: string }>;
}) {
  const range = normalizePeriod((await searchParams).period);
  const [property, periods] = await Promise.all([getProperty(), getPeriods(range)]);
  if (!property) return null;

  const [channels, feeders, bookings, occ] = await Promise.all([
    getChannelBreakdown(periods.current),
    getFeederMarkets(periods.current),
    getRecentBookings(periods.current, 12),
    getOccupancy(periods.current),
  ]);

  const appeared = channels.reduce((t, c) => t + c.impressions, 0);
  const visits = channels.reduce((t, c) => t + c.clicks, 0);
  const booked = channels.reduce((t, c) => t + c.bookings, 0);
  const spend = channels.reduce((t, c) => t + c.costCents, 0);
  const topFeeder = feeders[0];

  return (
    <>
      <AppHeader propertyName={property.name} town={property.town} />
      <main className="au-shell">
        <div className={styles.head}>
          <div>
            <p className={styles.back}>
              <Link href={`/?period=${range}`}>← Back to your results</Link>
            </p>
            <h1 className={styles.title}>How those bookings happened</h1>
            <p className={styles.sub}>
              {property.name} · {periods.current.label.toLowerCase()}
            </p>
          </div>
          <PeriodPicker value={range} />
        </div>

        {/* The path. Stated with both raw numbers, never as a bare percentage —
            "412 visited, 11 booked" is checkable; "2.7%" is a claim. */}
        <section className={styles.card} aria-labelledby="h-path">
          <h2 id="h-path" className={styles.h2}>Saw you → visited → booked</h2>
          <div className={styles.pathGrid}>
            <Stat label="Times you appeared" value={<span className="au-num">{n(appeared)}</span>}
              sub="On Google search, maps and hotel listings" />
            <Stat label="Visits from Google" value={<span className="au-num">{n(visits)}</span>}
              sub="People who clicked through to your site" />
            <Stat label="Bookings we drove" value={<span className="au-num">{n(booked)}</span>}
              sub="Rooms actually reserved" />
          </div>
          <p className={styles.note}>
            {n(visits)} people came to your site from a Google ad and {n(booked)} of them
            booked a room. That cost <strong className="au-num">{dollars(spend)}</strong> in
            ad spend, which Autumn paid.
          </p>
        </section>

        {/* Where you appeared. The branded / non-branded split is the
            decision-relevant part; the total is not. */}
        <section className={styles.card} aria-labelledby="h-where">
          <h2 id="h-where" className={styles.h2}>Where you appeared</h2>
          <table className={styles.table}>
            <caption className="au-sr-only">
              Appearances, visits, bookings and cost for each kind of Google placement.
            </caption>
            <thead>
              <tr>
                <th scope="col">Guests who found you this way</th>
                <th scope="col" className={styles.numCol}>Appeared</th>
                <th scope="col" className={styles.numCol}>Visits</th>
                <th scope="col" className={styles.numCol}>Bookings</th>
                <th scope="col" className={styles.numCol}>Cost</th>
              </tr>
            </thead>
            <tbody>
              {channels.map((c) => (
                <tr key={c.category}>
                  <th scope="row" className={styles.rowHead}>{c.display_name}</th>
                  <td className={styles.numCol}>{n(c.impressions)}</td>
                  <td className={styles.numCol}>{n(c.clicks)}</td>
                  <td className={styles.numCol}>{n(c.bookings)}</td>
                  <td className={styles.numCol}>{dollars(c.costCents)}</td>
                </tr>
              ))}
            </tbody>
          </table>
          <p className={styles.note}>
            The first row is guests who already knew your name. The rest are guests who
            did not — those are the ones the advertising is doing new work for.
          </p>
        </section>

        {/* Rank 6 — guest fit is an operating question, not a marketing one. */}
        <section className={styles.card} aria-labelledby="h-from">
          <h2 id="h-from" className={styles.h2}>Where guests come from</h2>
          <ul role="list" className={styles.feeders}>
            {feeders.slice(0, 8).map((f) => {
              const share = topFeeder ? (f.bookings / topFeeder.bookings) * 100 : 0;
              return (
                <li key={f.market} className={styles.feeder}>
                  <span className={styles.feederName}>{f.market}</span>
                  <span className={styles.feederBar} aria-hidden="true">
                    <span style={{ width: `${Math.max(2, share)}%` }} />
                  </span>
                  <span className={`au-num ${styles.feederCount}`}>{f.bookings}</span>
                  <span className={`au-num ${styles.feederValue}`}>{dollars(f.valueCents)}</span>
                </li>
              );
            })}
          </ul>
          <p className={styles.note}>
            Drive-time markets, ranked by bookings. This is the list worth writing your
            next package for.
          </p>
        </section>

        {/* Rank 8 — the credibility surface. He will check these against his own
            book, and the research says that test decides whether he believes any
            of the rest of it. */}
        <section className={styles.card} aria-labelledby="h-list">
          <h2 id="h-list" className={styles.h2}>The bookings themselves</h2>
          <div className={styles.scroll}>
            <table className={styles.table}>
              <caption className="au-sr-only">
                Individual bookings Autumn drove, newest first, to check against your own
                reservation system.
              </caption>
              <thead>
                <tr>
                  <th scope="col">Booked</th>
                  <th scope="col">Arriving</th>
                  <th scope="col" className={styles.numCol}>Nights</th>
                  <th scope="col" className={styles.numCol}>Value</th>
                  <th scope="col">Guest came from</th>
                </tr>
              </thead>
              <tbody>
                {bookings.map((b) => (
                  <tr key={b.booking_id}>
                    <td className="au-num">{day(b.booked_at)}</td>
                    <td className="au-num">{day(b.check_in)}</td>
                    <td className={styles.numCol}>{b.nights}</td>
                    <td className={styles.numCol}>{dollars(b.totalValueCents)}</td>
                    <td>{b.feeder_market}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
          <p className={styles.note}>
            Every one of these should appear in your own booking system on the same date
            and for the same amount. If one does not, tell us and we will find out why.
          </p>
        </section>

        {/* Occupancy is the one number here on the stay axis, not the marketing
            axis — a March booking for October fills an October room. */}
        <section className={styles.card} aria-labelledby="h-occ">
          <h2 id="h-occ" className={styles.h2}>How full the inn was</h2>
          <p className={styles.lead}>
            You sold <strong className="au-num">{n(occ.roomNights)}</strong> room nights out
            of a possible <strong className="au-num">{n(occ.capacityNights)}</strong> —{" "}
            <strong className="au-num">{Math.round(occ.occupancy * 100)}%</strong> full across{" "}
            {occ.rooms} rooms. <strong className="au-num">{n(occ.autumnRoomNights)}</strong> of
            those nights came from guests we brought.
          </p>
          <p className={styles.footnote}>
            Counted by the night the guest stayed, not the day they booked — which is why
            this number moves differently from the bookings on your results page.
          </p>
        </section>

        <section className={styles.closing} aria-labelledby="h-next">
          <h2 id="h-next" className={styles.h2}>What happens next</h2>
          <p className={styles.lead}>
            Nothing here needs anything from you. We keep buying the ads, you keep the
            rooms ready, and the invoice arrives once a month for the bookings we drove.
            If a number on this page looks wrong, reply and a person will answer.
          </p>
          <p className={styles.more}>
            <Link href={`/?period=${range}`} className="au-btn au-btn-primary">
              Back to your results
            </Link>
          </p>
        </section>
      </main>
    </>
  );
}
