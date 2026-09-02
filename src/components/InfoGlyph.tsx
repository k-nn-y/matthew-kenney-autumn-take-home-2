/**
 * One ⓘ per section head, opening a three-line card: what it answers, how we
 * count it, what it means for you. Native <details>/<summary>: works without
 * JavaScript, toggles with Enter and Space, and the layout script adds
 * Escape-to-close with focus returned to the glyph. The 17px glyph sits
 * centered in a 44px hit area; hovered, the mark fills to ink.
 */
export function InfoGlyph({
  label,
  answers,
  count,
  means,
  onInk = false,
}: {
  label: string;
  answers: React.ReactNode;
  count: React.ReactNode;
  means: React.ReactNode;
  onInk?: boolean;
}) {
  const KICKER =
    "text-[11px] leading-[16px] tracking-[0.14em] uppercase text-(--au-muted-strong)";
  return (
    <details className={onInk ? "au-info au-on-ink" : "au-info"}>
      <summary aria-label={label}>
        <svg
          viewBox="0 0 18 18"
          width="17"
          height="17"
          aria-hidden="true"
          focusable="false"
        >
          <circle
            cx="9"
            cy="9"
            r="7.6"
            fill="none"
            stroke="currentColor"
            strokeWidth="1.3"
          />
          <circle cx="9" cy="5.7" r="0.9" fill="currentColor" />
          <path
            d="M9 8.2v4.6"
            fill="none"
            stroke="currentColor"
            strokeWidth="1.4"
            strokeLinecap="round"
          />
        </svg>
      </summary>
      <div role="note" className="au-info-card">
        <p className={KICKER}>What it answers</p>
        <p className="au-info-line">{answers}</p>
        <hr className="au-info-rule" />
        <p className={KICKER}>How we count it</p>
        <p className="au-info-line">{count}</p>
        <hr className="au-info-rule" />
        <p className={KICKER}>What it means for you</p>
        <p className="au-info-line">{means}</p>
      </div>
    </details>
  );
}
