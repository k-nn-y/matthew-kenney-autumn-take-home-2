"use client";

import Link from "next/link";
import { usePathname, useSearchParams } from "next/navigation";
import { Suspense, useEffect, useRef, useState } from "react";
import { Logo } from "@/components/Logo";

/**
 * Below 1024px the rail folds into one button. Tapping it opens the whole
 * rail as a sheet over the page: whose inn this is, the two rooms, the quiet
 * exits, and "Ask about a number" as the one full-width action at the foot.
 * A native <dialog> does the modal work (focus trap, Escape, backdrop); the
 * sheet fades in over 140ms and out over 100ms per the animation spec, and
 * closes itself when a link takes you somewhere.
 */

const ROOMS = [
  { href: "/", label: "Your results" },
  { href: "/how-it-happened", label: "How it happened" },
] as const;

const ROW =
  "flex min-h-[56px] items-center rounded-[6px] px-[14px] no-underline text-[22px] leading-[28px] tracking-[-0.018em]";

function Rows({
  onPick,
  suffix,
}: {
  onPick: () => void;
  suffix: string;
}) {
  const pathname = usePathname();
  return (
    <nav aria-label="Screens" className="flex flex-col gap-[4px] pt-[16px]">
      {ROOMS.map((room) => {
        const active = pathname === room.href;
        return (
          <Link
            key={room.href}
            href={`${room.href}${suffix}`}
            aria-current={active ? "page" : undefined}
            onClick={onPick}
            className={`${ROW} ${
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

function RowsWithPeriod({ onPick }: { onPick: () => void }) {
  const search = useSearchParams();
  const period = search.get("period");
  return (
    <Rows
      onPick={onPick}
      suffix={period ? `?period=${encodeURIComponent(period)}` : ""}
    />
  );
}

export function MobileMenu({
  propertyName,
  town,
  askEmail,
}: {
  propertyName: string;
  town: string;
  askEmail?: string;
}) {
  const dialog = useRef<HTMLDialogElement>(null);
  const opener = useRef<HTMLButtonElement>(null);
  const [open, setOpen] = useState(false);
  const pathname = usePathname();

  const show = () => {
    const d = dialog.current;
    if (!d || d.open) return;
    d.showModal();
    setOpen(true);
  };

  const hide = () => {
    const d = dialog.current;
    if (!d || !d.open) return;
    d.classList.add("au-menu-out");
    const done = () => {
      d.classList.remove("au-menu-out");
      d.close();
    };
    const reduced = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    if (reduced) done();
    else window.setTimeout(done, 100);
  };

  /* Escape and backdrop clicks reach us as the dialog's close event. */
  useEffect(() => {
    const d = dialog.current;
    if (!d) return;
    const onClose = () => {
      setOpen(false);
      opener.current?.focus();
    };
    const onCancel = (e: Event) => {
      e.preventDefault();
      hide();
    };
    d.addEventListener("close", onClose);
    d.addEventListener("cancel", onCancel);
    return () => {
      d.removeEventListener("close", onClose);
      d.removeEventListener("cancel", onCancel);
    };
  }, []);

  /* A route change means a link was taken: put the sheet away. */
  useEffect(() => {
    if (dialog.current?.open) hide();
  }, [pathname]);

  return (
    <>
      <button
        ref={opener}
        type="button"
        className="au-menu-btn"
        aria-label={open ? "Close menu" : "Menu"}
        aria-expanded={open}
        aria-controls="au-menu"
        onClick={show}
      >
        <svg viewBox="0 0 20 20" width="22" height="22" aria-hidden="true" focusable="false">
          <path
            d="M4 7.5h12M4 12.5h12"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
            strokeLinecap="round"
          />
        </svg>
      </button>

      <dialog
        id="au-menu"
        ref={dialog}
        className="au-menu"
        aria-label="Menu"
        onClick={(e) => {
          if (e.target === dialog.current) hide();
        }}
      >
        <div className="flex h-full flex-col px-[20px] pt-[14px] pb-[20px]">
          <div className="flex items-center justify-between">
            <div className="flex items-center text-(--au-ink)">
              <Logo />
            </div>
            <button
              type="button"
              className="au-menu-btn"
              aria-label="Close menu"
              onClick={hide}
            >
              <svg viewBox="0 0 20 20" width="22" height="22" aria-hidden="true" focusable="false">
                <path
                  d="M5.5 5.5l9 9M14.5 5.5l-9 9"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2"
                  strokeLinecap="round"
                />
              </svg>
            </button>
          </div>

          <div className="flex flex-col pt-[18px] pb-[14px] border-b border-solid border-b-(--au-rule)">
            <span className="text-[16px] leading-[24px] tracking-[-0.016em] text-(--au-ink)">
              {propertyName}
            </span>
            <span className="text-[14.5px] leading-[20px] tracking-[-0.01em] text-(--au-muted-strong)">
              {town}
            </span>
          </div>

          <Suspense fallback={<Rows onPick={hide} suffix="" />}>
            <RowsWithPeriod onPick={hide} />
          </Suspense>

          <p className="pt-[28px] pb-[8px] px-[14px] text-[12px] leading-[16px] tracking-[0.18em] font-label uppercase text-(--au-muted-strong)">
            More
          </p>
          <nav aria-label="Account" className="flex flex-col gap-[4px]">
            <Link href="/how-we-count" onClick={hide} className={`${ROW} text-(--au-body)`}>
              How we count
            </Link>
            <Link href="/your-agreement" onClick={hide} className={`${ROW} text-(--au-body)`}>
              Your agreement
            </Link>
            <Link href="/signed-out" onClick={hide} className={`${ROW} text-(--au-body)`}>
              Sign out
            </Link>
          </nav>

          <div className="mt-auto pt-[20px]">
            {askEmail ? (
              <a
                href={`mailto:${askEmail}?subject=${encodeURIComponent("A number on my results")}`}
                className="au-ask flex min-h-[52px] w-full items-center justify-center gap-[10px] rounded-(--au-r-btn) bg-(--au-ink) px-[18px] text-[16px] leading-[24px] tracking-[-0.012em] text-(--au-on-ink)"
              >
                Ask about a number
                <svg viewBox="0 0 16 16" width="14" height="14" aria-hidden="true" focusable="false">
                  <path
                    d="M3 8h10M9 4l4 4-4 4"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="1.6"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  />
                </svg>
              </a>
            ) : (
              <p className="text-[14.5px] leading-[20px] tracking-[-0.01em] text-(--au-muted-strong)">
                Questions? Reply to any monthly note from your team.
              </p>
            )}
          </div>
        </div>
      </dialog>
    </>
  );
}
