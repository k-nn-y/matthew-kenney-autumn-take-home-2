// Paper export of "How it happened · Screen 2 · Stage D" — the sheet only (sidebar is in sidebar-stage-d.jsx with the
// active pill on "How it happened"). Exact values from the canvas. Tokens: docs/paper-export/tokens.css.
// text-caption/caption = 15px/22px · text-row = 34px. Build notes: panels and ledger are real tables with scoped headers;
// the two panels stretch to equal height (align-items: stretch, footnotes flex-grow); doors are anchors ≥44px tall.
(
    <div className="[font-synthesis:none] wrap-anywhere text-[12px] leading-[16px] flex flex-col [width:100%] max-w-[1216px] pt-[26px] pb-[36px] rounded-(--au-r-card) px-[32px] bg-(--au-ground) border border-solid border-(--au-rule) antialiased">
      <div className="flex items-center justify-between [width:100%] pb-[20px]">
        <div className="flex items-center gap-[10px] min-h-[44px]">
          <svg viewBox="0 0 20 20" width="14" height="14" xmlns="http://www.w3.org/2000/svg" style={{ flexShrink: '0' }}>
            <path d="M12 5l-6 5 6 5" fill="none" stroke="var(--au-body)" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round" />
          </svg>
          <div className="text-[14.5px] leading-caption tracking-[-0.01em] inline-block font-['Inter',system-ui,sans-serif] font-[500] text-(--au-body)">
            Your results
          </div>
          <div className="inline-block pl-[10px]">
            <div className="inline-block text-[12px] tracking-[0.18em] leading-[17px] font-['Geist',system-ui,sans-serif] text-(--au-muted-strong)">
              · BOOKINGS MADE JUNE 3 TO AUGUST 31, 2026 · AGAINST JUNE 3 TO AUGUST 31, 2025
            </div>
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
      <div className="flex flex-col [width:100%]">
        <div className="flex flex-col [width:100%] pt-[32px] pb-[30px] rounded-(--au-r-card) gap-[26px] px-[36px] bg-(--au-ink-ground)">
          <div className="flex items-end justify-between [width:100%] gap-[40px] h-[124px] shrink-0">
            <div className="flex items-baseline gap-[18px]">
              <div className="text-[96px] leading-[92px] tracking-[-0.04em] inline-block font-['Inter',system-ui,sans-serif] font-[500] text-(--au-on-ink)">
                24
              </div>
              <div className="text-row leading-[40px] tracking-[-0.024em] inline-block font-['Inter',system-ui,sans-serif] font-[500] text-(--au-on-ink)">
                bookings, one by one.
              </div>
            </div>
            <div className="text-[14.5px] leading-caption tracking-[-0.01em] max-w-[360px] text-right inline-block font-['Inter',system-ui,sans-serif] font-[500] text-(--au-on-ink-muted)">
              Your inn took 225 direct bookings in these dates. These 24 came through our ads, worth $13,895, and the four ways, the eleven places and the ledger below all add back up to them.
            </div>
          </div>
          <div className="flex flex-col [width:100%] pt-[24px] gap-[18px] border-t border-t-solid border-t-(--au-rule-on-ink)">
            <div className="text-[12px] leading-[16px] tracking-[0.18em] inline-block font-['Geist',system-ui,sans-serif] text-(--au-on-ink-muted)">
              WOULD YOU HAVE GOT THESE ANYWAY?
            </div>
            <div className="flex items-start [width:100%] gap-[48px]">
              <div className="flex flex-col w-[280px] shrink-0 gap-[6px]">
                <div className="text-[56px] leading-[58px] tracking-[-0.032em] inline-block font-['Inter',system-ui,sans-serif] font-[500] text-(--au-on-ink)">
                  17
                </div>
                <div className="text-[16px] leading-[23px] tracking-[-0.014em] inline-block font-['Inter',system-ui,sans-serif] font-[500] text-(--au-on-ink)">
                  searched for you by name
                </div>
                <div className="text-[13.5px] leading-[20px] tracking-[-0.008em] inline-block font-['Inter',system-ui,sans-serif] font-[500] text-(--au-on-ink-muted)">
                  Some would have found you anyway.
                </div>
              </div>
              <div className="flex flex-col w-[280px] shrink-0 gap-[6px]">
                <div className="text-[56px] leading-[58px] tracking-[-0.032em] inline-block font-['Inter',system-ui,sans-serif] font-[500] text-(--au-on-ink)">
                  7
                </div>
                <div className="text-[16px] leading-[23px] tracking-[-0.014em] inline-block font-['Inter',system-ui,sans-serif] font-[500] text-(--au-on-ink)">
                  didn’t know you yet
                </div>
                <div className="text-[13.5px] leading-[20px] tracking-[-0.008em] inline-block font-['Inter',system-ui,sans-serif] font-[500] text-(--au-on-ink-muted)">
                  The guests the advertising is really for.
                </div>
              </div>
              <div className="flex flex-col grow pt-[18px] gap-[14px]">
                <div className="flex [width:100%] h-[10px] gap-[3px] shrink-0">
                  <div className="w-[round(70.8%,1px)] h-[10px] opacity-[0.45] rounded-[2px] bg-(--au-on-ink)" />
                  <div className="grow h-[10px] rounded-[2px] bg-(--au-on-ink)" />
                </div>
                <div className="text-[14.5px] leading-caption tracking-[-0.01em] max-w-[46ch] inline-block font-['Inter',system-ui,sans-serif] font-[500] text-(--au-on-ink-muted)">
                  When you don’t advertise your own name, the booking sites’ ads sit on top of it in the search results.
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
      <div className="flex items-center justify-between [width:100%] mt-[20px] py-[16px] px-[4px] gap-[24px] border-t border-t-solid border-t-(--au-rule) border-b border-b-solid border-b-(--au-rule)">
        <div className="flex items-center">
          <div className="flex flex-col pr-[20px] gap-[5px]">
            <div className="text-[12px] leading-[16px] tracking-[0.18em] inline-block w-max font-['Geist',system-ui,sans-serif] text-(--au-muted-strong)">
              TIMES YOU APPEARED
            </div>
            <div className="text-[26px] leading-[30px] tracking-[-0.02em] inline-block w-max font-['Inter',system-ui,sans-serif] font-[500] text-(--au-ink)">
              12,381
            </div>
            <div className="text-[12.5px] leading-[17px] tracking-[-0.006em] inline-block w-max font-['Inter',system-ui,sans-serif] font-[500] text-(--au-muted-strong)">
              12,946 the same dates last year
            </div>
          </div>
          <div className="w-px h-[40px] shrink-0 bg-(--au-rule-strong)" />
          <div className="flex flex-col px-[20px] gap-[5px]">
            <div className="text-[12px] leading-[16px] tracking-[0.18em] inline-block w-max font-['Geist',system-ui,sans-serif] text-(--au-muted-strong)">
              VISITS FROM GOOGLE
            </div>
            <div className="text-[26px] leading-[30px] tracking-[-0.02em] inline-block w-max font-['Inter',system-ui,sans-serif] font-[500] text-(--au-ink)">
              882
            </div>
            <div className="text-[12.5px] leading-[17px] tracking-[-0.006em] inline-block w-max font-['Inter',system-ui,sans-serif] font-[500] text-(--au-muted-strong)">
              948 last year · 8 in 100 of your site visits
            </div>
          </div>
          <div className="w-px h-[40px] shrink-0 bg-(--au-rule-strong)" />
          <div className="flex flex-col pl-[20px] gap-[5px]">
            <div className="text-[12px] leading-[16px] tracking-[0.18em] inline-block w-max font-['Geist',system-ui,sans-serif] text-(--au-muted-strong)">
              BOOKINGS
            </div>
            <div className="text-[26px] leading-[30px] tracking-[-0.02em] inline-block w-max font-['Inter',system-ui,sans-serif] font-[500] text-(--au-ink)">
              24
            </div>
            <div className="text-[12.5px] leading-[17px] tracking-[-0.006em] inline-block w-max font-['Inter',system-ui,sans-serif] font-[500] text-(--au-muted-strong)">
              25 the same dates last year
            </div>
          </div>
        </div>
        <div className="w-[380px] text-right text-[13.5px] leading-[19px] tracking-[-0.006em] inline-block shrink-0 font-['Inter',system-ui,sans-serif] font-[500] text-(--au-muted-strong)">
          Shown, visited, booked. These three only prove the ads did their job; the bookings above are what count. Autumn paid the $1,460 the ads cost.
        </div>
      </div>
      <div className="flex [width:100%] pt-[20px] gap-[24px] items-stretch">
        <div className="flex flex-col w-[548px] shrink-0 rounded-(--au-r-btn) overflow-clip border border-solid border-(--au-rule)">
          <div className="flex items-baseline justify-between [width:100%] py-[13px] px-[16px] gap-[16px]">
            <div className="flex items-center gap-[7px]">
              <div className="text-[15.5px] leading-caption tracking-[-0.014em] inline-block font-['Inter',system-ui,sans-serif] font-[500] text-(--au-ink)">
                How our ads drove them
              </div>
              <svg viewBox="0 0 16 16" width="14" height="14" xmlns="http://www.w3.org/2000/svg" style={{ flexShrink: '0' }}>
                <circle cx="8" cy="8" r="6.4" fill="none" stroke="var(--au-muted)" strokeWidth="1.3" />
                <path d="M8 7.2v3.6" fill="none" stroke="var(--au-muted)" strokeWidth="1.5" strokeLinecap="round" />
                <circle cx="8" cy="5" r="0.9" fill="var(--au-muted)" />
              </svg>
            </div>
            <div className="flex items-center shrink-0 gap-[6px] min-h-[44px]">
              <div className="text-[13.5px] leading-[19px] tracking-[-0.008em] inline-block font-['Inter',system-ui,sans-serif] font-[500] text-(--au-body)">
                All four ways
              </div>
              <svg viewBox="0 0 20 20" width="14" height="14" xmlns="http://www.w3.org/2000/svg" style={{ flexShrink: '0' }}>
                <path d="M7 5l6 5-6 5" fill="none" stroke="var(--au-muted)" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round" />
              </svg>
            </div>
          </div>
          <div className="flex items-center [width:100%] py-[7px] px-[16px] gap-[12px] bg-(--au-ground-alt) border-t border-t-solid border-t-(--au-rule)">
            <div className="grow text-[12px] leading-[16px] tracking-[0.14em] inline-block font-['Geist',system-ui,sans-serif] text-(--au-muted-strong)">HOW THEY FOUND YOU</div>
            <div className="w-[96px] shrink-0 text-right text-[12px] leading-[16px] tracking-[0.14em] inline-block font-['Geist',system-ui,sans-serif] text-(--au-muted-strong)">BOOKINGS</div>
            <div className="w-[76px] shrink-0 text-right text-[12px] leading-[16px] tracking-[0.14em] inline-block font-['Geist',system-ui,sans-serif] text-(--au-muted-strong)">VALUE</div>
          </div>
          {/* Row pattern (repeat per channel): name grows; bar track 56×4 slate-tint with slate-deep fill = share of the top row; count 20px right; value 76px right. */}
          <div className="flex items-center [width:100%] py-[10px] px-[16px] gap-[12px] border-t border-t-solid border-t-(--au-rule)">
            <div className="grow text-[14.5px] leading-[21px] tracking-[-0.01em] inline-block font-['Inter',system-ui,sans-serif] font-[500] text-(--au-ink)">Guests searching for you by name</div>
            <div className="flex items-center justify-end w-[96px] shrink-0 gap-[8px]">
              <div className="flex w-[56px] h-[4px] rounded-[2px] shrink-0 bg-(--au-slate-tint)"><div className="[width:100%] h-[4px] rounded-[2px] bg-(--au-slate-deep)" /></div>
              <div className="w-[20px] text-right text-[14.5px] leading-[21px] inline-block shrink-0 font-['Inter',system-ui,sans-serif] font-[500] text-(--au-ink)">17</div>
            </div>
            <div className="w-[76px] shrink-0 text-right text-[13.5px] leading-[20px] inline-block font-['Inter',system-ui,sans-serif] font-[500] text-(--au-muted-strong)">$8,680</div>
          </div>
          <div className="flex items-center [width:100%] py-[10px] px-[16px] gap-[12px] border-t border-t-solid border-t-(--au-rule)">
            <div className="grow text-[14.5px] leading-[21px] tracking-[-0.01em] inline-block font-['Inter',system-ui,sans-serif] font-[500] text-(--au-ink)">Guests comparing room prices</div>
            <div className="flex items-center justify-end w-[96px] shrink-0 gap-[8px]">
              <div className="flex w-[56px] h-[4px] rounded-[2px] shrink-0 bg-(--au-slate-tint)"><div className="w-[round(24%,1px)] h-[4px] rounded-[2px] bg-(--au-slate-deep)" /></div>
              <div className="w-[20px] text-right text-[14.5px] leading-[21px] inline-block shrink-0 font-['Inter',system-ui,sans-serif] font-[500] text-(--au-ink)">4</div>
            </div>
            <div className="w-[76px] shrink-0 text-right text-[13.5px] leading-[20px] inline-block font-['Inter',system-ui,sans-serif] font-[500] text-(--au-muted-strong)">$3,396</div>
          </div>
          <div className="flex items-center [width:100%] py-[10px] px-[16px] gap-[12px] border-t border-t-solid border-t-(--au-rule)">
            <div className="grow text-[14.5px] leading-[21px] tracking-[-0.01em] inline-block font-['Inter',system-ui,sans-serif] font-[500] text-(--au-ink)">Guests looking for a place to stay</div>
            <div className="flex items-center justify-end w-[96px] shrink-0 gap-[8px]">
              <div className="flex w-[56px] h-[4px] rounded-[2px] shrink-0 bg-(--au-slate-tint)"><div className="w-[round(18%,1px)] h-[4px] rounded-[2px] bg-(--au-slate-deep)" /></div>
              <div className="w-[20px] text-right text-[14.5px] leading-[21px] inline-block shrink-0 font-['Inter',system-ui,sans-serif] font-[500] text-(--au-ink)">3</div>
            </div>
            <div className="w-[76px] shrink-0 text-right text-[13.5px] leading-[20px] inline-block font-['Inter',system-ui,sans-serif] font-[500] text-(--au-muted-strong)">$1,819</div>
          </div>
          <div className="flex items-center [width:100%] py-[10px] px-[16px] gap-[12px] border-t border-t-solid border-t-(--au-rule)">
            <div className="grow text-[14.5px] leading-[21px] tracking-[-0.01em] inline-block font-['Inter',system-ui,sans-serif] font-[500] text-(--au-ink)">Guests finding you on the map</div>
            <div className="flex items-center justify-end w-[96px] shrink-0 gap-[8px]">
              <div className="flex w-[56px] h-[4px] rounded-[2px] shrink-0 bg-(--au-slate-tint)" />
              <div className="w-[20px] text-right text-[14.5px] leading-[21px] inline-block shrink-0 font-['Inter',system-ui,sans-serif] font-[500] text-(--au-ink)">0</div>
            </div>
            <div className="w-[76px] shrink-0 text-right text-[13.5px] leading-[20px] inline-block font-['Inter',system-ui,sans-serif] font-[500] text-(--au-muted-strong)">$0</div>
          </div>
          <div className="flex items-center [width:100%] py-[10px] px-[16px] gap-[12px] border-t border-t-solid border-t-(--au-rule-strong)">
            <div className="grow text-[14.5px] leading-[21px] tracking-[-0.01em] inline-block font-['Inter',system-ui,sans-serif] font-[500] text-(--au-ink)">All four ways, together</div>
            <div className="flex items-center justify-end w-[96px] shrink-0 gap-[8px]">
              <div className="w-[20px] text-right text-[14.5px] leading-[21px] inline-block shrink-0 font-['Inter',system-ui,sans-serif] font-[500] text-(--au-ink)">24</div>
            </div>
            <div className="w-[76px] shrink-0 text-right text-[13.5px] leading-[20px] inline-block font-['Inter',system-ui,sans-serif] font-[500] text-(--au-ink)">$13,895</div>
          </div>
          <div className="flex flex-col [width:100%] pt-[14px] pb-[16px] gap-[4px] grow px-[16px] bg-(--au-ground-alt) border-t border-t-solid border-t-(--au-rule)">
            <div className="text-[13.5px] leading-[19px] tracking-[-0.006em] inline-block font-['Inter',system-ui,sans-serif] font-[500] text-(--au-body)">
              Each booking is counted once, under the ad its guest clicked, so the four rows always add up to the 24 above. The map ads started in June and have not brought a booking yet.
            </div>
          </div>
        </div>
        <div className="flex flex-col grow rounded-(--au-r-btn) overflow-clip border border-solid border-(--au-rule)">
          <div className="flex items-baseline justify-between [width:100%] py-[13px] px-[16px] gap-[16px]">
            <div className="flex items-center gap-[7px]">
              <div className="text-[15.5px] leading-caption tracking-[-0.014em] inline-block font-['Inter',system-ui,sans-serif] font-[500] text-(--au-ink)">Where guests come from</div>
              <svg viewBox="0 0 16 16" width="14" height="14" xmlns="http://www.w3.org/2000/svg" style={{ flexShrink: '0' }}>
                <circle cx="8" cy="8" r="6.4" fill="none" stroke="var(--au-muted)" strokeWidth="1.3" />
                <path d="M8 7.2v3.6" fill="none" stroke="var(--au-muted)" strokeWidth="1.5" strokeLinecap="round" />
                <circle cx="8" cy="5" r="0.9" fill="var(--au-muted)" />
              </svg>
            </div>
            <div className="flex items-center shrink-0 gap-[6px] min-h-[44px]">
              <div className="text-[13.5px] leading-[19px] tracking-[-0.008em] inline-block font-['Inter',system-ui,sans-serif] font-[500] text-(--au-body)">All 11 places</div>
              <svg viewBox="0 0 20 20" width="14" height="14" xmlns="http://www.w3.org/2000/svg" style={{ flexShrink: '0' }}>
                <path d="M7 5l6 5-6 5" fill="none" stroke="var(--au-muted)" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round" />
              </svg>
            </div>
          </div>
          <div className="flex items-center [width:100%] py-[7px] px-[16px] gap-[12px] bg-(--au-ground-alt) border-t border-t-solid border-t-(--au-rule)">
            <div className="grow text-[12px] leading-[16px] tracking-[0.14em] inline-block font-['Geist',system-ui,sans-serif] text-(--au-muted-strong)">SEARCHED FROM</div>
            <div className="w-[96px] shrink-0 text-right text-[12px] leading-[16px] tracking-[0.14em] inline-block font-['Geist',system-ui,sans-serif] text-(--au-muted-strong)">BOOKINGS</div>
            <div className="w-[76px] shrink-0 text-right text-[12px] leading-[16px] tracking-[0.14em] inline-block font-['Geist',system-ui,sans-serif] text-(--au-muted-strong)">VALUE</div>
          </div>
          {/* Rows: Boston metro 5 $2,597 (100%) · New Hampshire 3 $2,014 (60%) · Montreal 3 $1,977 (60%) · New York City metro 2 $1,758 (40%) · "7 other places, one or two bookings each" 11 $5,549 (muted name, no bar). Same row markup as the left panel. */}
          <div className="flex items-center [width:100%] py-[10px] px-[16px] gap-[12px] border-t border-t-solid border-t-(--au-rule)">
            <div className="grow text-[14.5px] leading-[21px] tracking-[-0.01em] inline-block font-['Inter',system-ui,sans-serif] font-[500] text-(--au-ink)">Boston metro</div>
            <div className="flex items-center justify-end w-[96px] shrink-0 gap-[8px]">
              <div className="flex w-[56px] h-[4px] rounded-[2px] shrink-0 bg-(--au-slate-tint)"><div className="[width:100%] h-[4px] rounded-[2px] bg-(--au-slate-deep)" /></div>
              <div className="w-[20px] text-right text-[14.5px] leading-[21px] inline-block shrink-0 font-['Inter',system-ui,sans-serif] font-[500] text-(--au-ink)">5</div>
            </div>
            <div className="w-[76px] shrink-0 text-right text-[13.5px] leading-[20px] inline-block font-['Inter',system-ui,sans-serif] font-[500] text-(--au-muted-strong)">$2,597</div>
          </div>
          <div className="flex items-center [width:100%] py-[10px] px-[16px] gap-[12px] border-t border-t-solid border-t-(--au-rule)">
            <div className="grow text-[14.5px] leading-[21px] tracking-[-0.01em] inline-block font-['Inter',system-ui,sans-serif] font-[500] text-(--au-ink)">New Hampshire</div>
            <div className="flex items-center justify-end w-[96px] shrink-0 gap-[8px]">
              <div className="flex w-[56px] h-[4px] rounded-[2px] shrink-0 bg-(--au-slate-tint)"><div className="w-[round(60%,1px)] h-[4px] rounded-[2px] bg-(--au-slate-deep)" /></div>
              <div className="w-[20px] text-right text-[14.5px] leading-[21px] inline-block shrink-0 font-['Inter',system-ui,sans-serif] font-[500] text-(--au-ink)">3</div>
            </div>
            <div className="w-[76px] shrink-0 text-right text-[13.5px] leading-[20px] inline-block font-['Inter',system-ui,sans-serif] font-[500] text-(--au-muted-strong)">$2,014</div>
          </div>
          <div className="flex items-center [width:100%] py-[10px] px-[16px] gap-[12px] border-t border-t-solid border-t-(--au-rule)">
            <div className="grow text-[14.5px] leading-[21px] tracking-[-0.01em] inline-block font-['Inter',system-ui,sans-serif] font-[500] text-(--au-ink)">Montreal</div>
            <div className="flex items-center justify-end w-[96px] shrink-0 gap-[8px]">
              <div className="flex w-[56px] h-[4px] rounded-[2px] shrink-0 bg-(--au-slate-tint)"><div className="w-[round(60%,1px)] h-[4px] rounded-[2px] bg-(--au-slate-deep)" /></div>
              <div className="w-[20px] text-right text-[14.5px] leading-[21px] inline-block shrink-0 font-['Inter',system-ui,sans-serif] font-[500] text-(--au-ink)">3</div>
            </div>
            <div className="w-[76px] shrink-0 text-right text-[13.5px] leading-[20px] inline-block font-['Inter',system-ui,sans-serif] font-[500] text-(--au-muted-strong)">$1,977</div>
          </div>
          <div className="flex items-center [width:100%] py-[10px] px-[16px] gap-[12px] border-t border-t-solid border-t-(--au-rule)">
            <div className="grow text-[14.5px] leading-[21px] tracking-[-0.01em] inline-block font-['Inter',system-ui,sans-serif] font-[500] text-(--au-ink)">New York City metro</div>
            <div className="flex items-center justify-end w-[96px] shrink-0 gap-[8px]">
              <div className="flex w-[56px] h-[4px] rounded-[2px] shrink-0 bg-(--au-slate-tint)"><div className="w-[round(40%,1px)] h-[4px] rounded-[2px] bg-(--au-slate-deep)" /></div>
              <div className="w-[20px] text-right text-[14.5px] leading-[21px] inline-block shrink-0 font-['Inter',system-ui,sans-serif] font-[500] text-(--au-ink)">2</div>
            </div>
            <div className="w-[76px] shrink-0 text-right text-[13.5px] leading-[20px] inline-block font-['Inter',system-ui,sans-serif] font-[500] text-(--au-muted-strong)">$1,758</div>
          </div>
          <div className="flex items-center [width:100%] py-[10px] px-[16px] gap-[12px] border-t border-t-solid border-t-(--au-rule)">
            <div className="grow text-[14.5px] leading-[21px] tracking-[-0.01em] inline-block font-['Inter',system-ui,sans-serif] font-[500] text-(--au-muted-strong)">7 other places, one or two bookings each</div>
            <div className="flex items-center justify-end w-[96px] shrink-0">
              <div className="w-[20px] text-right text-[14.5px] leading-[21px] inline-block shrink-0 font-['Inter',system-ui,sans-serif] font-[500] text-(--au-ink)">11</div>
            </div>
            <div className="w-[76px] shrink-0 text-right text-[13.5px] leading-[20px] inline-block font-['Inter',system-ui,sans-serif] font-[500] text-(--au-muted-strong)">$5,549</div>
          </div>
          <div className="flex flex-col [width:100%] pt-[14px] pb-[16px] gap-[4px] grow px-[16px] bg-(--au-ground-alt) border-t border-t-solid border-t-(--au-rule)">
            <div className="text-[13.5px] leading-[19px] tracking-[-0.006em] inline-block font-['Inter',system-ui,sans-serif] font-[500] text-(--au-body)">
              Where each guest was when they searched, not where they live, so the eleven places add up to the 24 above.
            </div>
          </div>
        </div>
      </div>
      <div className="flex flex-col [width:100%] pt-[20px]">
        <div className="flex flex-col [width:100%] rounded-(--au-r-btn) overflow-clip border border-solid border-(--au-rule)">
          <div className="flex items-baseline justify-between [width:100%] py-[13px] px-[16px] gap-[16px]">
            <div className="flex items-baseline gap-[12px]">
              <div className="flex items-center gap-[7px]">
                <div className="text-[15.5px] leading-caption tracking-[-0.014em] inline-block font-['Inter',system-ui,sans-serif] font-[500] text-(--au-ink)">The bookings themselves</div>
                <svg viewBox="0 0 16 16" width="14" height="14" xmlns="http://www.w3.org/2000/svg" style={{ flexShrink: '0' }}>
                  <circle cx="8" cy="8" r="6.4" fill="none" stroke="var(--au-muted)" strokeWidth="1.3" />
                  <path d="M8 7.2v3.6" fill="none" stroke="var(--au-muted)" strokeWidth="1.5" strokeLinecap="round" />
                  <circle cx="8" cy="5" r="0.9" fill="var(--au-muted)" />
                </svg>
              </div>
              <div className="text-[13.5px] leading-[19px] tracking-[-0.008em] inline-block font-['Inter',system-ui,sans-serif] font-[500] text-(--au-muted-strong)">The 6 most recent of 24 · newest first</div>
            </div>
            <div className="flex items-center shrink-0 gap-[6px] min-h-[44px]">
              <div className="text-[13.5px] leading-[19px] tracking-[-0.008em] inline-block font-['Inter',system-ui,sans-serif] font-[500] text-(--au-body)">All 24 bookings</div>
              <svg viewBox="0 0 20 20" width="14" height="14" xmlns="http://www.w3.org/2000/svg" style={{ flexShrink: '0' }}>
                <path d="M7 5l6 5-6 5" fill="none" stroke="var(--au-muted)" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round" />
              </svg>
            </div>
          </div>
          <div className="flex items-center [width:100%] py-[7px] px-[16px] gap-[20px] bg-(--au-ground-alt) border-t border-t-solid border-t-(--au-rule)">
            <div className="w-[150px] shrink-0 text-[12px] leading-[16px] tracking-[0.14em] inline-block font-['Geist',system-ui,sans-serif] text-(--au-muted-strong)">BOOKED</div>
            <div className="w-[150px] shrink-0 text-[12px] leading-[16px] tracking-[0.14em] inline-block font-['Geist',system-ui,sans-serif] text-(--au-muted-strong)">ARRIVING</div>
            <div className="w-[70px] shrink-0 text-right text-[12px] leading-[16px] tracking-[0.14em] inline-block font-['Geist',system-ui,sans-serif] text-(--au-muted-strong)">NIGHTS</div>
            <div className="w-[100px] shrink-0 text-right text-[12px] leading-[16px] tracking-[0.14em] inline-block font-['Geist',system-ui,sans-serif] text-(--au-muted-strong)">VALUE</div>
            <div className="grow inline-block pl-[44px]"><div className="inline-block text-[12px] tracking-[0.14em] leading-[16px] font-['Geist',system-ui,sans-serif] text-(--au-muted-strong)">GUEST CAME FROM</div></div>
            <div className="w-[220px] shrink-0 text-[12px] leading-[16px] tracking-[0.14em] inline-block font-['Geist',system-ui,sans-serif] text-(--au-muted-strong)">HOW THEY FOUND YOU</div>
          </div>
          {/* Row pattern (6 most recent, newest first). Data from getRecentBookings(period, 6): booked_at, check_in, nights, totalValueCents, feeder_market, campaignName.
              Aug 26 · Aug 31 · 2 · $668 · Montreal · Searched for you by name
              Aug 25 · Sep 3  · 2 · $428 · Hartford / central CT · Searched for you by name
              Aug 20 · Dec 18 · 3 · $864 · Boston metro · Searched for you by name
              Aug 20 · Sep 1  · 2 · $688 · Boston metro · Compared room prices
              Aug 17 · Aug 29 · 1 · $334 · Boston metro · Looked for a place to stay
              Aug 5  · Oct 31 · 2 · $598 · Burlington & Vermont · Searched for you by name */}
          <div className="flex items-center [width:100%] py-[9px] px-[16px] gap-[20px] border-t border-t-solid border-t-(--au-rule)">
            <div className="w-[150px] shrink-0 tracking-[-0.012em] inline-block font-['Inter',system-ui,sans-serif] font-[500] text-(--au-body) text-caption/caption">Aug 26</div>
            <div className="w-[150px] shrink-0 tracking-[-0.012em] inline-block font-['Inter',system-ui,sans-serif] font-[500] text-(--au-body) text-caption/caption">Aug 31</div>
            <div className="w-[70px] shrink-0 text-right tracking-[-0.012em] inline-block font-['Inter',system-ui,sans-serif] font-[500] text-(--au-body) text-caption/caption">2</div>
            <div className="w-[100px] shrink-0 text-right tracking-[-0.012em] inline-block font-['Inter',system-ui,sans-serif] font-[500] text-(--au-ink) text-caption/caption">$668</div>
            <div className="grow inline-block pl-[44px]"><div className="inline-block tracking-[-0.012em] font-['Inter',system-ui,sans-serif] font-[500] text-(--au-body) text-caption/caption">Montreal</div></div>
            <div className="w-[220px] shrink-0 text-[14px] leading-[20px] tracking-[-0.01em] inline-block font-['Inter',system-ui,sans-serif] font-[500] text-(--au-body)">Searched for you by name</div>
          </div>
          <div className="flex flex-col [width:100%] pt-[14px] pb-[16px] gap-[4px] px-[16px] bg-(--au-ground-alt) border-t border-t-solid border-t-(--au-rule)">
            <div className="text-[13.5px] leading-[19px] tracking-[-0.006em] inline-block w-[760px] font-['Inter',system-ui,sans-serif] font-[500] text-(--au-body)">
              Every row carries the two dates you can look up in your own booking system, the day it was booked and the day the guest arrives, plus the ad the guest clicked before booking.
            </div>
          </div>
        </div>
      </div>
      <div className="flex justify-between [width:100%] pt-[20px] items-start gap-[64px]">
        <div className="flex w-[600px] shrink-0 pt-[18px] pb-[20px] rounded-(--au-r-card) gap-[8px] flex-col px-[22px] bg-(--au-ink-ground)">
          <div className="flex items-start gap-[8px] flex-col justify-end">
            <div className="flex items-center gap-[6px]">
              <div className="text-[12px] leading-[16px] tracking-[0.18em] inline-block font-['Geist',system-ui,sans-serif] text-(--au-on-ink-muted)">OCCUPANCY</div>
              <svg viewBox="0 0 16 16" width="14" height="14" xmlns="http://www.w3.org/2000/svg" style={{ flexShrink: '0' }}>
                <circle cx="8" cy="8" r="6.4" fill="none" stroke="var(--au-on-ink-muted)" strokeWidth="1.3" />
                <path d="M8 7.2v3.6" fill="none" stroke="var(--au-on-ink-muted)" strokeWidth="1.5" strokeLinecap="round" />
                <circle cx="8" cy="5" r="0.9" fill="var(--au-on-ink-muted)" />
              </svg>
            </div>
            <div className="text-[28px] leading-[32px] tracking-[-0.024em] inline-block font-['Inter',system-ui,sans-serif] font-[500] text-(--au-on-ink)">
              585 of 1,080 room nights sold. 54% full.
            </div>
          </div>
          <div className="text-[14px] leading-[20px] tracking-[-0.01em] inline-block font-['Inter',system-ui,sans-serif] font-[500] text-(--au-on-ink-muted)">
            72 of those nights came from guests we brought, counted by the night they stayed.
          </div>
        </div>
        <div className="flex flex-col items-end grow basis-[0%] pt-[4px] gap-[16px]">
          <div className="w-[420px] text-right text-[14.5px] leading-caption tracking-[-0.01em] inline-block font-['Inter',system-ui,sans-serif] font-[500] text-(--au-muted-strong)">
            Nothing here needs anything from you. If a number looks wrong, ask. A person answers, not a form.
          </div>
          <div className="flex items-center py-[12px] px-[18px] rounded-(--au-r-btn) gap-[10px] bg-(--au-ink)">
            <div className="text-[14.5px] leading-[20px] tracking-[-0.01em] inline-block w-max shrink-0 font-['Inter',system-ui,sans-serif] font-[500] text-(--au-on-ink)">Ask about a number</div>
            <svg viewBox="0 0 16 16" width="14" height="14" xmlns="http://www.w3.org/2000/svg" style={{ flexShrink: '0' }}>
              <path d="M3 8h10M9 4l4 4-4 4" fill="none" stroke="var(--au-on-ink)" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round" />
            </svg>
          </div>
        </div>
      </div>
    </div>
)
