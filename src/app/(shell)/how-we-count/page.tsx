import type { Metadata } from "next";

export const metadata: Metadata = { title: "How we count — Autumn" };

/**
 * One static page, under 200 words, only facts already on the sheets and in
 * the brief. No new terms, no new numbers.
 */
export default function HowWeCount() {
  return (
    <div className="w-full max-w-[1216px] flex flex-col grow pt-[20px] pb-[48px] px-[24px] xl:px-[32px] rounded-(--au-r-card) bg-(--au-ground) border border-solid border-(--au-rule)">
      <p className="min-h-[44px] flex items-center">
        <span className="text-[12px] leading-[16px] tracking-[0.18em] font-label uppercase text-(--au-ink)">
          How we count
        </span>
      </p>
      <div className="flex flex-col max-w-[680px] gap-[16px] pt-[16px]">
        <h1 className="text-[34px] leading-[42px] sm:text-[40px] sm:leading-[46px] tracking-[-0.024em] text-(--au-ink)">
          Every number here is a booking you can look up.
        </h1>
        <p className="text-[16.5px] leading-[25px] tracking-[-0.016em] text-(--au-body)">
          A booking counts once it is confirmed, and it is counted once, under
          the ad its guest clicked before booking. Guests who found you on
          their own are not counted. Cancelled bookings are taken out and are
          never billed. A booking&rsquo;s value is the room revenue on the
          reservation, in whole dollars.
        </p>
        <p className="text-[16.5px] leading-[25px] tracking-[-0.016em] text-(--au-body)">
          Google confirms a booking a few days after it is made, so your
          results say the date they are reported through, and a booking made
          yesterday may not be on the sheet yet. Where a guest came from is
          where they were when they searched, not where they live.
        </p>
        <p className="text-[16.5px] leading-[25px] tracking-[-0.016em] text-(--au-body)">
          Rooms filled counts every night sold at the whole house, from every
          source, by the night the guest stayed. Comparisons set your dates
          against the same dates last year, and the four ways, the places and
          the ledger always add back up to the same bookings.
        </p>
        <p className="text-caption tracking-[-0.012em] text-(--au-muted-strong)">
          A number that doesn&rsquo;t look right? Use Ask about a number in the
          corner and your team will trace it with you.
        </p>
      </div>
    </div>
  );
}
