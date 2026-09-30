import { MeditationAdminTable } from "@/components/admin";
import { Badge, ButtonLink, Container, PageHeader, Typography } from "@/components/ui";
import { MOCK_DATA_BANNER } from "@/constants/app";
import { ADMIN_ROUTES } from "@/constants/routes";
import { MeditationStatus } from "@/domain/meditation";
import { createAdminService } from "@/services/admin";

export const metadata = {
  title: "Méditations",
};

export default async function AdminMeditationsPage() {
  const items = await createAdminService().listMeditations();
  const counts = {
    draft: items.filter((m) => m.status === MeditationStatus.DRAFT).length,
    scheduled: items.filter((m) => m.status === MeditationStatus.SCHEDULED)
      .length,
    published: items.filter((m) => m.status === MeditationStatus.PUBLISHED)
      .length,
  };

  return (
    <Container className="pb-[var(--ms-space-10)]">
      <PageHeader
        omitTitle
        eyebrow="Administration"
        title="Méditations"
        description="Tous les textes — brouillons, programmés et publiés."
      />

      <div className="mb-6 flex flex-wrap items-center gap-4">
        <Badge tone="accent">{MOCK_DATA_BANNER}</Badge>
        <ButtonLink href={ADMIN_ROUTES.import} variant="secondary" size="sm">
          Importer un document
        </ButtonLink>
      </div>

      <dl className="mb-8 grid grid-cols-3 gap-4 border-y border-ms-black py-4">
        <div>
          <Typography variant="label" as="dt">
            Brouillon
          </Typography>
          <Typography variant="title" as="dd" className="mt-1 text-2xl">
            {counts.draft}
          </Typography>
        </div>
        <div>
          <Typography variant="label" as="dt">
            Programmé
          </Typography>
          <Typography variant="title" as="dd" className="mt-1 text-2xl">
            {counts.scheduled}
          </Typography>
        </div>
        <div>
          <Typography variant="label" as="dt">
            Publié
          </Typography>
          <Typography variant="title" as="dd" className="mt-1 text-2xl">
            {counts.published}
          </Typography>
        </div>
      </dl>

      <MeditationAdminTable items={items} />
    </Container>
  );
}
