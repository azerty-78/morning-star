import Link from "next/link";
import { Typography } from "@/components/ui";
import type { AnalyticsDashboard, PeriodCounts } from "@/domain/analytics";
import { PUBLIC_ROUTES } from "@/constants/routes";
import { cn } from "@/lib/utils";

function MetricBlock({
  label,
  value,
  hint,
}: {
  label: string;
  value: number;
  hint?: string;
}) {
  return (
    <div>
      <Typography variant="label" className="text-ms-muted">
        {label}
      </Typography>
      <p className="mt-1 font-sans text-3xl font-semibold tracking-tight tabular-nums text-ms-fg">
        {value.toLocaleString("fr-FR")}
      </p>
      {hint ? (
        <Typography variant="meta" className="mt-1">
          {hint}
        </Typography>
      ) : null}
    </div>
  );
}

function PeriodStrip({
  title,
  counts,
}: {
  title: string;
  counts: PeriodCounts;
}) {
  return (
    <section className="border-b border-ms-border py-6">
      <Typography variant="nav" className="mb-4 text-ms-muted">
        {title}
      </Typography>
      <div className="grid gap-6 sm:grid-cols-3">
        <MetricBlock label="Pages vues" value={counts.pageViews} />
        <MetricBlock
          label="Sessions approx."
          value={counts.uniqueSessions}
          hint="sessionKey distincts"
        />
        <MetricBlock label="Téléchargements" value={counts.downloads} />
      </div>
    </section>
  );
}

function DailyBars({
  daily,
}: {
  daily: AnalyticsDashboard["daily"];
}) {
  const max = Math.max(1, ...daily.map((d) => d.pageViews));

  return (
    <section className="mt-10">
      <Typography variant="nav" className="mb-2 border-b border-ms-black pb-2">
        Vues quotidiennes · 14 jours
      </Typography>
      <Typography variant="meta" className="mb-6">
        Hauteur = pages vues · trait or = sessions approximatives (échelle
        relative).
      </Typography>
      <ul className="flex items-end gap-1 border-b border-ms-black pb-2 md:gap-1.5">
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
                  className="absolute bottom-0 w-[40%] max-w-[12px] bg-ms-gold"
                  style={{ height: `${Math.max(sessionH, d.uniqueSessions ? 2 : 0)}%` }}
                  aria-hidden
                />
                <span
                  className="w-full max-w-[18px] bg-ms-black"
                  style={{ height: `${Math.max(h, d.pageViews ? 2 : 0)}%` }}
                  aria-hidden
                />
              </div>
              <span className="text-[9px] tabular-nums text-ms-muted">
                {d.date.slice(8)}
              </span>
            </li>
          );
        })}
      </ul>
      <ul className="mt-3 flex flex-wrap gap-x-6 gap-y-1 text-[length:var(--ms-text-2xs)] uppercase tracking-[var(--ms-tracking-wider)] text-ms-muted">
        <li className="flex items-center gap-2">
          <span className="inline-block h-2 w-4 bg-ms-black" aria-hidden />
          Pages vues
        </li>
        <li className="flex items-center gap-2">
          <span className="inline-block h-2 w-4 bg-ms-gold" aria-hidden />
          Sessions
        </li>
      </ul>
    </section>
  );
}

