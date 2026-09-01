"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { Logo } from "./Logo";
import styles from "./AppHeader.module.css";

/**
 * Two screens, in the order the owner's questions rank (OWNER_PERSONA §3):
 * what it was worth first, how it happened second. There is no third tab and
 * no settings gear — nothing here is configurable, because a report the reader
 * has to assemble is a report he will not trust.
 */
const SCREENS = [
  { href: "/", label: "Results" },
  { href: "/how-it-happened", label: "How it happened" },
] as const;

/**
 * The quiet top bar both screens share: whose numbers these are, and which of
 * the two views is open. The current view is marked by ink strength and by
 * a rule that lands on the header's own hairline — never by colour, and
 * announced to assistive tech with aria-current.
 */
export function AppHeader({
  propertyName,
  town,
}: {
  propertyName: string;
  town: string;
}) {
  const pathname = usePathname();

  return (
    <header className={styles.header}>
      <div className={`au-shell ${styles.inner}`}>
        <div className={styles.identity}>
          <Link
            href="/"
            className={styles.logoLink}
            aria-label="Autumn — your marketing results"
          >
            <Logo width={100} height={15} className={styles.logo} />
          </Link>

          <span className={styles.divider} aria-hidden="true" />

          <p className={styles.property}>
            <span className={styles.propertyName}>{propertyName}</span>
            <span className={`au-label ${styles.propertyTown}`}>{town}</span>
          </p>
        </div>

        <nav aria-label="Your report" className={styles.nav}>
          {SCREENS.map((screen) => (
            <Link
              key={screen.href}
              href={screen.href}
              className={styles.tab}
              aria-current={pathname === screen.href ? "page" : undefined}
            >
              {screen.label}
            </Link>
          ))}
        </nav>
      </div>
    </header>
  );
}
