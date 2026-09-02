import type { Metadata } from "next";
import Link from "next/link";

export const metadata: Metadata = { title: "Signed out — Autumn" };

/**
 * Plain on purpose: no sidebar, no numbers, one door back in.
 */
export default function SignedOut() {
  return (
    <main className="flex min-h-dvh flex-col items-center justify-center bg-(--au-ground-warm) px-[24px]">
      <div className="flex w-full max-w-[440px] flex-col gap-[12px] rounded-(--au-r-card) border border-solid border-(--au-rule) bg-(--au-ground) px-[32px] py-[36px]">
        <p className="flex items-center gap-[7px] text-[19px] leading-[24px] tracking-[-0.02em] text-(--au-ink)">
          <svg
            viewBox="0 0 20 20"
            width="18"
            height="18"
            aria-hidden="true"
            focusable="false"
          >
            <path
              d="M10 2c3 2.2 6 4.4 6 8.2 0 3.4-2.7 6-6 6s-6-2.6-6-6C4 6.4 7 4.2 10 2Z"
              fill="var(--au-ink)"
            />
          </svg>
          autumn
        </p>
        <h1 className="text-[26px] leading-[33px] tracking-[-0.022em] text-(--au-ink) pt-[6px]">
          You&rsquo;re signed out.
        </h1>
        <p className="text-[16px] leading-[24px] tracking-[-0.014em] text-(--au-body)">
          Your results are safe and will be here when you come back.
        </p>
        <p className="pt-[6px]">
          <Link href="/" className="au-door text-[16px] tracking-[-0.014em] underline underline-offset-[3px]">
            Sign back in
          </Link>
        </p>
      </div>
    </main>
  );
}
