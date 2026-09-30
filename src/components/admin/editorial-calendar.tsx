import Link from "next/link";
import { ChevronLeft, ChevronRight } from "lucide-react";
import { StatusBadge } from "@/components/admin/status-badge";
import type { AdminCalendarDay } from "@/domain/admin";
import type { MeditationStatus } from "@/domain/meditation";
import { ADMIN_ROUTES } from "@/constants/routes";
import { cn, formatMonthYear } from "@/lib/utils";

function padMonthDays(yearMonth: string): string[] {
  const parts = yearMonth.split("-");
  const y = Number(parts[0]);
  const m = Number(parts[1]);
  const last = new Date(y, m, 0).getDate();
  const days: string[] = [];
  for (let d = 1; d <= last; d++) {
    days.push(`${yearMonth}-${String(d).padStart(2, "0")}`);
  }
  return days;
}

function weekdayIndex(iso: string): number {
  const date = new Date(`${iso}T12:00:00`);
  return (date.getDay() + 6) % 7;
}

const WEEKDAYS = ["Lun", "Mar", "Mer", "Jeu", "Ven", "Sam", "Dim"];

export function EditorialCalendar({
  yearMonth,
  days,
  legend,
  prevHref,
  nextHref,
}: {
  yearMonth: string;
  days: AdminCalendarDay[];
  legend: Array<{ status: MeditationStatus; label: string }>;
  prevHref: string;
  nextHref: string;
}) {
  const byDate = new Map(days.map((d) => [d.date, d.items]));
  const allDates = padMonthDays(yearMonth);
  const startPad = weekdayIndex(allDates[0]!);
  const cells: Array<string | null> = [
    ...Array.from({ length: startPad }, () => null),
    ...allDates,
  ];
  const today = new Date();
  const todayIso = `${today.getFullYear()}-${String(today.getMonth() + 1).padStart(2, "0")}-${String(today.getDate()).padStart(2, "0")}`;

  return (
    <div className="ios-ui space-y-4">
      <section className="overflow-hidden rounded-3xl bg-white shadow-[0_1px_2px_rgba(26,26,26,0.05)]">
        <div className="flex items-center justify-between gap-3 px-4 py-3">
          <h2 className="text-[20px] font-semibold capitalize tracking-tight text-ms-black">
            {formatMonthYear(`${yearMonth}-01`)}
          </h2>
          <div className="flex gap-2">
            <Link
              href={prevHref}
              aria-label="Mois précédent"
              className="flex h-9 w-9 items-center justify-center rounded-full bg-ms-gold/15 text-ms-black no-underline hover:bg-ms-gold/30"
            >
              <ChevronLeft size={18} aria-hidden />
            </Link>
            <Link
              href={nextHref}
              aria-label="Mois suivant"
              className="flex h-9 w-9 items-center justify-center rounded-full bg-ms-gold/15 text-ms-black no-underline hover:bg-ms-gold/30"
            >
              <ChevronRight size={18} aria-hidden />
            </Link>
          </div>
        </div>

        <ul className="flex flex-wrap gap-2 border-t border-ms-gold/15 px-4 py-3" aria-label="Légende">
          {legend.map((item) => (
            <li key={item.status}>
              <StatusBadge status={item.status} />
            </li>
          ))}
        </ul>

        <div
          className="grid grid-cols-7 gap-1 px-2 pb-3 sm:px-3"
          role="grid"
          aria-label={`Calendrier ${yearMonth}`}
        >
          {WEEKDAYS.map((d) => (
            <div
              key={d}
              className="px-1 py-1 text-center text-[11px] font-semibold uppercase tracking-wide text-ms-gray-600"
            >
              {d}
            </div>
          ))}
          {cells.map((date, i) => {
            if (!date) {
              return <div key={`pad-${i}`} className="min-h-16 rounded-2xl bg-ms-cream-deep/40 sm:min-h-24" />;
            }
            const items = byDate.get(date) ?? [];
            const dayNum = Number(date.slice(-2));
            const isToday = date === todayIso;
            return (
              <div
                key={date}
                role="gridcell"
                className={cn(
                  "min-h-16 rounded-2xl p-1.5 sm:min-h-24 sm:p-2",
                  items.length > 0 ? "bg-ms-gold/10" : "bg-ms-cream-deep/50",
                )}
              >
                <p
                  className={cn(
                    "inline-flex h-6 min-w-6 items-center justify-center rounded-full px-1 text-[12px] font-semibold tabular-nums",
                    isToday ? "bg-ms-gold text-ms-black" : "text-ms-black",
                  )}
                >
                  {dayNum}
                </p>
                <ul className="mt-1 hidden space-y-1 sm:block">
                  {items.map((item) => (
                    <li key={item.id}>
                      <Link
                        href={ADMIN_ROUTES.meditations}
                        className="block truncate text-[11px] font-medium text-ms-black no-underline hover:text-ms-gold-dark"
                        title={item.title}
                      >
                        {item.title}
                      </Link>
                    </li>
                  ))}
                </ul>
                {items.length > 0 ? (
                  <span className="mt-1 block h-1.5 w-1.5 rounded-full bg-ms-gold sm:hidden" aria-hidden />
                ) : null}
              </div>
            );
          })}
        </div>
      </section>

      <ul className="overflow-hidden rounded-3xl bg-white shadow-[0_1px_2px_rgba(26,26,26,0.05)] sm:hidden">
        {allDates.filter((d) => (byDate.get(d)?.length ?? 0) > 0).length === 0 ? (
          <li className="px-4 py-5 text-[15px] text-ms-gray-600">
            Aucune méditation ce mois-ci.
          </li>
        ) : (
          allDates
            .filter((d) => (byDate.get(d)?.length ?? 0) > 0)
            .map((date) => (
              <li key={date} className="border-b border-black/5 px-4 py-3 last:border-b-0">
                <p className="text-[13px] font-medium text-ms-gray-600">{date}</p>
                <ul className="mt-2 space-y-2">
                  {(byDate.get(date) ?? []).map((item) => (
                    <li key={item.id} className="flex items-center justify-between gap-3">
                      <span className="min-w-0 truncate text-[16px] font-medium text-ms-black">
                        {item.title}
                      </span>
                      <StatusBadge status={item.status} />
                    </li>
                  ))}
                </ul>
              </li>
            ))
        )}
      </ul>
    </div>
  );
}
