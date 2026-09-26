import { Badge, Container, PageHeader, Typography } from "@/components/ui";
import { MOCK_DATA_BANNER } from "@/constants/app";
import { createAdminService } from "@/services/admin";

export const metadata = {
  title: "Newsletter",
};

export default async function AdminNewsletterPage() {
  const snap = await createAdminService().getNewsletterSnapshot();

  return (
    <Container className="pb-[var(--ms-space-10)]">
      <PageHeader
        eyebrow="Administration"
        title="Newsletter"
        description="Abonnés et santé de la liste — sans tableau de bord marketing."
      />
      <div className="mb-8">
        <Badge tone="accent">{MOCK_DATA_BANNER}</Badge>
      </div>

      <dl className="grid gap-8 border-y border-ms-black py-8 sm:grid-cols-3">
        <div>
          <Typography variant="label" as="dt">
            Actifs
          </Typography>
          <Typography variant="title" as="dd" className="mt-2 tabular-nums">
            {snap.active.toLocaleString("fr-FR")}
          </Typography>
        </div>
        <div>
          <Typography variant="label" as="dt">
            Total inscrits
          </Typography>
          <Typography variant="title" as="dd" className="mt-2 tabular-nums">
            {snap.total.toLocaleString("fr-FR")}
          </Typography>
        </div>
        <div>
          <Typography variant="label" as="dt">
            Désabonnés
          </Typography>
          <Typography variant="title" as="dd" className="mt-2 tabular-nums">
            {snap.unsubscribed.toLocaleString("fr-FR")}
          </Typography>
        </div>
      </dl>

      <section className="mt-10">
        <Typography variant="nav" className="mb-4">
          Activité récente
        </Typography>
        <Typography variant="body" className="text-ms-gray-700">
          {snap.recentSignups} inscriptions sur les 30 derniers jours (mock).
          L’envoi et les séquences seront branchés ultérieurement.
        </Typography>
      </section>
    </Container>
  );
}
