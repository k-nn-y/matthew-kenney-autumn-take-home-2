/**
 * Screen 1 while the numbers are on their way. The geometry matches the
 * loaded sheet block for block so nothing shifts when figures arrive; the
 * blocks hold still — the sentence does the talking. After 8 seconds a
 * second sentence arrives by CSS alone.
 */

const KICKER = "text-[12px] leading-[16px] tracking-[0.18em] font-label uppercase";

export default function ResultsLoading() {
  return (
    <div className="w-full max-w-[1216px] flex flex-col grow pt-[20px] pb-[28px] px-[24px] xl:px-[32px] rounded-(--au-r-card) bg-(--au-ground) border border-solid border-(--au-rule)">
      {/* head row */}
      <div className="flex items-center justify-between flex-wrap gap-x-[16px] gap-y-[8px] w-full pb-[10px]">
        <p className="min-h-[44px] flex items-center">
          <span className={`${KICKER} text-(--au-ink)`}>Your results</span>
          <span className={`${KICKER} text-(--au-muted-strong) pl-[10px]`}>
            · Opening your ledger
          </span>
        </p>
        <div className="flex items-center gap-[10px]">
          <span className="text-[14.5px] leading-[22px] tracking-[-0.01em] text-(--au-muted-strong)">
            Showing
          </span>
          <span className="flex items-center py-[12px] px-[14px] rounded-(--au-r-btn) gap-[12px] bg-(--au-ground) border border-solid border-(--au-rule-strong)">
            <span className="text-caption leading-[20px] tracking-[-0.014em] text-(--au-ink)">
              Last 90 days
            </span>
            <svg viewBox="0 0 20 20" width="15" height="15" aria-hidden="true" focusable="false">
              <path
                d="M5 8l5 5 5-5"
                fill="none"
                stroke="var(--au-muted)"
                strokeWidth="1.6"
                strokeLinecap="round"
                strokeLinejoin="round"
              />
            </svg>
          </span>
        </div>
      </div>

      {/* verdict */}
      <div className="flex flex-col gap-[12px] pb-[12px]">
        <span className="au-skel h-[44px] w-full max-w-[690px]" />
        <span className="au-skel h-[44px] w-full max-w-[800px]" />
      </div>
      <p
        role="status"
        className="text-[16.5px] leading-[25px] tracking-[-0.016em] text-(--au-body) max-w-[680px] pt-[4px]"
      >
        Gathering your bookings and what they were worth. A few seconds.
        <span className="au-slow-line block">
          Still gathering. Your numbers are safe; this page will fill in.
        </span>
      </p>
      <span className="au-skel h-[10px] w-full max-w-[636px] mt-[18px]" />

      {/* cost row */}
      <div className="flex flex-wrap items-start w-full mt-[24px] pt-[24px] pb-[26px] gap-y-[24px] border-t border-solid border-t-(--au-rule)">
        {[0, 1, 2].map((i) => (
          <div key={i} className="flex flex-col w-[200px] sm:w-[225px] gap-[10px]">
            <span className="au-skel h-[13px] w-[100px]" />
            <span className="au-skel h-[34px] w-[118px]" />
            <span className="au-skel h-[13px] w-[164px]" />
          </div>
        ))}
        <div className="flex flex-col grow min-w-[240px] gap-[10px]">
          <span className="au-skel h-[13px] w-[152px]" />
          <span className="au-skel h-[13px] w-full max-w-[340px]" />
          <span className="au-skel h-[13px] w-full max-w-[265px]" />
          <span className="au-skel h-[34px] w-[239px] rounded-lamp" />
        </div>
      </div>

      {/* season chart */}
      <div className="flex flex-col w-full pt-[24px] gap-[16px] border-t border-solid border-t-(--au-rule)">
        <span className="au-skel h-[13px] w-[163px]" />
        <span className="au-skel h-[144px] w-full" />
        <div className="flex justify-between w-full">
          {[0, 1, 2, 3].map((i) => (
            <span key={i} className="au-skel h-[10px] w-[44px]" />
          ))}
        </div>
        <span className="au-skel h-[13px] w-full max-w-[617px]" />
        <span className="au-skel h-[13px] w-full max-w-[580px]" />
      </div>

      {/* note + timeline */}
      <div className="flex flex-col lg:flex-row w-full mt-[24px] pt-[24px] gap-x-[56px] gap-y-[28px] border-t border-solid border-t-(--au-rule)">
        <div className="flex flex-col w-full lg:w-[560px] shrink-0 gap-[12px]">
          <div className="flex items-center gap-[16px]">
            <span className="au-skel h-[24px] w-[82px] rounded-lamp" />
            <span className="au-skel h-[13px] w-[178px]" />
          </div>
          <span className="au-skel h-[20px] w-full max-w-[440px]" />
          <span className="au-skel h-[13px] w-full max-w-[540px]" />
          <span className="au-skel h-[13px] w-full max-w-[500px]" />
          <span className="au-skel h-[13px] w-[140px]" />
        </div>
        <div className="flex flex-col grow gap-[14px]">
          <span className="au-skel h-[13px] w-[200px]" />
          {[0, 1, 2].map((i) => (
            <div key={i} className="flex items-center gap-[18px] pb-[12px] border-b border-solid border-b-(--au-rule)">
              <span className="au-skel h-[12px] w-[52px]" />
              <span className="au-skel h-[12px] grow max-w-[300px]" />
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
