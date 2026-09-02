import type { MonthPoint } from "@/lib/types";
import { monthSpoken, monthTag } from "@/app/dates";
import { dollars } from "@/lib/db";
import { asWord } from "@/lib/words";
import { SeasonHover, type HoverPoint } from "@/components/SeasonHover";

/**
 * The shape of the season: 24 months of bookings on the marketing axis,
 * drawn on the server as one SVG. Geometry per the Stage D frame:
 * viewBox 0 0 1120 160 extended 20px above and 24px below for the
 * annotations, x from 6 to 1114, y = 12 + (max - bookings) * (136 / max),
 * baseline 148. The thin line is each month alone; the solid line is the
 * three-month average; the dashed line is the two-year average. The rolling
 * line draws once per session (script below); with no JavaScript, or with
 * reduced motion, the chart is simply complete.
 */

const X0 = 6;
const X1 = 1114;
const Y_TOP = 12;
const Y_BASE = 148;

type Pt = { x: number; y: number };

function fmt(n: number): string {
  return String(Math.round(n * 10) / 10);
}

export function SeasonChart({
  series,
  programStart,
}: {
  series: MonthPoint[];
  programStart: string | null;
}) {
  const n = series.length;
  if (n < 2) return null;

  const max = Math.max(1, ...series.map((p) => p.bookings));
  const step = (X1 - X0) / (n - 1);
  const xAt = (i: number) => X0 + i * step;
  const yAt = (v: number) => Y_TOP + (max - v) * ((Y_BASE - Y_TOP) / max);

  const pts: Pt[] = series.map((p, i) => ({ x: xAt(i), y: yAt(p.bookings) }));

  /* Three-month rolling average, from the third month on. */
  const roll: Pt[] = [];
  for (let i = 2; i < n; i++) {
    const v =
      (series[i].bookings + series[i - 1].bookings + series[i - 2].bookings) / 3;
    roll.push({ x: xAt(i), y: yAt(v) });
  }

  const avg = series.reduce((s, p) => s + p.bookings, 0) / n;
  const avgY = yAt(avg);

  const line = (ps: Pt[]) =>
    ps.map((p, i) => `${i ? "L" : "M"}${fmt(p.x)} ${fmt(p.y)}`).join(" ");

  const fill =
    line(roll) +
    ` L${fmt(roll[roll.length - 1].x)} ${Y_BASE} L${fmt(roll[0].x)} ${Y_BASE} Z`;

  /* Peaks of the single-month line — up to the two most recent months that
     hit the maximum. */
  const peakIdx = series
    .map((p, i) => (p.bookings === max ? i : -1))
    .filter((i) => i >= 0)
    .slice(-2);
  const peakLabel =
    `BUSIEST · ${peakIdx.map((i) => monthTag(`${series[i].month}-01`)).join(" AND ")} · ${max}` +
    (peakIdx.length > 1 ? " EACH" : "");
  const peakLabelX = Math.min(
    Math.max(X0, xAt(peakIdx[0]) - 28),
    X1 - peakLabel.length * 7.4,
  );

  /* The latest three months, said plainly. */
  const lately = Math.round(
    (series[n - 1].bookings + series[n - 2].bookings + series[n - 3].bookings) / 3,
  );
  const last = roll[roll.length - 1];

  /* Where the ads began, when that month is on the sheet. */
  const startTag = programStart ? programStart.slice(0, 7) : null;
  const startIdx = startTag ? series.findIndex((p) => p.month === startTag) : -1;

  /* Gridlines at the max and its thirds. */
  const midV = Math.round((max * 2) / 3);
  const lowV = Math.round(max / 3);

  /* Month captions under the chart: every sixth month. */
  const caps = [0, 6, 12, 18].filter((i) => i < n);

  const label = {
    fontFamily: "var(--au-font-label)",
    fontSize: 12,
    letterSpacing: "0.1em",
    fill: "var(--au-muted-strong)",
  } as const;

  /* One month at a time, for the pointer and the arrow keys. Worded here on
     the server so the client layer carries only positions and sentences. */
  const hover: HoverPoint[] = series.map((p, i) => {
    const rollV =
      i >= 2
        ? Math.round((series[i].bookings + series[i - 1].bookings + series[i - 2].bookings) / 3)
        : null;
    return {
      x: pts[i].x,
      y: pts[i].y,
      rollY: i >= 2 ? roll[i - 2].y : null,
      month: monthSpoken(`${p.month}-01`),
      count: `${p.bookings} ${p.bookings === 1 ? "booking" : "bookings"} · ${dollars(p.valueCents)}`,
      roll:
        rollV !== null
          ? `About ${rollV} a month, three-month average`
          : startIdx >= 0 && i < startIdx
            ? "Before your ads began"
            : "First months on the sheet",
    };
  });

  return (
    <div className="relative w-full">
      <div className="relative w-full">
      {/* preserveAspectRatio "none" lets the phone stylesheet give the chart
          real height (224px) while the desktop box keeps the frame's ratio;
          strokes are non-scaling so a stretched box never fattens a line. */}
      <svg
        id="au-season"
        viewBox="-2 -20 1124 186"
        preserveAspectRatio="none"
        className="block h-auto w-full"
        role="img"
        aria-labelledby="au-season-title au-season-desc"
      >
        <title id="au-season-title">
          Bookings through Autumn&apos;s ads, month by month, past two years
        </title>
        <desc id="au-season-desc">
          {`Monthly bookings for the last ${n} months, busiest ${max} in a month, averaging about ${Math.round(avg)} a month, about ${lately} a month lately. The table after this chart lists every month.`}
        </desc>
        <defs>
          <linearGradient id="auSeasonFade" x1="0" y1="0" x2="0" y2="1">
            <stop offset="0" stopColor="#4D5B6E" stopOpacity="0.16" />
            <stop offset="1" stopColor="#4D5B6E" stopOpacity="0" />
          </linearGradient>
        </defs>

        <path className="au-chart-grid" d={`M0 ${Y_TOP} H1120`} fill="none" stroke="#1C1B191A" strokeDasharray="2 4" vectorEffect="non-scaling-stroke" />
        <path className="au-chart-grid" d={`M0 ${fmt(yAt(midV))} H1120`} fill="none" stroke="#1C1B191A" strokeDasharray="2 4" vectorEffect="non-scaling-stroke" />
        <path className="au-chart-grid" d={`M0 ${fmt(yAt(lowV))} H1120`} fill="none" stroke="#1C1B191A" strokeDasharray="2 4" vectorEffect="non-scaling-stroke" />
        <path d={`M0 ${Y_BASE} H1120`} fill="none" stroke="#1C1B1929" vectorEffect="non-scaling-stroke" />

        <path className="au-chart-fill" d={fill} fill="url(#auSeasonFade)" />
        <path className="au-chart-avg" d={`M0 ${fmt(avgY)} H1120`} fill="none" stroke="#4D5B6E8C" strokeDasharray="6 5" vectorEffect="non-scaling-stroke" />
        <path d={line(pts)} fill="none" stroke="#4D5B6E99" vectorEffect="non-scaling-stroke" />
        <path
          className="au-chart-roll"
          d={line(roll)}
          fill="none"
          stroke="#4D5B6E"
          strokeWidth="2"
          pathLength={1}
          vectorEffect="non-scaling-stroke"
        />

        {startIdx >= 0 && (
          <g className="au-chart-ann max-sm:hidden">
            <line
              x1={fmt(xAt(startIdx))}
              y1={Y_TOP}
              x2={fmt(xAt(startIdx))}
              y2={Y_BASE}
              stroke="var(--au-rule-strong)"
              vectorEffect="non-scaling-stroke"
            />
            <text x={fmt(xAt(startIdx) + 8)} y="161" {...label}>
              {`YOUR ADS BEGAN · ${monthTag(`${startTag}-01`)}`}
            </text>
          </g>
        )}

        <g className="au-chart-late max-sm:hidden">
          {peakIdx.map((i) => (
            <circle
              key={i}
              cx={fmt(xAt(i))}
              cy={fmt(yAt(max))}
              r="3.5"
              fill="#FFFFFF"
              stroke="#4D5B6E"
              strokeWidth="1.5"
            />
          ))}
          <circle
            cx={fmt(last.x)}
            cy={fmt(last.y)}
            r="4.5"
            fill="#4D5B6E"
            stroke="#FFFFFF"
            strokeWidth="2"
          />
          <text className="au-chart-ann" x={fmt(peakLabelX)} y="-6" {...label}>
            {peakLabel}
          </text>
          <text
            className="au-chart-ann"
            x={fmt(Math.min(last.x - 128, X1 - 130))}
            y={fmt(Math.max(last.y - 31, -2) + 12)}
            fontFamily="var(--au-font)"
            fontSize="12.5"
            fontWeight="500"
            letterSpacing="-0.005em"
            fill="var(--au-slate-deep)"
          >
            {`about ${lately} a month lately`}
          </text>
        </g>

        <g className="au-chart-ann max-sm:hidden">
          <text x="0" y={Y_TOP + 14} {...label}>{`${max} bookings`}</text>
          <text x="0" y={fmt(yAt(midV) + 13.5)} {...label}>{midV}</text>
          <text x="0" y={fmt(yAt(lowV) + 13.5)} {...label}>{lowV}</text>
          <text x="40" y={fmt(avgY - 3.5)} fill="var(--au-slate-deep)" fontFamily="var(--au-font-label)" fontSize="12" letterSpacing="0.1em">
            {`YOUR AVERAGE · ${Math.round(avg)} A MONTH`}
          </text>
        </g>
      </svg>
      <SeasonHover
        points={hover}
        viewBox={{ x: -2, y: -20, w: 1124, h: 186 }}
        top={Y_TOP}
        baseline={Y_BASE}
      />
      </div>

      {/* The one-time draw lives in SeasonHover, after hydration, so the
          server HTML and the client agree; still and complete under reduced
          motion or with no JavaScript at all. */}

      {/* The same numbers as rows, for anyone the picture doesn't serve. */}
      <table className="au-sr-only">
        <caption>Bookings through Autumn&apos;s ads by month</caption>
        <thead>
          <tr>
            <th scope="col">Month</th>
            <th scope="col">Bookings</th>
          </tr>
        </thead>
        <tbody>
          {series.map((p) => (
            <tr key={p.month}>
              <th scope="row">{monthTag(`${p.month}-01`)}</th>
              <td>{asWord(p.bookings)}</td>
            </tr>
          ))}
        </tbody>
      </table>

      <div className="flex w-full pt-[4px]" aria-hidden="true">
        {caps.map((i, k) => (
          <div
            key={i}
            className={`${k < caps.length - 1 ? "w-1/4 shrink-0" : ""} inline-block pl-[2px] sm:pl-[6px]`}
          >
            <span className="font-label inline-block text-[12px] leading-[16px] tracking-[0.06em] text-(--au-muted-strong)">
              {monthTag(`${series[i].month}-01`)}
            </span>
          </div>
        ))}
      </div>

      {/* Below 640px the chart is the line alone, so what the annotations said
          on the sheet is read out here as three quiet rows. */}
      <dl className="flex flex-col mt-[12px] border-t border-solid border-t-(--au-rule) sm:hidden">
        {[
          [
            "Busiest",
            `${peakIdx.map((i) => monthSpoken(`${series[i].month}-01`)).join(" and ")}, ${max} ${max === 1 ? "booking" : "bookings"}${peakIdx.length > 1 ? " each" : ""}`,
          ],
          ...(startIdx >= 0 ? [["Your ads began", monthSpoken(`${startTag}-01`)]] : []),
          ["Your average", `${Math.round(avg)} a month`],
          ["Lately", `about ${lately} a month`],
        ].map(([k, v]) => (
          <div
            key={k}
            className="flex items-baseline justify-between gap-[16px] py-[8px] border-b border-solid border-b-(--au-rule)"
          >
            <dt className="shrink-0 text-[12.5px] leading-[17px] tracking-[-0.006em] text-(--au-muted-strong)">
              {k}
            </dt>
            <dd className="text-right text-[13.5px] leading-[17px] tracking-[-0.008em] text-(--au-body) tabular-nums">
              {v}
            </dd>
          </div>
        ))}
      </dl>
    </div>
  );
}
