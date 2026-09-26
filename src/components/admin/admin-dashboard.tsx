import Link from "next/link";
import { Typography } from "@/components/ui";
import { StatusBadge } from "@/components/admin/status-badge";
import type { AdminDashboardSnapshot } from "@/domain/admin";
import { ADMIN_ROUTES, PUBLIC_ROUTES } from "@/constants/routes";
import { formatPublicationDate } from "@/lib/utils";
import { cn } from "@/lib/utils";

function Metric({
  label,
  value,
  href,
}: {
  label: string;
  value: string | number;
  href?: string;
}) {
  const content = (
    <>
      <Typography variant="label" className="text-ms-muted">
        {label}
      </Typography>
      <p className="mt-1 font-sans text-3xl font-semibold tracking-tight text-ms-fg tabular-nums">
        {value}
      </p>
    </>
  );

  if (href) {
    return (
      <Link href={href} className="block no-underline hover:opacity-80">
        {content}
      </Link>
    );
  }
  return <div>{content}</div>;
}

function MeditationRow({
  title,
  date,
  status,
  href,
}: {
  title: string;
  date: string;
  status?: React.ComponentProps<typeof StatusBadge>["status"];
  href: string;
}) {
  return (
    <li className="grid grid-cols-[5.5rem_1fr_auto] items-baseline gap-3 border-b border-ms-border py-3 last:border-b-0">
      <Typography variant="date" dateTime={date} className="tabular-nums">
        {date}
      </Typography>
      <Link
        href={href}
        className="min-w-0 truncate font-sans text-sm font-medium text-ms-fg no-underline hover:underline"
      >
        {title}
      </Link>
      {status ? <StatusBadge status={status} /> : <span />}
    </li>
  );
}

export function AdminDashboardView({
  snapshot,
}: {
  snapshot: AdminDashboardSnapshot;
}) {
  const { current, recentPublished, scheduled, pendingComments } = snapshot;

  return (
    <div className="space-y-[var(--ms-space-10)]">
      {/* Méditation actuelle — bloc éditorial, pas une carte */}
      <section className="border-t border-ms-black pt-6">
        <Typography variant="nav" className="mb-4 text-ms-muted">
          Méditation actuelle
        </Typography>
        {current ? (
          <div className="grid gap-4 md:grid-cols-12 md:gap-6">
            <div className="md:col-span-3">
              <Typography
                variant="date"
                dateTime={current.publicationDate}
                className="text-ms-fg"
              >
                {formatPublicationDate(current.publicationDate)}
              </Typography>
              <div className="mt-2">
                <StatusBadge status={current.status} />
              </div>
            </div>
            <div className="md:col-span-9">
              <Typography variant="title" as="h2" className="text-2xl md:text-3xl">
                <Link
                  href={`${PUBLIC_ROUTES.meditations}/${current.slug}`}
                  className="text-inherit no-underline hover:underline"
                >
                  {current.title}
                </Link>
              </Typography>
              <Typography variant="lede" className="mt-3 max-w-[36rem]">
                {current.excerpt}
              </Typography>
            </div>
          </div>
        ) : (
          <Typography variant="body" className="text-ms-muted">
            Aucune méditation pour aujourd&apos;hui.
          </Typography>
        )}
      </section>

      {/* Chiffres — filet horizontal, pas de cartes colorées */}
      <section
        className={cn(
          "grid gap-8 border-y border-ms-black py-6",
          "sm:grid-cols-3",
        )}
        aria-label="Indicateurs"
      >
        <Metric label="Vues (total)" value={snapshot.totalViews.toLocaleString("fr-FR")} />
        <Metric
          label="Abonnés newsletter"
          value={snapshot.newsletterActive.toLocaleString("fr-FR")}
          href={ADMIN_ROUTES.newsletter}
        />
        <Metric
          label="Commentaires à traiter"
          value={pendingComments.length}
          href={ADMIN_ROUTES.commentaires}
        />
      </section>

      <div className="grid gap-10 lg:grid-cols-2">
        <section>
          <div className="mb-2 flex items-baseline justify-between border-b border-ms-black pb-2">
            <Typography variant="nav">Publications récentes</Typography>
            <Link
              href={ADMIN_ROUTES.meditations}
              className="text-[length:var(--ms-text-2xs)] uppercase tracking-[var(--ms-tracking-widest)] text-ms-muted no-underline hover:text-ms-fg"
            >
              Tout voir
            </Link>
          </div>
          <ul>
            {recentPublished.map((m) => (
              <MeditationRow
                key={m.id}
                title={m.title}
                date={m.publicationDate}
                status={m.status}
                href={`${PUBLIC_ROUTES.meditations}/${m.slug}`}
              />
            ))}
          </ul>
        </section>

        <section>
          <div className="mb-2 flex items-baseline justify-between border-b border-ms-black pb-2">
            <Typography variant="nav">Publications programmées</Typography>
            <Link
              href={ADMIN_ROUTES.calendrier}
              className="text-[length:var(--ms-text-2xs)] uppercase tracking-[var(--ms-tracking-widest)] text-ms-muted no-underline hover:text-ms-fg"
            >
              Calendrier
            </Link>
          </div>
          {scheduled.length === 0 ? (
            <Typography variant="meta" className="py-4">
              Rien de programmé.
            </Typography>
          ) : (
            <ul>
              {scheduled.map((m) => (
                <MeditationRow
                  key={m.id}
                  title={m.title}
                  date={m.publicationDate}
                  status={m.status}
                  href={ADMIN_ROUTES.meditations}
                />
              ))}
            </ul>
          )}
        </section>
      </div>

      <section>
        <div className="mb-2 flex items-baseline justify-between border-b border-ms-black pb-2">
          <Typography variant="nav">Commentaires nécessitant une action</Typography>
          <Link
            href={ADMIN_ROUTES.commentaires}
            className="text-[length:var(--ms-text-2xs)] uppercase tracking-[var(--ms-tracking-widest)] text-ms-muted no-underline hover:text-ms-fg"
          >
            Modérer
          </Link>
        </div>
        {pendingComments.length === 0 ? (
          <Typography variant="meta" className="py-4">
            File d&apos;attente vide.
          </Typography>
        ) : (
          <ul>
            {pendingComments.map((c) => (
              <li
                key={c.id}
                className="grid gap-1 border-b border-ms-border py-4 last:border-b-0 md:grid-cols-[8rem_1fr]"
              >
                <Typography variant="meta" className="text-ms-fg">
                  {c.authorName}
                </Typography>
                <div>
                  <p className="text-sm text-ms-fg">{c.excerpt}</p>
                  <Typography variant="meta" className="mt-1">
                    sur « {c.meditationTitle} »
                  </Typography>
                </div>
              </li>
            ))}
          </ul>
        )}
      </section>
    </div>
  );
}
