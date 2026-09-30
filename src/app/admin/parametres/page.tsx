import { Badge, Container, Input, PageHeader, Typography } from "@/components/ui";
import { Button } from "@/components/ui/button";
import { MOCK_DATA_BANNER } from "@/constants/app";
import { getUserRepository } from "@/lib/db";

export const metadata = {
  title: "Paramètres",
};

export default async function AdminParametresPage() {
  const admin = await getUserRepository().findAdmin();

  return (
    <Container className="pb-[var(--ms-space-10)]" narrow>
      <PageHeader
        omitTitle
        eyebrow="Administration"
        title="Paramètres"
        description="Réglages essentiels du site et du compte auteur."
      />
      <div className="mb-8">
        <Badge tone="accent">{MOCK_DATA_BANNER}</Badge>
      </div>

      <section className="border-t border-ms-black pt-8">
        <Typography variant="nav" className="mb-6">
          Publication
        </Typography>
        <form className="flex flex-col gap-5" aria-disabled>
          <Input
            name="siteName"
            label="Nom du site"
            defaultValue="Morning Star"
            disabled
          />
          <Input
            name="tagline"
            label="Accroche"
            defaultValue="Méditation chrétienne quotidienne"
            disabled
          />
          <Input
            name="defaultTranslation"
            label="Traduction biblique par défaut"
            defaultValue="LSG1910"
            disabled
          />
          <Button type="submit" disabled>
            Enregistrer
          </Button>
        </form>
      </section>

      <section className="mt-12 border-t border-ms-border pt-8">
        <Typography variant="nav" className="mb-4">
          Compte auteur
        </Typography>
        <Typography variant="body">
          {admin?.name ?? "—"}
          <br />
          <span className="text-ms-muted">{admin?.email}</span>
        </Typography>
        <Typography variant="meta" className="mt-4">
          Authentification et préférences avancées seront branchées plus tard.
        </Typography>
      </section>
    </Container>
  );
}
