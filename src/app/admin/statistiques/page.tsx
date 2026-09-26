import Link from "next/link";
import { Badge, Container, PageHeader, Typography } from "@/components/ui";
import { MOCK_DATA_BANNER } from "@/constants/app";
import { PUBLIC_ROUTES } from "@/constants/routes";
import { createAdminService } from "@/services/admin";

export const metadata = {
  title: "Statistiques",
};

export default async function AdminStatistiquesPage() {
  const stats = await createAdminService().getStatsSnapshot();

  return (
    <Container className="pb-[var(--ms-space-10)]">
      <PageHeader
        eyebrow="Administration"
        title="Statistiques"
        description="Lecture sobre des chiffres — vues et catalogue."
      />
      <div className="mb-8">
        <Badge tone="accent">{MOCK_DATA_BANNER}</Badge>
      </div>

      <dl className="grid gap-8 border-y border-ms-black py-8 sm:grid-cols-4">
        <div>
          <Typography variant="label" as="dt">
            Vues totales
          </Typography>
          <p className="mt-2 font-sans text-3xl font-semibold tabular-nums">
            {stats.totalViews.toLocaleString("fr-FR")}
          </p>
        </div>
        <div>
          <Typography variant="label" as="dt">
            Publiés
          </Typography>
          <p className="mt-2 font-sans text-3xl font-semibold tabular-nums">
            {stats.publishedCount}
          </p>
        </div>
        <div>
          <Typography variant="label" as="dt">
            Programmés
          </Typography>
          <p className="mt-2 font-sans text-3xl font-semibold tabular-nums">
            {stats.scheduledCount}
          </p>
        </div>
        <div>
          <Typography variant="label" as="dt">
            Brouillons
          </Typography>
          <p className="mt-2 font-sans text-3xl font-semibold tabular-nums">
            {stats.draftCount}
          </p>
        </div>
      </dl>

      <section className="mt-10">
        <Typography variant="nav" className="mb-4 border-b border-ms-black pb-2">
          Méditations les plus lues
        </Typography>
        <ol>
          {stats.topArticles.map((a, i) => (
            <li
              key={a.id}
              className="grid grid-cols-[2rem_1fr_auto] items-baseline gap-3 border-b border-ms-border py-3"
            >
              <span className="font-sans text-sm tabular-nums text-ms-muted">
                {i + 1}
              </span>
              <div>
                <Link
                  href={`${PUBLIC_ROUTES.meditations}/${a.slug}`}
                  className="text-sm font-medium text-ms-fg no-underline hover:underline"
                >
                  {a.title}
                </Link>
                <Typography variant="meta" className="mt-0.5">
                  {a.publicationDate}
                </Typography>
              </div>
              <span className="font-sans text-sm tabular-nums text-ms-fg">
                {a.views.toLocaleString("fr-FR")}
              </span>
            </li>
          ))}
        </ol>
      </section>
    </Container>
  );
}
