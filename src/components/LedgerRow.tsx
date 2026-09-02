"use client";

import { useId, useState } from "react";

/**
 * One ledger row. On narrow screens the table keeps Booked, Value and How
 * they found you; the rest sits behind a row tap that opens a plain detail
 * line underneath. The detail appears fully formed — nothing animates.
 */
export function LedgerRow({
  booked,
  arriving,
  nights,
  value,
  from,
  found,
  reveal = false,
}: {
  booked: string;
  arriving: string;
  nights: number;
  value: string;
  from: string;
  found: string;
  reveal?: boolean;
}) {
  const [open, setOpen] = useState(false);
  const detailId = useId();
  const CELL =
    "py-[9px] text-caption tracking-[-0.012em] border-t border-solid border-(--au-rule)";

  return (
    <>
      <tr className={reveal ? "au-reveal" : undefined}>
        <td className={`${CELL} pl-[16px] text-(--au-body)`}>
          <span className="hidden sm:inline">{booked}</span>
          <button
            type="button"
            aria-expanded={open}
            aria-controls={detailId}
            onClick={() => setOpen((v) => !v)}
            className="sm:hidden inline-flex items-center gap-[6px] min-h-[44px] -my-[9px] text-caption tracking-[-0.012em] text-(--au-body) cursor-pointer"
          >
            {booked}
            <svg
              viewBox="0 0 20 20"
              width="12"
              height="12"
              aria-hidden="true"
              focusable="false"
              className={open ? "rotate-180" : undefined}
            >
              <path
                d="M5 7.5l5 5 5-5"
                fill="none"
                stroke="var(--au-muted)"
                strokeWidth="1.6"
                strokeLinecap="round"
                strokeLinejoin="round"
              />
            </svg>
          </button>
        </td>
        <td className={`${CELL} text-(--au-body) hidden sm:table-cell`}>
          {arriving}
        </td>
        <td className={`${CELL} text-right text-(--au-body) hidden sm:table-cell`}>
          {nights}
        </td>
        <td className={`${CELL} text-right text-(--au-ink)`}>{value}</td>
        <td className={`${CELL} pl-[44px] text-(--au-body) hidden sm:table-cell`}>
          {from}
        </td>
        <td className={`${CELL} pr-[16px] pl-[20px] text-[14px] leading-[20px] tracking-[-0.01em] text-(--au-body)`}>
          {found}
        </td>
      </tr>
      <tr id={detailId} className={open ? "sm:hidden" : "hidden"}>
        <td
          colSpan={3}
          className="pb-[10px] pl-[16px] pr-[16px] text-[13.5px] leading-[19px] tracking-[-0.008em] text-(--au-muted-strong)"
        >
          Arriving {arriving} · {nights} {nights === 1 ? "night" : "nights"} ·
          from {from}
        </td>
      </tr>
    </>
  );
}
