import type { Metadata } from "next";
import {
  ButtonLink,
  Container,
  PageHeader,
  Typography,
} from "@/components/ui";
import { PUBLIC_ROUTES } from "@/constants/routes";
import { buildPublicPageMetadata } from "@/lib/seo";
import { createNewsletterService } from "@/services/newsletter";

export const metadata: Metadata = {
  ...buildPublicPageMetadata({
    title: "Confirmation newsletter",
    description: "Confirmation d’inscription à la newsletter Morning Star.",
    path: PUBLIC_ROUTES.newsletterConfirm,
    noIndex: true,
  }),
};

interface PageProps {
  searchParams: Promise<{ token?: string }>;
}

export default async function NewsletterConfirmPage({
  searchParams,
}: PageProps) {
  const { token } = await searchParams;
  const result = await createNewsletterService().confirm(token ?? "");

  return (
    <Container narrow className="pb-[var(--ms-space-10)]">
      <PageHeader
        eyebrow="Newsletter"
        title={result.ok ? "Inscription confirmée" : "Lien invalide"}
        description={result.message}
      />
      <Typography variant="meta" className="mt-6">
        Aucune adresse email n’est affichée sur cette page.
      </Typography>
      <div className="mt-10">
        <ButtonLink href={PUBLIC_ROUTES.home} variant="primary">
          Retour à l’accueil
        </ButtonLink>
      </div>
    </Container>
  );
}
