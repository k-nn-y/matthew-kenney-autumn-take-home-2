import Link from "next/link";

/**
 * A door: the sheet's only way of offering more. Always an anchor, at least
 * 44px tall, underlined on hover, opening the same data in place or on the
 * other screen — never a new surface.
 */
export function Door({
  href,
  children,
  className = "",
}: {
  href: string;
  children: React.ReactNode;
  className?: string;
}) {
  return (
    <Link
      href={href}
      scroll={false}
      className={`au-door text-caption tracking-[-0.01em] ${className}`}
    >
      <span>{children}</span>
      <svg
        viewBox="0 0 16 16"
        width="13"
        height="13"
        aria-hidden="true"
        focusable="false"
        className="au-door-chev"
      >
        <path
          d="M6 3.5 10.5 8 6 12.5"
          fill="none"
          stroke="currentColor"
          strokeWidth="1.6"
          strokeLinecap="round"
          strokeLinejoin="round"
        />
      </svg>
    </Link>
  );
}
