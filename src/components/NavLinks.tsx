"use client";

import Link from "next/link";
import { usePathname, useSearchParams } from "next/navigation";
import { Suspense } from "react";

/**
 * The two rooms of the app. Anchors, not buttons: a place you go, not a thing
 * you do. The chosen period rides along in ?period= so the two screens are
 * always talking about the same dates.
 */

const ROOMS = [
  { href: "/", label: "Your results" },
  { href: "/how-it-happened", label: "How it happened" },
] as const;

function Rooms({
  horizontal,
  withPeriod,
}: {
  horizontal?: boolean;
  withPeriod?: boolean;
}) {
  const pathname = usePathname();
  return (
    <RoomsInner
      horizontal={horizontal}
      pathname={pathname}
      suffix={withPeriod ? undefined : ""}
    />
  );
}

function WithSearch(props: { horizontal?: boolean }) {
  const pathname = usePathname();
  const search = useSearchParams();
  const period = search.get("period");
  const suffix = period ? `?period=${encodeURIComponent(period)}` : "";
  return <RoomsInner horizontal={props.horizontal} pathname={pathname} suffix={suffix} />;
}

function RoomsInner({
  horizontal,
  pathname,
  suffix = "",
}: {
  horizontal?: boolean;
  pathname: string;
  suffix?: string;
}) {
  return (
    <nav
      aria-label="Screens"
      className={
        horizontal
          ? "flex items-center gap-[4px]"
          : "flex flex-col pt-[32px] gap-[4px]"
      }
    >
      {ROOMS.map((room) => {
        const active = pathname === room.href;
        return (
          <Link
            key={room.href}
            href={`${room.href}${suffix}`}
            aria-current={active ? "page" : undefined}
            className={`au-nav-row flex h-[44px] shrink-0 items-center rounded-[6px] px-[12px] text-[16px] leading-[24px] tracking-[-0.016em] no-underline ${
              active
                ? "bg-(--au-ground) border border-solid border-(--au-rule) text-(--au-ink)"
                : "text-(--au-body)"
            }`}
          >
            {room.label}
          </Link>
        );
      })}
    </nav>
  );
}

export function NavLinks({ horizontal }: { horizontal?: boolean }) {
  /* useSearchParams needs a boundary so the shell can still prerender; the
     fallback is the same nav without the ?period suffix. */
  return (
    <Suspense fallback={<Rooms horizontal={horizontal} />}>
      <WithSearch horizontal={horizontal} />
    </Suspense>
  );
}
