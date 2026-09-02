// Paper export of "Results · Screen 1 · Stage D" — the sheet only (sidebar is in sidebar-stage-d.jsx).
// Exact values from the canvas, Tailwind-style arbitrary classes. Tokens: docs/paper-export/tokens.css.
// text-caption = 15px · leading-caption = 22px · text-lead = 22px · w-prose = 620px · rounded-lamp = 999px.
// Build notes: sheet max-width 1216px, side padding 32px; verdict rows wrap; chart scales below 1280 with
// annotations positioned from data; info glyphs open on tap/focus with 44px hit areas; see AUDIT_REPORT.md.
(
    <div className="[font-synthesis:none] wrap-anywhere text-[12px] leading-[16px] flex flex-col [width:100%] max-w-[1216px] pt-[20px] pb-[28px] rounded-(--au-r-card) grow px-[32px] bg-(--au-ground) border border-solid border-(--au-rule) antialiased">
      <div className="flex items-center justify-between [width:100%] pb-[10px]">
        <div className="flex items-center gap-[10px]">
          <div className="text-[12px] leading-[17px] tracking-[0.18em] inline-block font-['Geist',system-ui,sans-serif] text-(--au-ink)">
            YOUR RESULTS
          </div>
          <div className="text-[12px] leading-[17px] tracking-[0.18em] inline-block font-['Geist',system-ui,sans-serif] text-(--au-muted-strong)">
            · BOOKINGS MADE JUNE 3 TO AUGUST 31, 2026 · REPORTED THROUGH AUGUST 31
          </div>
        </div>
        <div className="flex items-center gap-[10px]">
          <div className="text-[14.5px] leading-caption tracking-[-0.01em] inline-block font-['Inter',system-ui,sans-serif] font-[500] text-(--au-muted-strong)">
            Showing
          </div>
          <div className="flex items-center py-[12px] px-[14px] rounded-(--au-r-btn) gap-[12px] bg-(--au-ground) border border-solid border-(--au-rule-strong)">
            <div className="text-caption leading-[20px] tracking-[-0.014em] inline-block font-['Inter',system-ui,sans-serif] font-[500] text-(--au-ink)">
              Last 90 days
            </div>
            <svg viewBox="0 0 20 20" width="15" height="15" xmlns="http://www.w3.org/2000/svg" style={{ flexShrink: '0' }}>
              <path d="M5 8l5 5 5-5" fill="none" stroke="var(--au-muted)" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round" />
            </svg>
          </div>
        </div>
      </div>
      <div className="flex flex-col [width:100%] pb-[12px] gap-[4px]">
        <div className="flex items-baseline flex-wrap gap-x-[13px]">
          <div className="text-[45px] leading-[50px] tracking-[-0.026em] inline-block font-['Inter',system-ui,sans-serif] font-[500] text-(--au-body)">
            From June 3 to August 31,
          </div>
          <div className="flex flex-col pb-[3px] [border-bottom-width:2.5px] border-b-solid border-b-(--au-rule-strong)">
            <div className="text-[45px] leading-[50px] tracking-[-0.026em] inline-block font-['Inter',system-ui,sans-serif] font-[500] text-(--au-ink)">
              24 bookings
            </div>
          </div>
        </div>
        <div className="flex items-baseline flex-wrap gap-x-[13px]">
          <div className="text-[45px] leading-[50px] tracking-[-0.026em] inline-block font-['Inter',system-ui,sans-serif] font-[500] text-(--au-body)">
            came through Autumn’s ads, worth
          </div>
          <div className="text-[54px] leading-[54px] tracking-[-0.03em] inline-block font-['Inter',system-ui,sans-serif] font-[500] text-(--au-ink)">
            $13,895.
          </div>
        </div>
        <div className="flex pt-[12px] items-baseline justify-between [width:100%]">
          <div className="inline-block text-[16.5px] tracking-[-0.016em] leading-[25px] font-['Inter',system-ui,sans-serif] font-[500] text-(--au-body)">
            One booking fewer than the same dates last year, worth $991 more.
          </div>
          <div className="flex items-center shrink-0 gap-[6px] min-h-[44px]">
            <div className="text-[14.5px] leading-[20px] tracking-[-0.01em] inline-block w-max shrink-0 font-['Inter',system-ui,sans-serif] font-[500] text-(--au-body)">
              See all 24, one by one
            </div>
            <svg viewBox="0 0 20 20" width="14" height="14" xmlns="http://www.w3.org/2000/svg" style={{ flexShrink: '0' }}>
              <path d="M7 5l6 5-6 5" fill="none" stroke="var(--au-muted)" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round" />
            </svg>
          </div>
        </div>
        <div className="[width:100%] inline-block pt-[2px]">
          <div className="inline-block text-[14.5px] tracking-[-0.01em] leading-caption w-[680px] font-['Inter',system-ui,sans-serif] font-[500] text-(--au-slate-deep)">
            Your inn took 225 direct bookings in these dates, worth $129,053. These 24 are the ones our ads brought; the other 201 were already yours.
          </div>
        </div>
      </div>
      <div className="flex items-start justify-between [width:100%] py-[12px] gap-[48px] border-t border-t-solid border-t-(--au-rule)">
        <div className="flex flex-col w-[200px] shrink-0 gap-[8px]">
          <div className="text-[12px] leading-[16px] tracking-[0.18em] inline-block font-['Geist',system-ui,sans-serif] text-(--au-muted-strong)">
            GOOGLE AD SPEND
          </div>
          <div className="text-[33px] leading-[38px] tracking-[-0.024em] inline-block font-['Inter',system-ui,sans-serif] font-[500] text-(--au-ink)">
            $1,460
          </div>
          <div className="text-[14px] leading-[20px] tracking-[-0.01em] inline-block font-['Inter',system-ui,sans-serif] font-[500] text-(--au-muted-strong)">
            Paid by Autumn, never billed to you.
          </div>
        </div>
        <div className="flex flex-col w-[200px] shrink-0 gap-[8px]">
          <div className="text-[12px] leading-[16px] tracking-[0.18em] inline-block font-['Geist',system-ui,sans-serif] text-(--au-muted-strong)">
            AUTUMN’S 13%
          </div>
          <div className="text-[33px] leading-[38px] tracking-[-0.024em] inline-block font-['Inter',system-ui,sans-serif] font-[500] text-(--au-ink)">
            $1,806
          </div>
          <div className="text-[14px] leading-[20px] tracking-[-0.01em] inline-block font-['Inter',system-ui,sans-serif] font-[500] text-(--au-muted-strong)">
            Only on the bookings above · about $75 per booking.
          </div>
        </div>
        <div className="flex flex-col w-[200px] shrink-0 gap-[8px]">
          <div className="text-[12px] leading-[16px] tracking-[0.18em] inline-block font-['Geist',system-ui,sans-serif] text-(--au-muted-strong)">
            YOUR TOTAL COST
          </div>
          <div className="text-[33px] leading-[38px] tracking-[-0.024em] inline-block font-['Inter',system-ui,sans-serif] font-[500] text-(--au-ink)">
            $1,806
          </div>
          <div className="text-[14px] leading-[20px] tracking-[-0.01em] inline-block font-['Inter',system-ui,sans-serif] font-[500] text-(--au-muted-strong)">
            Nothing fixed, nothing monthly.
          </div>
        </div>
        <div className="flex flex-col items-start grow basis-[0%] min-w-[0px] gap-[10px]">
          <div className="text-[12px] leading-[16px] tracking-[0.18em] inline-block font-['Geist',system-ui,sans-serif] text-(--au-muted-strong)">
            AGAINST THE COMMISSION
          </div>
          <div className="text-[15.5px] leading-[24px] tracking-[-0.012em] inline-block font-['Inter',system-ui,sans-serif] font-[500] text-(--au-body)">
            The same 24 bookings through a booking site at 17% commission would have cost $2,362.
          </div>
          <div className="flex items-center py-[8px] px-[12px] rounded-(--au-r-btn) bg-(--au-slate-tint)">
            <div className="text-[15.5px] leading-caption tracking-[-0.012em] inline-block w-max shrink-0 font-['Inter',system-ui,sans-serif] font-[500] text-(--au-slate-deep)">
              $556 stayed with you this period.
            </div>
          </div>
        </div>
      </div>
      <div className="flex flex-col [width:100%] py-[18px] gap-[10px] border-t border-t-solid border-t-(--au-rule)">
        <div className="flex items-center [width:100%] gap-[16px]">
          <div className="flex items-center gap-[6px]">
            <div className="text-[12px] leading-[16px] tracking-[0.18em] inline-block font-['Geist',system-ui,sans-serif] text-(--au-muted-strong)">
              THE SHAPE OF THE SEASON
            </div>
            <svg viewBox="0 0 16 16" width="14" height="14" xmlns="http://www.w3.org/2000/svg" style={{ flexShrink: '0' }}>
              <circle cx="8" cy="8" r="6.4" fill="none" stroke="var(--au-muted)" strokeWidth="1.3" />
              <path d="M8 7.2v3.6" fill="none" stroke="var(--au-muted)" strokeWidth="1.5" strokeLinecap="round" />
              <circle cx="8" cy="5" r="0.9" fill="var(--au-muted)" />
            </svg>
          </div>
        </div>
        {/* Chart: viewBox 0 0 1120 160. y = 12 + (18 - bookings) * (136/18); baseline y=148 (0 bookings), 18 bookings at y=12.
            Gridlines at 18/12/6 dotted rgba(28,27,25,.10); baseline rgba(28,27,25,.16); dashed two-year average at 73.6 (~10/month).
            Thin single-month line #4D5B6E at 60%; solid three-month rolling line #4D5B6E 2px, mitre joins; gradient area under
            the rolling line from #4D5B6E at 16% to 0; hollow markers on the two peaks; filled marker on the latest point. */}
        <div className="w-[1120px] h-[160px] relative shrink-0">
          <svg viewBox="0 0 1120 160" width="1120" height="160" xmlns="http://www.w3.org/2000/svg">
            <defs><linearGradient id="auSeasonFade" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stopColor="#4D5B6E" stopOpacity="0.16"/><stop offset="1" stopColor="#4D5B6E" stopOpacity="0"/></linearGradient></defs>
            <path d="M0 12 H1120" fill="none" stroke="#1C1B191A" strokeDasharray="2 4" />
            <path d="M0 57.3 H1120" fill="none" stroke="#1C1B191A" strokeDasharray="2 4" />
            <path d="M0 102.7 H1120" fill="none" stroke="#1C1B191A" strokeDasharray="2 4" />
            <path d="M0 148 H1120" fill="none" stroke="#1C1B1929" />
            <path d="M102.3 148.0 L150.5 140.4 L198.7 115.4 L246.9 72.4 L295 59.8 L343.2 74.9 L391.4 102.7 L439.6 107.8 L487.7 102.7 L535.9 85.1 L584.1 67.4 L632.3 44.6 L680.4 52.2 L728.6 39.8 L776.8 52.2 L825 32.2 L873.1 52.2 L921.3 57.3 L969.5 85.1 L1017.7 97.7 L1065.8 85.1 L1114 85.1 L1114 148 L102.3 148 Z" fill="url(#auSeasonFade)" />
            <path d="M0 73.6 H1120" fill="none" stroke="#4D5B6E8C" strokeDasharray="6 5" />
            <path d="M6 148.0 L54.2 148.0 L102.3 148.0 L150.5 125.3 L198.7 72.4 L246.9 19.6 L295 87.6 L343.2 117.7 L391.4 102.7 L439.6 102.7 L487.7 102.7 L535.9 49.7 L584.1 49.7 L632.3 34.7 L680.4 72.4 L728.6 12.0 L776.8 72.4 L825 12.0 L873.1 72.4 L921.3 87.6 L969.5 95.2 L1017.7 110.3 L1065.8 49.7 L1114 95.2" fill="none" stroke="#4D5B6E99" />
            <path d="M102.3 148.0 L150.5 140.4 L198.7 115.4 L246.9 72.4 L295 59.8 L343.2 74.9 L391.4 102.7 L439.6 107.8 L487.7 102.7 L535.9 85.1 L584.1 67.4 L632.3 44.6 L680.4 52.2 L728.6 39.8 L776.8 52.2 L825 32.2 L873.1 52.2 L921.3 57.3 L969.5 85.1 L1017.7 97.7 L1065.8 85.1 L1114 85.1" fill="none" stroke="#4D5B6E" strokeWidth="2" />
            <circle cx="728.6" cy="12" r="3.5" fill="#FFFFFF" stroke="#4D5B6E" strokeWidth="1.5" />
            <circle cx="825" cy="12" r="3.5" fill="#FFFFFF" stroke="#4D5B6E" strokeWidth="1.5" />
            <circle cx="1114" cy="85.1" r="4.5" fill="#4D5B6E" stroke="#FFFFFF" strokeWidth="2" />
          </svg>
          <div className="absolute left-[700px] top-[-16px] text-[12px] leading-[16px] tracking-[0.1em] inline-block w-max font-['Geist',system-ui,sans-serif] text-(--au-muted-strong)">
            BUSIEST · DEC ’25 AND FEB ’26 · 18 EACH
          </div>
          <div className="absolute left-[986px] top-[50px] text-[12.5px] leading-[16px] tracking-[-0.005em] inline-block w-max font-['Inter',system-ui,sans-serif] font-[500] text-(--au-slate-deep)">
            about 8 a month lately
          </div>
          <div className="absolute left-[150px] top-[12px] w-px h-[136px] bg-(--au-rule-strong)" />
          <div className="absolute left-[158px] top-[150px] text-[12px] leading-[16px] tracking-[0.1em] inline-block w-max font-['Geist',system-ui,sans-serif] text-(--au-muted-strong)">
            YOUR ADS BEGAN · DEC ’24
          </div>
          <div className="absolute left-[0px] top-[14px] text-[12px] leading-[16px] tracking-[0.1em] inline-block w-max font-['Geist',system-ui,sans-serif] text-(--au-muted-strong)">
            18 bookings
          </div>
          <div className="absolute left-[0px] top-[59px] text-[12px] leading-[16px] tracking-[0.1em] inline-block w-max font-['Geist',system-ui,sans-serif] text-(--au-muted-strong)">
            12
          </div>
          <div className="absolute left-[0px] top-[104px] text-[12px] leading-[16px] tracking-[0.1em] inline-block w-max font-['Geist',system-ui,sans-serif] text-(--au-muted-strong)">
            6
          </div>
          <div className="absolute left-[40px] top-[58px] text-[12px] leading-[16px] tracking-[0.1em] inline-block w-max font-['Geist',system-ui,sans-serif] text-(--au-slate-deep)">
            YOUR AVERAGE · 10 A MONTH
          </div>
        </div>
        <div className="flex [width:100%]">
          <div className="w-[289px] shrink-0 inline-block pl-[6px]">
            <div className="inline-block text-[12px] tracking-[0.06em] leading-[16px] font-['Geist',system-ui,sans-serif] text-(--au-muted-strong)">
              SEP ’24
            </div>
          </div>
          <div className="w-[289px] shrink-0 inline-block pl-[6px]">
            <div className="inline-block text-[12px] tracking-[0.06em] leading-[16px] font-['Geist',system-ui,sans-serif] text-(--au-muted-strong)">
              MAR ’25
            </div>
          </div>
          <div className="w-[289px] shrink-0 inline-block pl-[6px]">
            <div className="inline-block text-[12px] tracking-[0.06em] leading-[16px] font-['Geist',system-ui,sans-serif] text-(--au-muted-strong)">
              SEP ’25
            </div>
          </div>
          <div className="inline-block pl-[6px]">
            <div className="inline-block text-[12px] tracking-[0.06em] leading-[16px] font-['Geist',system-ui,sans-serif] text-(--au-muted-strong)">
              MAR ’26
            </div>
          </div>
        </div>
        <div className="text-[12.5px] leading-[17px] tracking-[-0.006em] inline-block w-[680px] pt-[8px] font-['Inter',system-ui,sans-serif] font-[500] text-(--au-muted-strong)">
          Counted by the month each guest booked. Solid line: the three-month average · thin line: each month on its own · dashed line: your two-year average.
        </div>
        <div className="w-[680px] inline-block pt-[8px]">
          <div className="inline-block text-[14px] tracking-[-0.01em] leading-[20px] font-['Inter',system-ui,sans-serif] font-[500] text-(--au-body)">
            Of these 24, five booked from Boston, three from New Hampshire and three from Montreal; the other thirteen came from eight more places.
          </div>
        </div>
      </div>
      <div className="flex [width:100%] grow pt-[24px] gap-[40px] border-t border-t-solid border-t-(--au-rule)">
        <div className="flex flex-col w-prose shrink-0 gap-[12px]">
          <div className="flex items-center gap-[12px]">
            <div className="flex items-center py-[4px] px-[10px] rounded-lamp border border-solid border-(--au-rule-strong)">
              <div className="text-[12px] leading-[16px] tracking-[0.18em] inline-block font-['Geist',system-ui,sans-serif] text-(--au-ink)">
                ALL CLEAR
              </div>
            </div>
            <div className="text-[14px] leading-[20px] tracking-[-0.01em] inline-block font-['Inter',system-ui,sans-serif] font-[500] text-(--au-muted-strong)">
              A note from Autumn · September 1
            </div>
          </div>
          <div className="text-lead leading-[28px] tracking-[-0.018em] inline-block font-['Inter',system-ui,sans-serif] font-[500] text-(--au-ink)">
            Nothing needs you right now.
          </div>
          <div className="text-[16px] leading-[24px] tracking-[-0.012em] inline-block font-['Inter',system-ui,sans-serif] font-[500] text-(--au-body)">
            Don, August brought 7 bookings worth $3,992, the quietest of the three months and ordinary for late summer. Your name is back in front of nine in ten people searching for it, nothing we changed touches the front desk, and nothing needs you before we check in again on October 1.
          </div>
          <div className="text-[14px] leading-[20px] tracking-[-0.01em] inline-block font-['Inter',system-ui,sans-serif] font-[500] text-(--au-muted-strong)">
            — Your team at Autumn
          </div>
        </div>
        <div className="flex flex-col grow basis-[0%] min-w-[0px] pl-[40px] border-l border-l-solid border-l-(--au-rule)">
          <div className="flex items-center justify-between pb-[10px]">
            <div className="text-[12px] leading-[16px] tracking-[0.18em] inline-block font-['Geist',system-ui,sans-serif] text-(--au-muted-strong)">
              WHAT CHANGED THIS SUMMER
            </div>
            <div className="flex items-center min-h-[44px] gap-[6px]">
              <div className="text-[14px] leading-[20px] tracking-[-0.01em] inline-block w-max shrink-0 font-['Inter',system-ui,sans-serif] font-[500] text-(--au-body)">
                All notes
              </div>
              <svg viewBox="0 0 20 20" width="12" height="12" xmlns="http://www.w3.org/2000/svg" style={{ flexShrink: '0' }}>
                <path d="M7 5l6 5-6 5" fill="none" stroke="var(--au-muted-strong)" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round" />
              </svg>
            </div>
          </div>
          <div className="flex items-start py-[10px] gap-[16px] border-t border-t-solid border-t-(--au-rule)">
            <div className="w-[64px] shrink-0 inline-block pt-[2px]">
              <div className="inline-block text-[12px] tracking-[0.14em] leading-[16px] w-max font-['Geist',system-ui,sans-serif] text-(--au-muted-strong)">
                JUN 15
              </div>
            </div>
            <div className="text-[14.5px] leading-[20px] tracking-[-0.01em] inline-block font-['Inter',system-ui,sans-serif] font-[500] text-(--au-body)">
              Heads up. Another property began bidding on your inn’s name; we raised what we pay for it.
            </div>
          </div>
          <div className="flex items-start py-[10px] gap-[16px] border-t border-t-solid border-t-(--au-rule)">
            <div className="w-[64px] shrink-0 inline-block pt-[2px]">
              <div className="inline-block text-[12px] tracking-[0.14em] leading-[16px] w-max font-['Geist',system-ui,sans-serif] text-(--au-muted-strong)">
                AUG 1
              </div>
            </div>
            <div className="text-[14.5px] leading-[20px] tracking-[-0.01em] inline-block font-['Inter',system-ui,sans-serif] font-[500] text-(--au-body)">
              Resolved. You are back in front of nine in ten people searching for you.
            </div>
          </div>
          <div className="flex items-start py-[10px] gap-[16px] border-t border-t-solid border-t-(--au-rule) border-b border-b-solid border-b-(--au-rule)">
            <div className="w-[64px] shrink-0 inline-block pt-[2px]">
              <div className="inline-block text-[12px] tracking-[0.14em] leading-[16px] w-max font-['Geist',system-ui,sans-serif] text-(--au-ink)">
                SEP 1
              </div>
            </div>
            <div className="text-[14.5px] leading-[20px] tracking-[-0.01em] inline-block font-['Inter',system-ui,sans-serif] font-[500] text-(--au-ink)">
              All clear. August held; next check-in October 1.
            </div>
          </div>
        </div>
      </div>
    </div>
)
