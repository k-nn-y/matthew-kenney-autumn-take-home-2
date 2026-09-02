import type { Metadata } from "next";

export const metadata: Metadata = { title: "Your agreement — Autumn" };

/**
 * One static page, under 200 words, only facts already on the sheets and in
 * the brief: 13% on driven bookings only, nothing fixed, nothing monthly,
 * ad spend paid by Autumn.
 */
export default function YourAgreement() {
  return (
    <div className="w-full max-w-[1216px] flex flex-col grow pt-[20px] pb-[48px] px-[24px] xl:px-[32px] rounded-(--au-r-card) bg-(--au-ground) border border-solid border-(--au-rule)">
      <p className="min-h-[44px] flex items-center">
        <span className="text-[12px] leading-[16px] tracking-[0.18em] font-label uppercase text-(--au-ink)">
          Your agreement
        </span>
      </p>
      <div className="flex flex-col max-w-[680px] gap-[16px] pt-[16px]">
        <h1 className="text-[34px] leading-[42px] sm:text-[40px] sm:leading-[46px] tracking-[-0.024em] text-(--au-ink)">
          You pay 13% of a booking we brought. That is the whole agreement.
        </h1>
        <p className="text-[16.5px] leading-[25px] tracking-[-0.016em] text-(--au-body)">
          Autumn&rsquo;s fee is 13% of the value of a booking its ads brought
          to your own website, and only those bookings. Nothing fixed, nothing
          monthly: a month with no bookings from the ads is a month you pay
          nothing.
        </p>
        <p className="text-[16.5px] leading-[25px] tracking-[-0.016em] text-(--au-body)">
          The ads themselves are paid for by Autumn. What Google charges to
          show them never appears on your bill, and your results show that
          spend so you can see it next to what it brought in. Cancelled
          bookings are taken out and are never billed.
        </p>
        <p className="text-[16.5px] leading-[25px] tracking-[-0.016em] text-(--au-body)">
          Every booking on the ledger carries the date it was made and the
          date the guest arrives, so you can check each one against your own
          booking system before you pay a dollar on it.
        </p>
        <p className="text-caption tracking-[-0.012em] text-(--au-muted-strong)">
          Questions about a charge? Use Ask about a number in the corner and
          your team will walk through it with you.
        </p>
      </div>
    </div>
  );
}
