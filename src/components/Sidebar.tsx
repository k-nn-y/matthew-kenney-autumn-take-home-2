import Link from "next/link";
import { Logo } from "@/components/Logo";
import { NavLinks } from "@/components/NavLinks";

/**
 * The rail. One surface in the warm ground, holding the three facts that never
 * change while the sheet does: whose inn this is, which room of the app you
 * are in, and the quiet exits. Below 1024px it folds into a top strip and the
 * utility rows reappear under the sheet (MobileUtilities).
 */

const UTIL_ROW =
  "au-util-row flex min-h-[44px] items-center px-[12px] text-[14.5px] leading-[44px] tracking-[-0.01em] no-underline";

export function Utilities({ askEmail }: { askEmail?: string }) {
  return (
    <div className="flex flex-col">
      {askEmail ? (
        <a
          href={`mailto:${askEmail}?subject=${encodeURIComponent("A number on my results")}`}
          className={`${UTIL_ROW} text-(--au-body)`}
        >
          Ask about a number
        </a>
      ) : (
        <span className={`${UTIL_ROW} text-(--au-muted-strong)`}>
          Questions? Reply to any monthly note from your team.
        </span>
      )}
      <Link href="/how-we-count" className={`${UTIL_ROW} text-(--au-muted-strong)`}>
        How we count
      </Link>
      <Link href="/your-agreement" className={`${UTIL_ROW} text-(--au-muted-strong)`}>
        Your agreement
      </Link>
      <div aria-hidden="true" className="my-[8px] h-px w-full shrink-0 bg-(--au-rule)" />
      <Link href="/signed-out" className={`${UTIL_ROW} text-(--au-muted-strong)`}>
        Sign out
      </Link>
    </div>
  );
}

export function Sidebar({
  propertyName,
  town,
  askEmail,
}: {
  propertyName: string;
  town: string;
  askEmail?: string;
}) {
  return (
    <>
      {/* Desktop rail */}
      <header className="hidden w-[200px] xl:w-[216px] shrink-0 self-start lg:sticky lg:top-0 lg:flex lg:h-dvh lg:flex-col bg-(--au-ground-warm) px-[16px] pt-[22px] pb-[24px]">
        <div className="flex items-center pl-[4px] text-(--au-ink)">
          <Logo />
        </div>
        <div className="flex flex-col px-[4px] pt-[28px]">
          <div className="text-[16px] leading-[24px] tracking-[-0.016em] text-(--au-ink)">
            {propertyName}
          </div>
          <div className="text-[14.5px] leading-[20px] tracking-[-0.01em] text-(--au-muted-strong)">
            {town}
          </div>
        </div>
        <NavLinks />
        <div className="mt-auto flex flex-col">
          <Utilities askEmail={askEmail} />
        </div>
      </header>

      {/* Top strip below 1024px */}
      <header className="flex flex-wrap items-center gap-x-[16px] gap-y-[8px] bg-(--au-ground-warm) px-[16px] pt-[14px] pb-[8px] lg:hidden">
        <div className="flex items-center text-(--au-ink)">
          <Logo />
        </div>
        <div className="text-[14.5px] leading-[20px] tracking-[-0.01em] text-(--au-muted-strong)">
          {propertyName}
        </div>
        {/* On a phone the two links take their own full row under the name,
            flush left with the logo; from 640px they sit at the right. */}
        <div className="w-full sm:w-auto sm:ml-auto">
          <NavLinks horizontal />
        </div>
      </header>
    </>
  );
}
