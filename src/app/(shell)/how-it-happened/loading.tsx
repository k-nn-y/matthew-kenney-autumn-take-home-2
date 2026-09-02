/**
 * Screen 2 while the ledger is on its way. Same geometry as the loaded
 * sheet — hero card, journey strip, two panels, ledger, occupancy — so
 * nothing shifts; the blocks hold still and the sentence does the talking.
 */

const KICKER = "text-[12px] leading-[16px] tracking-[0.18em] font-label uppercase";

export default function HowItHappenedLoading() {
  return (
    <div className="w-full max-w-[1216px] flex flex-col grow pt-[20px] pb-[36px] px-[24px] xl:px-[32px] rounded-(--au-r-card) bg-(--au-ground) border border-solid border-(--au-rule)">
      {/* head row */}
      <div className="flex items-center justify-between flex-wrap gap-x-[16px] gap-y-[8px] w-full pb-[16px]">
        <p className="flex items-center gap-[10px] min-h-[44px]">
          <svg viewBox="0 0 16 16" width="13" height="13" aria-hidden="true" focusable="false">
            <path
              d="M10 3.5 5.5 8 10 12.5"
              fill="none"
              stroke="var(--au-body)"
              strokeWidth="1.6"
              strokeLinecap="round"
              strokeLinejoin="round"
            />
          </svg>
          <span className="text-[14.5px] leading-[22px] tracking-[-0.01em] text-(--au-body)">
            Your results
          </span>
          <span className={`${KICKER} text-(--au-muted-strong)`}>
            · Opening the ledger, one booking at a time
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

      {/* hero card, skeleton on light ground while the ink card's figures arrive */}
      <div className="flex flex-col w-full pt-[32px] pb-[30px] rounded-(--au-r-card) gap-[26px] px-[24px] sm:px-[36px] bg-(--au-ground-alt)">
        <div className="flex items-end justify-between flex-wrap w-full gap-x-[40px] gap-y-[20px]">
          <span className="au-skel h-[92px] w-[368px] bg-[rgb(28_27_25/8%)]" />
          <div className="flex flex-col items-end gap-[10px]">
            <span className="au-skel h-[13px] w-[240px] bg-[rgb(28_27_25/8%)]" />
            <span className="au-skel h-[13px] w-[240px] bg-[rgb(28_27_25/8%)]" />
            <span className="au-skel h-[13px] w-[184px] bg-[rgb(28_27_25/8%)]" />
          </div>
        </div>
        <p
          role="status"
          className="text-[15px] leading-[22px] tracking-[-0.01em] text-(--au-body)"
        >
          Gathering each booking, where it came from and what it was worth. A
          few seconds.
          <span className="au-slow-line block">
            Still gathering. Your numbers are safe; this page will fill in.
          </span>
        </p>
        <div className="flex items-start w-full gap-x-[48px] gap-y-[24px] flex-wrap">
          {[0, 1].map((i) => (
            <div key={i} className="flex flex-col w-[240px] sm:w-[280px] gap-[10px]">
              <span className="au-skel h-[50px] w-[50px] bg-[rgb(28_27_25/8%)]" />
              <span className="au-skel h-[13px] w-[155px] bg-[rgb(28_27_25/8%)]" />
            </div>
          ))}
          <div className="flex flex-col grow min-w-[240px] pt-[18px] gap-[14px]">
            <span className="au-skel h-[10px] w-full max-w-[278px] bg-[rgb(28_27_25/8%)]" />
            <span className="au-skel h-[10px] w-full max-w-[246px] bg-[rgb(28_27_25/8%)]" />
          </div>
        </div>
      </div>

      {/* journey strip */}
      <div className="flex items-center justify-between flex-wrap w-full mt-[20px] py-[16px] px-[4px] gap-x-[24px] gap-y-[16px] border-t border-b border-solid border-(--au-rule)">
        <div className="flex items-center flex-wrap gap-x-[40px] gap-y-[16px]">
          {[0, 1, 2].map((i) => (
            <div key={i} className="flex flex-col gap-[8px]">
              <span className="au-skel h-[12px] w-[106px]" />
              <span className="au-skel h-[22px] w-[62px]" />
              <span className="au-skel h-[11px] w-[122px]" />
            </div>
          ))}
        </div>
        <div className="flex flex-col items-end gap-[8px] w-full lg:w-[380px]">
          <span className="au-skel h-[12px] w-full max-w-[270px]" />
          <span className="au-skel h-[12px] w-full max-w-[240px]" />
          <span className="au-skel h-[12px] w-[190px]" />
        </div>
      </div>

      {/* two panels */}
      <div className="flex flex-col lg:flex-row w-full pt-[20px] gap-[24px] items-stretch">
        {[0, 1].map((p) => (
          <div
            key={p}
            className={`flex flex-col rounded-(--au-r-btn) overflow-clip border border-solid border-(--au-rule) ${p === 0 ? "w-full lg:w-[548px] shrink-0" : "grow"}`}
          >
            <div className="flex items-center justify-between py-[13px] px-[16px]">
              <span className="au-skel h-[15px] w-[168px]" />
              <span className="au-skel h-[13px] w-[76px]" />
            </div>
            <div className="h-[30px] bg-(--au-ground-alt) border-t border-solid border-t-(--au-rule)" />
            {[0, 1, 2, 3, 4].map((r) => (
              <div
                key={r}
                className="flex items-center justify-between py-[12px] px-[16px] border-t border-solid border-t-(--au-rule)"
              >
                <span className="au-skel h-[13px] w-[168px]" />
                <span className="au-skel h-[13px] w-[108px]" />
              </div>
            ))}
            <div className="grow min-h-[46px] bg-(--au-ground-alt) border-t border-solid border-t-(--au-rule)" />
          </div>
        ))}
      </div>

      {/* ledger */}
      <div className="flex flex-col w-full mt-[20px] rounded-(--au-r-btn) overflow-clip border border-solid border-(--au-rule)">
        <div className="flex items-center justify-between py-[13px] px-[16px]">
          <span className="au-skel h-[15px] w-[220px]" />
          <span className="au-skel h-[13px] w-[76px]" />
        </div>
        <div className="h-[30px] bg-(--au-ground-alt) border-t border-solid border-t-(--au-rule)" />
        {[0, 1, 2, 3, 4, 5].map((r) => (
          <div
            key={r}
            className="flex items-center gap-[20px] py-[12px] px-[16px] border-t border-solid border-t-(--au-rule)"
          >
            <span className="au-skel h-[13px] w-[104px]" />
            <span className="au-skel h-[13px] w-[104px] hidden sm:block" />
            <span className="au-skel h-[13px] w-[46px] hidden sm:block" />
            <span className="au-skel h-[13px] w-[58px]" />
            <span className="au-skel h-[13px] grow max-w-[200px] hidden sm:block" />
            <span className="au-skel h-[13px] w-[150px]" />
          </div>
        ))}
        <div className="min-h-[46px] bg-(--au-ground-alt) border-t border-solid border-t-(--au-rule)" />
      </div>

      {/* occupancy + ask */}
      <div className="flex justify-between flex-wrap w-full pt-[20px] items-start gap-x-[64px] gap-y-[24px]">
        <div className="flex w-full lg:w-[600px] shrink-0 h-[122px] rounded-(--au-r-card) bg-(--au-ground-alt)" />
        <div className="flex flex-col items-start lg:items-end grow gap-[14px] pt-[4px]">
          <span className="au-skel h-[13px] w-full max-w-[280px]" />
          <span className="au-skel h-[13px] w-[210px]" />
          <span className="au-skel h-[44px] w-[190px]" />
        </div>
      </div>
    </div>
  );
}
