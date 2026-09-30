import { SiteFooter } from "@/components/layout/site-footer";
import { SiteHeader } from "@/components/layout/site-header";
import { Container, Typography } from "@/components/ui";
import { ButtonLink } from "@/components/ui/button-link";
import { PUBLIC_ROUTES } from "@/constants/routes";

export default function NotFound() {
  return (
    <>
      <SiteHeader />
      <main id="contenu-principal" className="flex-1 bg-ms-white" tabIndex={-1}>
        <Container narrow className="py-16">
          <Typography variant="label" className="mb-4 text-ms-gold-dark">
            404
          </Typography>
          <Typography variant="title">Cette page n&apos;existe pas</Typography>
          <Typography variant="body" className="mt-4">
            L&apos;adresse ne correspond à aucune méditation ni à aucune page
            de Morning Star.
          </Typography>
          <div className="mt-8 flex flex-col gap-3 sm:flex-row">
            <ButtonLink href={PUBLIC_ROUTES.home}>Aujourd&apos;hui</ButtonLink>
            <ButtonLink href={PUBLIC_ROUTES.archive} variant="secondary">
              Archive
            </ButtonLink>
          </div>
        </Container>
      </main>
      <SiteFooter />
    </>
  );
}
