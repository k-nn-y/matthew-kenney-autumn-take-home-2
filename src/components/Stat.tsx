import type { ReactNode } from "react";
import styles from "./Stat.module.css";

/**
 * The shared figure block: what it is, the number, and one plain sentence
 * saying what the number means.
 *
 * Deliberately absent: sparklines, arrows, and coloured deltas. A red −18%
 * with no sentence beside it is the dashboard version of "an error occurred"
 * (DASHBOARD_REFERENCES §3), and this palette has no red to say it with.
 * Direction is carried by the words in `sub`, where a comparison can be
 * ranged and named — "in line with last March" — instead of graded. Wrap the
 * load-bearing words of that line in <strong> and they take ink strength
 * without taking weight.
 *
 * Money arrives already formatted by dollars(); this component never does
 * arithmetic, it only sets it.
 */
export function Stat({
  label,
  value,
  sub,
  size = "lead",
  className,
}: {
  /** Label tier — set in caps by globals.css, so pass it in sentence case. */
  label: string;
  /** Formatted at the edge, never a raw cents integer. */
  value: ReactNode;
  /** One plain-English line. Optional, because "no note" is an honest state. */
  sub?: ReactNode;
  /** "lead" for the numbers he came for, "quiet" for their supporting cast. */
  size?: "lead" | "quiet";
  className?: string;
}) {
  return (
    <div className={className ? `${styles.stat} ${className}` : styles.stat}>
      <p className={`au-label ${styles.label}`}>{label}</p>
      <p
        className={`${size === "lead" ? "au-figure" : "au-sub"} au-num ${styles.value}`}
      >
        {value}
      </p>
      {sub ? <p className={`au-caption ${styles.sub}`}>{sub}</p> : null}
    </div>
  );
}
