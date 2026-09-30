import Link from "next/link";
import { ChevronRight } from "lucide-react";
import type { AnalyticsDashboard, PeriodCounts } from "@/domain/analytics";
import { PUBLIC_ROUTES } from "@/constants/routes";

function PeriodCard({
  title,
  counts,
}: {
  title: string;
  counts: PeriodCounts;
}) {
  const cells = [
    { label: "Pages vues", value: counts.pageViews },
    { label: "Sessions", value: counts.uniqueSessions },
    { label: "Téléchargements", value: counts.downloads },
  ];

  return (
    <section className="rounded-3xl bg-white p-4 shadow-[0_1px_2px_rgba(26,26,26,0.05)]">
      <h2 className="text-[15px] font-semibold text-ms-black">{title}</h2>
      <dl className="mt-3 grid grid-cols-3 gap-2">
        {cells.map((cell) => (
          <div key={cell.label} className="rounded-2xl bg-ms-cream-deep/70 px-3 py-3">
            <dd className="text-[22px] font-semibold leading-none tabular-nums text-ms-black">
              {cell.value.toLocaleString("fr-FR")}
            </dd>
            <dt className="mt-1 text-[12px] text-ms-gray-600">{cell.label}</dt>
          </div>
        ))}
      </dl>
    </section>
  );
}

function DailyBars({ daily }: { daily: AnalyticsDashboard["daily"] }) {
  const max = Math.max(1, ...daily.map((d) => d.pageViews));

  return (
    <section className="rounded-3xl bg-white p-4 shadow-[0_1px_2px_rgba(26,26,26,0.05)]">
      <h2 className="text-[15px] font-semibold text-ms-black">14 derniers jours</h2>
      <p className="mt-1 text-[13px] text-ms-gray-600">
        Barre or : pages vues. Trait sombre : sessions.
      </p>
      <ul className="mt-4 flex items-end gap-1">
        {daily.map((d) => {
          const h = Math.round((d.pageViews / max) * 100);
          const sessionH = Math.round((d.uniqueSessions / max) * 100);
          return (
            <li
              key={d.date}
              className="flex min-w-0 flex-1 flex-col items-center gap-1"
              title={`${d.date} — ${d.pageViews} vues, ${d.uniqueSessions} sessions`}
            >
              <div className="relative flex h-28 w-full items-end justify-center">
                <span
                  className="absolute bottom-0 w-1 rounded-full bg-ms-black/70"
                  style={{ height: `${Math.max(sessionH, d.uniqueSessions ? 4 : 0)}%` }}
                  aria-hidden
                />
                <span
                  className="w-2.5 max-w-full rounded-full bg-ms-gold"
                  style={{ height: `${Math.max(h, d.pageViews ? 4 : 0)}%` }}
                  aria-hidden
                />
              </div>
              <span className="text-[10px] tabular-nums text-ms-gray-600">{d.date.slice(8)}</span>
            </li>
          );
        })}
      </ul>
    </section>
  );
}

function StatList({
  title,
  rows,
}: {
  title: string;
  rows: Array<{ label: string; value: number }>;
}) {
  return (
    <section className="overflow-hidden rounded-3xl bg-white shadow-[0_1px_2px_rgba(26,26,26,0.05)]">
      <h2 className="px-4 py-3 text-[15px] font-semibold text-ms-black">{title}</h2>
      <dl className="border-t border-ms-gold/15">
        {rows.map((row) => (
          <div
            key={row.label}
            className="flex items-center justify-between gap-4 border-b border-black/5 px-4 py-3 last:border-b-0"
          >
            <dt className="text-[15px] text-ms-gray-700">{row.label}</dt>
            <dd className="text-[16px] font-semibold tabular-nums text-ms-black">
              {row.value.toLocaleString("fr-FR")}
            </dd>
          </div>
        ))}
      </dl>
    </section>
  );
}

export function AnalyticsDashboardView({ data }: { data: AnalyticsDashboard }) {
  return (
    <div className="ios-ui space-y-4">
      <div className="grid gap-3 lg:grid-cols-2">
        <PeriodCard title="Aujourd’hui" counts={data.today} />
        <PeriodCard title="7 derniers jours" counts={data.week} />
        <PeriodCard title="30 derniers jours" counts={data.month} />
        <PeriodCard title="Cumul" counts={data.allTime} />
      </div>

      <DailyBars daily={data.daily} />

      <section className="overflow-hidden rounded-3xl bg-white shadow-[0_1px_2px_rgba(26,26,26,0.05)]">
        <h2 className="px-4 py-3 text-[15px] font-semibold text-ms-black">
          Méditations les plus consultées
        </h2>
        <ul className="border-t border-ms-gold/15">
          {data.topMeditations.length === 0 ? (
            <li className="px-4 py-5 text-[15px] text-ms-gray-600">Aucune lecture enregistrée.</li>
          ) : (
            data.topMeditations.map((row, index) => {
              const inner = (
                <>
                  <span className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-ms-gold/15 text-[13px] font-semibold text-ms-gold-dark">
                    {index + 1}
                  </span>
                  <span className="min-w-0 flex-1">
                    <span className="block truncate text-[16px] font-medium text-ms-black">
                      {row.title}
                    </span>
                    <span className="mt-0.5 block text-[13px] text-ms-gray-600">
                      {row.pageViews.toLocaleString("fr-FR")} vues ·{" "}
                      {row.uniqueSessions.toLocaleString("fr-FR")} sessions ·{" "}
                      {row.downloads.toLocaleString("fr-FR")} tél.
                    </span>
                  </span>
                  {row.slug ? (
                    <ChevronRight size={16} className="shrink-0 text-ms-gray-400" aria-hidden />
                  ) : null}
                </>
              );
              return (
                <li key={row.meditationId} className="border-b border-black/5 last:border-b-0">
                  {row.slug ? (
                    <Link
                      href={`${PUBLIC_ROUTES.meditations}/${row.slug}`}
                      className="flex items-center gap-3 px-4 py-3 no-underline hover:bg-ms-gold/10"
                    >
                      {inner}
                    </Link>
                  ) : (
                    <div className="flex items-center gap-3 px-4 py-3">{inner}</div>
                  )}
                </li>
              );
            })
          )}
        </ul>
      </section>

      <div className="grid gap-3 lg:grid-cols-2">
        <StatList
          title="Newsletter"
          rows={[
            { label: "Abonnements", value: data.newsletter.subscriptions },
            { label: "Désabonnements", value: data.newsletter.unsubscriptions },
            { label: "Actifs", value: data.newsletter.active },
          ]}
        />
        <StatList
          title="Commentaires"
          rows={[
            { label: "En file", value: data.comments.pending },
            { label: "Total", value: data.comments.total },
          ]}
        />
      </div>

      <aside
        className="rounded-3xl bg-white px-4 py-4 shadow-[0_1px_2px_rgba(26,26,26,0.05)]"
        aria-label="Méthodologie"
      >
        <h2 className="text-[15px] font-semibold text-ms-black">Comment les chiffres sont comptés</h2>
        <ul className="mt-2 space-y-1.5">
          {data.strategy.notes.map((note) => (
            <li key={note} className="text-[13px] leading-snug text-ms-gray-600">
              {note}
            </li>
          ))}
          <li className="text-[13px] leading-snug text-ms-gray-600">
            Dédoublonnage des pages vues : {data.strategy.pageViewDebounceSeconds} s.
          </li>
        </ul>
      </aside>
    </div>
  );
}
