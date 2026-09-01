import type { Metadata } from "next";
import { Geist, Inter } from "next/font/google";
import { PROPERTY } from "../../db/params";
import { AppHeader } from "@/components/AppHeader";
import "./globals.css";
import styles from "./layout.module.css";

/**
 * Two families, both Autumn's own: Inter for everything readable, Geist 400
 * for the letterspaced label tier. Inter is loaded variable and carries its
 * optical-size axis, because globals.css sets `font-variation-settings:
 * "opsz" 32` on the display tiers; next/font only honours `axes` when the
 * weight is left variable (see get-font-axes.js), so the single weight this
 * design uses — 500 — is applied in CSS on `body` rather than at load.
 */
const inter = Inter({
  variable: "--font-inter",
  subsets: ["latin"],
  axes: ["opsz"],
  display: "swap",
  preload: true,
});

const geist = Geist({
  variable: "--font-geist",
  subsets: ["latin"],
  weight: "400",
  display: "swap",
  preload: true,
});

export const metadata: Metadata = {
  title: "Autumn — your marketing results",
  description:
    "The bookings we drove for your inn, what they were worth, and what they cost you next to the commission you would have paid — in numbers you can check against your own book.",
  /* One property's private numbers. Nothing here belongs in a search index. */
  robots: { index: false, follow: false },
};

/* Next 16's generated `LayoutProps<"/">` is written into .next/types, which
   means it only exists after a build — and .next is not committed. Typing the
   one prop this layout takes keeps `tsc --noEmit` honest on a fresh clone. */
export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    /* data-scroll-behavior tells Next to suspend the smooth scrolling that
       globals.css sets during route transitions, so moving between the two
       screens lands at the top instantly instead of animating there. */
    <html
      lang="en"
      data-scroll-behavior="smooth"
      className={`${inter.variable} ${geist.variable}`}
    >
      <body>
        <a href="#results" className={styles.skip}>
          Skip to the numbers
        </a>

        <div className={styles.app}>
          {/* The property name comes from the same constants that seeded its
              row, so the shell can paint before Neon has woken up. Nothing
              above the fold should wait on a database that scales to zero. */}
          <AppHeader propertyName={PROPERTY.name} town={PROPERTY.town} />

          <main id="results" className={styles.main}>
            {children}
          </main>
        </div>
      </body>
    </html>
  );
}
