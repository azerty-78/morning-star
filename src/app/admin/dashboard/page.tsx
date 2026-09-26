import { Badge, Container, PageHeader, Typography } from "@/components/ui";
import { MOCK_DATA_BANNER } from "@/constants/app";
import { getUserRepository } from "@/lib/db";
import { createMeditationService } from "@/services/meditation";

export const metadata = {
  title: "Dashboard",
};

/**
 * Dashboard structurel — fonctionnalités métier à venir.
 * Pas de protection auth réelle à cette étape (guards préparés dans lib/auth).
 */
export default async function AdminDashboardPage() {
  const admin = await getUserRepository().findAdmin();
  const meditations = await createMeditationService().listPublished();

  return (
    <Container className="pb-16">
      <PageHeader
        eyebrow="Administration"
        title="Dashboard"
        description="Vue d'ensemble structurelle. Les modules métier seront branchés progressivement."
      />

      <div className="mt-6">
        <Badge tone="accent">{MOCK_DATA_BANNER}</Badge>
      </div>

      <section className="mt-10 grid gap-8 border-t border-ms-border pt-10 md:grid-cols-2">
        <div>
          <Typography variant="nav" className="mb-3 text-ms-muted">
            Administrateur
          </Typography>
          <Typography variant="body">
            {admin?.name ?? "—"}
            <br />
            <span className="text-ms-muted">{admin?.email}</span>
          </Typography>
        </div>
        <div>
          <Typography variant="nav" className="mb-3 text-ms-muted">
            Méditations (mock)
          </Typography>
          <Typography variant="display" as="p" className="text-5xl">
            {meditations.length}
          </Typography>
        </div>
      </section>

      <section className="mt-12 border-t border-ms-border pt-10">
        <Typography variant="nav" className="mb-4 text-ms-muted">
          Modules à venir
        </Typography>
        <ul className="grid gap-3 text-sm text-ms-gray-700 md:grid-cols-2">
          <li>Import PDF / DOCX</li>
          <li>Programmation des publications</li>
          <li>Gestion des commentaires</li>
          <li>Newsletter</li>
          <li>Statistiques</li>
          <li>Paramètres du site</li>
        </ul>
      </section>
    </Container>
  );
}
