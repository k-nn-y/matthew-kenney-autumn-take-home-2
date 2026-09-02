"use client";

/**
 * Something went wrong between the sheet and the database. The sidebar
 * shell stays; the sheet says plainly what happened and offers one door
 * back: try again. No error codes on the sheet, nothing blinks.
 */
export default function ResultsError({
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  return (
    <div className="w-full max-w-[1216px] flex flex-col grow pt-[20px] pb-[36px] px-[24px] xl:px-[32px] rounded-(--au-r-card) bg-(--au-ground) border border-solid border-(--au-rule)">
      <p className="min-h-[44px] flex items-center">
        <span className="text-[12px] leading-[16px] tracking-[0.18em] font-label uppercase text-(--au-ink)">
          Your results
        </span>
      </p>
      <div className="flex flex-col grow justify-center max-w-[680px] gap-[14px] py-[48px]">
        <h1 className="text-[34px] leading-[42px] sm:text-[40px] sm:leading-[46px] tracking-[-0.024em] text-(--au-ink)">
          Couldn&rsquo;t open your results.
        </h1>
        <p className="text-[16.5px] leading-[25px] tracking-[-0.016em] text-(--au-body)">
          The connection to your ledger didn&rsquo;t go through just now. Your
          numbers are safe and nothing has been lost; this page simply
          couldn&rsquo;t reach them.
        </p>
        <div className="pt-[10px]">
          <button
            type="button"
            onClick={() => reset()}
            className="au-ask inline-flex items-center min-h-[44px] py-[11px] px-[20px] rounded-(--au-r-btn) bg-(--au-ink) text-[15px] leading-[22px] tracking-[-0.01em] text-(--au-on-ink) cursor-pointer"
          >
            Try again
          </button>
        </div>
        <p className="text-caption tracking-[-0.012em] text-(--au-muted-strong) pt-[6px]">
          If this keeps happening, use Ask about a number in the corner and
          your team will look into it.
        </p>
      </div>
    </div>
  );
}
