"use client";

import { useEffect, useRef, useState } from "react";

/* Counters mounting together must all run even though the first one marks
   the session; this remembers, per gate, the brief window of that first
   page load. A later visit in the same session falls outside it. */
const armedUntil = new Map<string, number>();

/**
 * A display number that counts up to its value the first time a screen is
 * seen in a session, fading in as it goes. Quick — 620ms out-quart — and
 * honest: the server renders the finished number, so with no JavaScript,
 * with reduced motion, or on any later visit this session, the number is
 * simply there. Width is reserved from the finished text, so nothing around
 * it moves while it counts.
 */
export function CountUp({
  value,
  text,
  gate,
}: {
  /** The finished number the count lands on. */
  value: number;
  /** The finished string, exactly as the server would print it. */
  text: string;
  /** sessionStorage key shared by every number on the screen. */
  gate: string;
}) {
  const [shown, setShown] = useState(text);
  const [running, setRunning] = useState(false);
  const raf = useRef(0);

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

    const grouped = text.includes(",");
    const prefix = text.startsWith("$") ? "$" : "";
    const dur = 620;
    const start = performance.now();
    setRunning(true);

    const frame = (now: number) => {
      const t = Math.min(1, (now - start) / dur);
      const eased = 1 - Math.pow(1 - t, 4); /* out-quart */
      const v = Math.round(value * eased);
      const body = grouped ? v.toLocaleString("en-US") : String(v);
      setShown(prefix + body);
      if (t < 1) {
        raf.current = requestAnimationFrame(frame);
      } else {
        setShown(text);
        setRunning(false);
      }
    };
    raf.current = requestAnimationFrame(frame);
    try {
      sessionStorage.setItem(gate, "1");
    } catch {}
    return () => cancelAnimationFrame(raf.current);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return (
    <span className="relative inline-block whitespace-nowrap">
      {/* The finished text holds the width; the counting layer sits on top. */}
      <span className={running ? "invisible" : undefined} aria-hidden={running || undefined}>
        {text}
      </span>
      {running ? (
        <>
          <span aria-hidden="true" className="au-countup absolute inset-0">
            {shown}
          </span>
          <span className="au-sr-only">{text}</span>
        </>
      ) : null}
    </span>
  );
}
