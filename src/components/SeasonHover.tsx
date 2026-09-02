"use client";

import { useEffect, useLayoutEffect, useRef, useState } from "react";

/**
 * Inspecting the season chart: hover, touch or arrow across the months and
 * one month at a time answers "what happened here?" — its name, its bookings
 * and what they were worth, and the three-month average the solid line is
 * drawing. Per the animation spec the card appears at once (0ms) and only
 * the guide line and dots ease in (80ms). The layer sits over the
 * server-drawn SVG and shares its viewBox, so it lines up at any width; the
 * card is positioned in pixels and kept inside the chart's box, so nothing
 * is ever clipped. Without JavaScript the layer is inert and the chart is
 * simply the chart.
 */

export type HoverPoint = {
  x: number;
  y: number;
  rollY: number | null;
  month: string;
  count: string;
  roll: string;
};

type ViewBox = { x: number; y: number; w: number; h: number };

const GAP = 12;

export function SeasonHover({
  points,
  viewBox,
  top,
  baseline,
}: {
  points: HoverPoint[];
  viewBox: ViewBox;
  top: number;
  baseline: number;
}) {
  const root = useRef<HTMLDivElement>(null);
  const tip = useRef<HTMLDivElement>(null);
  const [active, setActive] = useState<number | null>(null);
  const [pos, setPos] = useState<{ left: number; top: number } | null>(null);
  const [veil, setVeil] = useState(false);

  const toIndex = (clientX: number) => {
    const el = root.current;
    if (!el) return null;
    const r = el.getBoundingClientRect();
    if (r.width === 0) return null;
    const unit = viewBox.x + ((clientX - r.left) / r.width) * viewBox.w;
    let best = 0;
    let d = Infinity;
    for (let i = 0; i < points.length; i++) {
      const dd = Math.abs(points[i].x - unit);
      if (dd < d) {
        d = dd;
        best = i;
      }
    }
    return best;
  };

  /* Place the card next to the month it describes: centred on the point,
     above it when there is room, below it when there is not, and never
     past either edge of the chart. Runs before paint so it never flickers. */
  useLayoutEffect(() => {
    const el = root.current;
    const t = tip.current;
    if (active === null || !el || !t) {
      setPos(null);
      return;
    }
    const r = el.getBoundingClientRect();
    const p = points[active];
    const px = ((p.x - viewBox.x) / viewBox.w) * r.width;
    const py = ((p.y - viewBox.y) / viewBox.h) * r.height;
    const w = t.offsetWidth;
    const h = t.offsetHeight;
    const left = Math.min(Math.max(px - w / 2, 0), Math.max(r.width - w, 0));
    const above = py - h - GAP;
    /* On a phone the chart is a short strip the card cannot sit inside, so
       it hangs just below the strip instead of covering the section head. */
    const fits = r.height >= h + GAP;
    const topPx = !fits
      ? r.height + 8
      : above >= 0
        ? above
        : Math.min(py + GAP, r.height - h);
    setPos({ left, top: topPx });
  }, [active, points, viewBox]);

  /* The rolling line draws once per browser session, only when the chart is
     in view, and never under reduced motion. Done here after hydration
     (not in an inline script) so the server HTML and the client agree. */
  useEffect(() => {
    const svg = root.current?.parentElement?.querySelector("svg#au-season");
    if (!svg) return;
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;
    try {
      if (sessionStorage.getItem("au-season-drawn")) return;
    } catch {
      /* storage unavailable: draw anyway */
    }
    const go = () => {
      svg.classList.add("au-draw");
      setVeil(true);
      try {
        sessionStorage.setItem("au-season-drawn", "1");
      } catch {
        /* ignore */
      }
    };
    const r = svg.getBoundingClientRect();
    if (r.top < window.innerHeight && r.bottom > 0) {
      go();
      return;
    }
    const io = new IntersectionObserver(
      (entries) => {
        if (entries.some((e) => e.isIntersecting)) {
          go();
          io.disconnect();
        }
      },
      { threshold: 0.3 },
    );
    io.observe(svg);
    return () => io.disconnect();
  }, []);

  /* The veil slides down out of the chart's box, so the box clips only
     while it is moving; afterwards nothing is hidden and the card can
     stand wherever it needs to. */
  useEffect(() => {
    const box = root.current?.parentElement;
    if (!box) return;
    box.classList.toggle("overflow-hidden", veil);
    return () => box.classList.remove("overflow-hidden");
  }, [veil]);

  /* While a month is under inspection the fixed annotations step back. */
  useEffect(() => {
    const svg = root.current?.parentElement?.querySelector("svg#au-season");
    if (!svg) return;
    svg.classList.toggle("au-active", active !== null);
    return () => svg.classList.remove("au-active");
  }, [active]);

  const onKey = (e: React.KeyboardEvent) => {
    const last = points.length - 1;
    let next: number | null | undefined;
    if (e.key === "ArrowRight") next = active === null ? last : Math.min(active + 1, last);
    else if (e.key === "ArrowLeft") next = active === null ? last : Math.max(active - 1, 0);
    else if (e.key === "Home") next = 0;
    else if (e.key === "End") next = last;
    else if (e.key === "Escape") next = null;
    if (next === undefined) return;
    e.preventDefault();
    setActive(next);
  };

  const p = active === null ? null : points[active];

  return (
    <div
      ref={root}
      className="au-chart-hit"
      tabIndex={0}
      role="group"
      aria-label="Month by month. Use the left and right arrow keys to move between months."
      onPointerMove={(e) => setActive(toIndex(e.clientX))}
      onPointerDown={(e) => setActive(toIndex(e.clientX))}
      onPointerLeave={() => setActive(null)}
      onKeyDown={onKey}
      onBlur={() => setActive(null)}
    >
      {veil && (
        <div
          className="au-chart-veil"
          aria-hidden="true"
          onAnimationEnd={() => setVeil(false)}
        />
      )}
      <svg
        viewBox={`${viewBox.x} ${viewBox.y} ${viewBox.w} ${viewBox.h}`}
        preserveAspectRatio="none"
        className={`au-chart-guide au-chart-cross${p ? " au-on" : ""}`}
        aria-hidden="true"
        focusable="false"
      >
        {p && (
          <>
            <line x1={p.x} y1={top} x2={p.x} y2={baseline} stroke="var(--au-slate-deep)" strokeOpacity="0.55" vectorEffect="non-scaling-stroke" />
            <circle cx={p.x} cy={p.y} r="3.5" fill="#FFFFFF" stroke="var(--au-slate-deep)" strokeWidth="1.5" />
            {p.rollY !== null && (
              <circle cx={p.x} cy={p.rollY} r="4.5" fill="var(--au-slate-deep)" stroke="#FFFFFF" strokeWidth="2" />
            )}
          </>
        )}
      </svg>

      {p && (
        <div
          ref={tip}
          className="au-chart-tip"
          role="status"
          style={pos ? { left: pos.left, top: pos.top } : { left: 0, top: 0, visibility: "hidden" }}
        >
          <span className="au-chart-tip-month">{p.month}</span>
          <span className="au-chart-tip-count">{p.count}</span>
          <span className="au-chart-tip-roll">{p.roll}</span>
        </div>
      )}
    </div>
  );
}
