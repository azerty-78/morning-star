import type { Metadata } from "next";
import { Container, PageHeader, Typography, ButtonLink } from "@/components/ui";
import { PUBLIC_ROUTES } from "@/constants/routes";
import { buildPublicPageMetadata } from "@/lib/seo";
import { createNewsletterService } from "@/services/newsletter";

export const metadata: Metadata = {
  ...buildPublicPageMetadata({
    title: "Désinscription newsletter",
    description: "Désinscription de la newsletter Morning Star.",
    path: PUBLIC_ROUTES.newsletterUnsubscribe,
    noIndex: true,
  }),
};

interface PageProps {
  searchParams: Promise<{ token?: string }>;
}

export default async function NewsletterUnsubscribePage({
  searchParams,
}: PageProps) {
  const { token } = await searchParams;
  const result = await createNewsletterService().unsubscribe(token ?? "");

  return (
    <Container narrow className="pb-[var(--ms-space-10)]">
      <PageHeader
        eyebrow="Newsletter"
        title={result.ok ? "Désinscription" : "Lien invalide"}
        description={result.message}
      />
      <Typography variant="meta" className="mt-6">
        Aucune adresse email n’est affichée sur cette page.
      </Typography>
      <div className="mt-10 flex flex-wrap gap-4">
        <ButtonLink href={PUBLIC_ROUTES.home} variant="secondary">
          Retour à l’accueil
        </ButtonLink>
        {result.ok ? (
          <ButtonLink href={PUBLIC_ROUTES.home} variant="ghost">
            Se réabonner plus tard
          </ButtonLink>
        ) : null}
      </div>
    </Container>
  );
}
