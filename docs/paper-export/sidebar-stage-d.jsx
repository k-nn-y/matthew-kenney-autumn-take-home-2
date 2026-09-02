// Paper export of the Stage D sidebar (screen 1 variant; screen 2 swaps the active pill to "How it happened").
// Tailwind-style arbitrary values are exact. Tokens resolve via docs/paper-export/tokens.css.
// Build notes: the rail is position: sticky, height 100vh; nav rows are anchors with aria-current="page";
// utility rows are anchors 44px tall; below 1024px the rail becomes a top strip (see AUDIT_REPORT.md §5).
(
    <div className="[font-synthesis:none] wrap-anywhere text-[12px] leading-[16px] flex flex-col w-[216px] shrink-0 [align-self:start] pt-[22px] pb-[24px] h-[900px] px-[16px] bg-(--au-ground-warm) antialiased">
      <div className="flex items-center pl-[4px]">
        {/* Autumn wordmark: reuse the site's SVG component; viewBox 0 0 106 16, fill var(--au-ink) */}
      </div>
      <div className="flex flex-col pt-[28px] px-[4px]">
        <div className="text-[16px] leading-[24px] tracking-[-0.016em] inline-block font-['Inter',system-ui,sans-serif] font-[500] text-(--au-ink)">
          The Brass Lantern Inn
        </div>
        <div className="text-[14.5px] leading-[20px] tracking-[-0.01em] inline-block font-['Inter',system-ui,sans-serif] font-[500] text-(--au-muted-strong)">
          Stowe, Vermont
        </div>
      </div>
      <div className="flex flex-col pt-[32px] gap-[4px]">
        <div className="flex flex-col rounded-[6px] h-[44px] justify-center shrink-0 px-[12px] bg-(--au-ground) border border-solid border-(--au-rule)">
          <div className="text-[16px] leading-[24px] tracking-[-0.016em] inline-block font-['Inter',system-ui,sans-serif] font-[500] text-(--au-ink)">
            Your results
          </div>
        </div>
        <div className="flex flex-col rounded-[6px] h-[44px] justify-center shrink-0 px-[12px]">
          <div className="text-[16px] leading-[24px] tracking-[-0.016em] inline-block font-['Inter',system-ui,sans-serif] font-[500] text-(--au-body)">
            How it happened
          </div>
        </div>
      </div>
      <div className="flex flex-col mt-auto">
        <div className="flex flex-col">
          <div className="text-[14.5px] leading-[44px] tracking-[-0.01em] inline-block px-[12px] font-['Inter',system-ui,sans-serif] font-[500] text-(--au-body)">
            Ask about a number
          </div>
          <div className="text-[14.5px] leading-[44px] tracking-[-0.01em] inline-block px-[12px] font-['Inter',system-ui,sans-serif] font-[500] text-(--au-muted-strong)">
            How we count
          </div>
          <div className="text-[14.5px] leading-[44px] tracking-[-0.01em] inline-block px-[12px] font-['Inter',system-ui,sans-serif] font-[500] text-(--au-muted-strong)">
            Your agreement
          </div>
          <div className="[width:100%] h-px mt-[8px] mb-[8px] shrink-0 bg-(--au-rule)" />
          <div className="text-[14.5px] leading-[44px] tracking-[-0.01em] inline-block px-[12px] font-['Inter',system-ui,sans-serif] font-[500] text-(--au-muted-strong)">
            Sign out
          </div>
        </div>
      </div>
    </div>
)
