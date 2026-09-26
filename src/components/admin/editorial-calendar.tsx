import Link from "next/link";
import { Typography } from "@/components/ui";
import { StatusBadge } from "@/components/admin/status-badge";
import type { AdminCalendarDay } from "@/domain/admin";
import type { MeditationStatus } from "@/domain/meditation";
import { ADMIN_ROUTES } from "@/constants/routes";
import { cn, formatMonthYear } from "@/lib/utils";
import { statusLabel } from "@/services/admin";

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
  // Lundi = 0
  return (date.getDay() + 6) % 7;
}

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

  return (
    <div>
      <div className="mb-6 flex flex-wrap items-end justify-between gap-4 border-b border-ms-black pb-4">
        <div>
          <Typography variant="label" className="mb-2 text-ms-gold-dark">
            Calendrier éditorial
          </Typography>
          <Typography variant="title" as="h2" className="capitalize">
            {formatMonthYear(`${yearMonth}-01`)}
          </Typography>
        </div>
        <div className="flex gap-4">
          <Link
            href={prevHref}
            className="text-[length:var(--ms-text-xs)] uppercase tracking-[var(--ms-tracking-wider)] text-ms-fg no-underline hover:underline"
          >
            ← Mois précédent
          </Link>
          <Link
            href={nextHref}
            className="text-[length:var(--ms-text-xs)] uppercase tracking-[var(--ms-tracking-wider)] text-ms-fg no-underline hover:underline"
          >
            Mois suivant →
          </Link>
        </div>
      </div>

      <ul className="mb-6 flex flex-wrap gap-x-6 gap-y-2" aria-label="Légende">
        {legend.map((item) => (
          <li key={item.status} className="flex items-center gap-2">
            <StatusBadge status={item.status} />
          </li>
        ))}
      </ul>

      <div
        className="hidden grid-cols-7 gap-px border border-ms-black bg-ms-black sm:grid"
        role="grid"
        aria-label={`Calendrier ${yearMonth}`}
      >
        {["Lun", "Mar", "Mer", "Jeu", "Ven", "Sam", "Dim"].map((d) => (
          <div
            key={d}
            className="bg-ms-off-white px-2 py-2 text-[length:var(--ms-text-2xs)] font-medium uppercase tracking-[var(--ms-tracking-widest)] text-ms-muted"
          >
            {d}
          </div>
        ))}
        {cells.map((date, i) => {
          if (!date) {
            return (
              <div key={`pad-${i}`} className="min-h-[5.5rem] bg-ms-paper" />
            );
          }
          const items = byDate.get(date) ?? [];
          const dayNum = Number(date.slice(-2));
          return (
            <div
              key={date}
              role="gridcell"
              className={cn(
                "min-h-[5.5rem] bg-ms-off-white p-2",
                items.length > 0 && "bg-ms-paper",
              )}
            >
              <p className="font-sans text-xs font-semibold tabular-nums text-ms-fg">
                {dayNum}
              </p>
              <ul className="mt-1 space-y-1">
                {items.map((item) => (
                  <li key={item.id}>
                    <Link
                      href={ADMIN_ROUTES.meditations}
                      className="block no-underline"
                      title={`${statusLabel(item.status)} — ${item.title}`}
                    >
                      <span className="line-clamp-2 text-[10px] font-medium leading-tight text-ms-fg hover:underline">
                        {item.title}
                      </span>
                      <span className="mt-0.5 block text-[9px] uppercase tracking-wider text-ms-muted">
                        {statusLabel(item.status)}
                      </span>
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
          );
        })}
      </div>

      {/* Liste mobile — densifiée */}
      <ul className="divide-y divide-ms-border border-y border-ms-black sm:hidden">
        {allDates
          .filter((d) => (byDate.get(d)?.length ?? 0) > 0)
          .map((date) => (
            <li key={date} className="py-3">
              <Typography variant="date" dateTime={date} className="mb-2">
                {date}
              </Typography>
              <ul className="space-y-2">
                {(byDate.get(date) ?? []).map((item) => (
                  <li
                    key={item.id}
                    className="flex items-baseline justify-between gap-3"
                  >
                    <span className="text-sm font-medium">{item.title}</span>
                    <StatusBadge status={item.status} />
                  </li>
                ))}
              </ul>
            </li>
          ))}
      </ul>
    </div>
  );
}
