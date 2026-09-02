import { PROPERTY } from "../../../db/params";
import { Sidebar } from "@/components/Sidebar";
import { spokenTown } from "@/lib/owner";

/**
 * The signed-in shell: sticky 216px sidebar on warm ground, the sheet beside
 * it. The property name comes from the same constants that seeded its row,
 * so the shell paints before Neon has woken up and never shifts. Below
 * 1024px the rail becomes a top strip with one menu button that opens the
 * whole rail as a sheet. The signed-out page lives outside this shell on purpose.
 */
export default function ShellLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const askEmail = process.env.ASK_EMAIL;
  const town = spokenTown(PROPERTY.town);

  return (
    <>
      <a
        href="#results"
        className="absolute top-[8px] left-[8px] z-50 inline-flex min-h-[44px] -translate-y-[200%] items-center rounded-[6px] border border-solid border-(--au-rule-strong) bg-(--au-ground) px-[16px] text-[16px] text-(--au-ink) no-underline focus-visible:translate-y-0"
      >
        Skip to the numbers
      </a>

      <div className="flex min-h-dvh flex-col bg-(--au-ground-warm) lg:flex-row">
        <Sidebar propertyName={PROPERTY.name} town={town} askEmail={askEmail} />

        <div className="flex min-w-0 grow flex-col">
          <main
            id="results"
            className="flex min-w-0 grow flex-col items-center px-[16px] pt-[16px] pb-[24px] lg:px-[24px]"
          >
            {children}
          </main>

        </div>
      </div>
    </>
  );
}
