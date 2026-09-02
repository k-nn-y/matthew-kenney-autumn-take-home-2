"use client";

import { useEffect, useRef } from "react";

/* Bars mounting together must all run even though the first one marks the
   session; this remembers, per gate, the brief window of that first page
   load. A later visit in the same session falls outside it. */
const armedUntil = new Map<string, number>();

/**
 * A wrapper that grows its contents rightward — scaleX from nothing — the
 * first time a screen is seen in a session. The server renders the finished
 * bar, so with no JavaScript, with reduced motion, or on any later visit
 * this session, the bar is simply there at full length.
 */
export function Grow({
  gate,
  delay = 0,
  className,
  children,
}: {
  /** sessionStorage key shared by every bar on the screen. */
  gate: string;
  /** Stagger, in ms — rows lower on the sheet start a touch later. */
  delay?: number;
  className?: string;
  children: React.ReactNode;
}) {
  const ref = useRef<HTMLSpanElement>(null);

  useEffect(() => {
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;
    let seen = null;
    try {
      seen = sessionStorage.getItem(gate);
    } catch {
      return;
    }
    const now0 = performance.now();
    if (seen && (armedUntil.get(gate) ?? 0) < now0) return;
    if (!seen) armedUntil.set(gate, now0 + 1500);
    const el = ref.current;
    if (el) {
      el.style.animationDelay = `${delay}ms`;
      el.classList.add("au-grow");
    }
    try {
      sessionStorage.setItem(gate, "1");
    } catch {}
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return (
    <span ref={ref} className={className}>
      {children}
    </span>
  );
}
