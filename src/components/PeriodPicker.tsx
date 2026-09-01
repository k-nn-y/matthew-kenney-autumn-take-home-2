"use client";

import { usePathname, useRouter } from "next/navigation";
import { useId, useTransition, type ChangeEvent, type FormEvent } from "react";
import { PERIOD_OPTIONS, type PeriodKey } from "@/lib/periods";
import styles from "./PeriodPicker.module.css";

/**
 * The one control on either screen. It is a real <select>, so it opens as the
 * operating system's own list — the thing a 52-year-old on a phone at the
 * front desk has used ten thousand times — rather than a custom popover that
 * has to relearn keyboard, screen reader and scroll behaviour.
 *
 * The chosen window lives in `?period=`, which makes it a shareable, honest
 * piece of state: every number on the page is read from that same param by
 * the server, so no card can be quietly on a different window.
 *
 * The current value arrives as a prop from the page's own searchParams rather
 * than from useSearchParams(), which keeps this island out of the way of
 * prerendering — nothing above it has to be pushed behind a Suspense boundary
 * to accommodate it.
 */
export function PeriodPicker({ value }: { value: PeriodKey }) {
  const router = useRouter();
  const pathname = usePathname();
  const [pending, startTransition] = useTransition();
  const selectId = useId();

  function go(next: string) {
    /* Read the live query string rather than a hook, so any other param a
       screen adds later survives a period change untouched. */
    const params = new URLSearchParams(window.location.search);
    params.set("period", next);
    startTransition(() => {
      /* replace, not push: on Windows a keyboard user moves through a native
         select with the arrow keys and every step fires a change event, which
         under push would bury the page he arrived from under four entries.
         scroll: false because only the numbers changed, not the place. */
      router.replace(`${pathname}?${params.toString()}`, { scroll: false });
    });
  }

  function onChange(event: ChangeEvent<HTMLSelectElement>) {
    go(event.target.value);
  }

  /* With JavaScript the form never submits; without it, the browser's own GET
     submit produces exactly the same URL. */
  function onSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    go(new FormData(event.currentTarget).get("period") as string);
  }

  return (
    <form
      method="get"
      action={pathname}
      onSubmit={onSubmit}
      className={styles.form}
    >
      <label htmlFor={selectId} className={styles.label}>
        Showing
        <span className="au-sr-only"> numbers for</span>
      </label>

      <div className={styles.field} data-pending={pending ? "true" : undefined}>
        <select
          id={selectId}
          name="period"
          className={styles.select}
          value={value}
          onChange={onChange}
          aria-busy={pending || undefined}
        >
          {PERIOD_OPTIONS.map((option) => (
            <option key={option.key} value={option.key}>
              {option.label}
            </option>
          ))}
        </select>

        <svg
          viewBox="0 0 20 20"
          xmlns="http://www.w3.org/2000/svg"
          width="16"
          height="16"
          aria-hidden="true"
          focusable="false"
          className={styles.chevron}
        >
          <path
            d="M5 8l5 5 5-5"
            fill="none"
            stroke="currentColor"
            strokeWidth="1.6"
            strokeLinecap="round"
            strokeLinejoin="round"
          />
        </svg>
      </div>

      {/* Scripting off: the select still changes the period, it just needs a
          press to send it. Written as markup rather than as children because a
          browser with scripting enabled parses <noscript> content as text, and
          React would then hydrate against a text node it did not expect. */}
      <noscript
        dangerouslySetInnerHTML={{
          __html: `<button type="submit" class="${styles.submit}">Show</button>`,
        }}
      />
    </form>
  );
}