export function AnalyticsDashboardView({
  data,
}: {
  data: AnalyticsDashboard;
}) {
  return (
    <div>
      <PeriodStrip title="Aujourd’hui" counts={data.today} />
      <PeriodStrip title="7 derniers jours" counts={data.week} />
      <PeriodStrip title="30 derniers jours" counts={data.month} />

      <section className="border-b border-ms-black py-6">
        <Typography variant="nav" className="mb-4 text-ms-muted">
          Cumul
        </Typography>
        <div className="grid gap-6 sm:grid-cols-3">
          <MetricBlock label="Pages vues" value={data.allTime.pageViews} />
          <MetricBlock
            label="Sessions approx."
            value={data.allTime.uniqueSessions}
          />
          <MetricBlock label="Téléchargements" value={data.allTime.downloads} />
        </div>
      </section>

      <DailyBars daily={data.daily} />

      <section className="mt-12">
        <Typography variant="nav" className="mb-4 border-b border-ms-black pb-2">
          Méditations les plus consultées
        </Typography>
        <div className="overflow-x-auto">
          <table className="w-full min-w-[36rem] border-collapse text-left">
            <thead>
              <tr className="border-b border-ms-black">
                <th className="py-3 pr-3 text-[length:var(--ms-text-2xs)] font-medium uppercase tracking-[var(--ms-tracking-widest)] text-ms-muted">
                  #
                </th>
                <th className="py-3 pr-3 text-[length:var(--ms-text-2xs)] font-medium uppercase tracking-[var(--ms-tracking-widest)] text-ms-muted">
                  Titre
                </th>
                <th className="py-3 pr-3 text-right text-[length:var(--ms-text-2xs)] font-medium uppercase tracking-[var(--ms-tracking-widest)] text-ms-muted">
                  Vues
                </th>
                <th className="py-3 pr-3 text-right text-[length:var(--ms-text-2xs)] font-medium uppercase tracking-[var(--ms-tracking-widest)] text-ms-muted">
                  Sessions
                </th>
                <th className="py-3 text-right text-[length:var(--ms-text-2xs)] font-medium uppercase tracking-[var(--ms-tracking-widest)] text-ms-muted">
                  Tél.
                </th>
              </tr>
            </thead>
            <tbody>
              {data.topMeditations.map((row, i) => (
                <tr
                  key={row.meditationId}
                  className="border-b border-ms-border align-baseline"
                >
                  <td className="py-3 pr-3 tabular-nums text-sm text-ms-muted">
                    {i + 1}
                  </td>
                  <td className="py-3 pr-3">
                    {row.slug ? (
                      <Link
                        href={`${PUBLIC_ROUTES.meditations}/${row.slug}`}
                        className="text-sm font-medium text-ms-fg no-underline hover:underline"
                      >
                        {row.title}
                      </Link>
                    ) : (
                      <span className="text-sm font-medium">{row.title}</span>
                    )}
                    <Typography variant="meta" className="mt-0.5">
                      {row.publicationDate}
                    </Typography>
                  </td>
                  <td className="py-3 pr-3 text-right font-sans text-sm tabular-nums">
                    {row.pageViews.toLocaleString("fr-FR")}
                  </td>
                  <td className="py-3 pr-3 text-right font-sans text-sm tabular-nums text-ms-muted">
                    {row.uniqueSessions.toLocaleString("fr-FR")}
                  </td>
                  <td className="py-3 text-right font-sans text-sm tabular-nums">
                    {row.downloads.toLocaleString("fr-FR")}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </section>

      <div className="mt-12 grid gap-10 border-t border-ms-black pt-8 md:grid-cols-2">
        <section>
          <Typography variant="nav" className="mb-4">
            Newsletter
          </Typography>
          <dl className="space-y-4">
            <div className="flex justify-between border-b border-ms-border pb-2">
              <Typography variant="meta" as="dt">
                Abonnements (événements)
              </Typography>
              <dd className="font-sans text-sm tabular-nums">
                {data.newsletter.subscriptions.toLocaleString("fr-FR")}
              </dd>
            </div>
            <div className="flex justify-between border-b border-ms-border pb-2">
              <Typography variant="meta" as="dt">
                Désabonnements
              </Typography>
              <dd className="font-sans text-sm tabular-nums">
                {data.newsletter.unsubscriptions.toLocaleString("fr-FR")}
              </dd>
            </div>
            <div className="flex justify-between border-b border-ms-border pb-2">
              <Typography variant="meta" as="dt">
                Actifs
              </Typography>
              <dd className="font-sans text-sm tabular-nums">
                {data.newsletter.active.toLocaleString("fr-FR")}
              </dd>
            </div>
          </dl>
        </section>

        <section>
          <Typography variant="nav" className="mb-4">
            Commentaires
          </Typography>
          <dl className="space-y-4">
            <div className="flex justify-between border-b border-ms-border pb-2">
              <Typography variant="meta" as="dt">
                En file
              </Typography>
              <dd className="font-sans text-sm tabular-nums">
                {data.comments.pending.toLocaleString("fr-FR")}
              </dd>
            </div>
            <div className="flex justify-between border-b border-ms-border pb-2">
              <Typography variant="meta" as="dt">
                Total (échantillon)
              </Typography>
              <dd className="font-sans text-sm tabular-nums">
                {data.comments.total.toLocaleString("fr-FR")}
              </dd>
            </div>
          </dl>
        </section>
      </div>

      <aside
        className={cn(
          "mt-12 border border-ms-border bg-ms-paper p-5",
        )}
        aria-label="Méthodologie"
      >
        <Typography variant="label" className="mb-3 text-ms-gold-dark">
          Méthode · ArticleView
        </Typography>
        <ul className="space-y-2">
          {data.strategy.notes.map((note) => (
            <li key={note}>
              <Typography variant="meta">{note}</Typography>
            </li>
          ))}
          <li>
            <Typography variant="meta">
              Debounce pages vues : {data.strategy.pageViewDebounceSeconds} s ·
              cookie « {data.strategy.sessionCookieName} ».
            </Typography>
          </li>
        </ul>
      </aside>
    </div>
  );
}
