import { SiteFooter } from "@/components/layout/site-footer";
import { SiteHeader } from "@/components/layout/site-header";
import { Container } from "@/components/ui";
import { ButtonLink } from "@/components/ui/button-link";
import { PUBLIC_ROUTES } from "@/constants/routes";

export default function NotFound() {
  return (
    <>
      <SiteHeader />
      <div className="flex flex-1 flex-col pb-[calc(4.75rem+env(safe-area-inset-bottom))] md:pb-0">
        <main id="contenu-principal" className="ios-ui flex-1 bg-ms-cream-deep" tabIndex={-1}>
          <Container narrow className="py-10">
          <section className="rounded-[22px] bg-white px-6 py-8 shadow-[0_1px_2px_rgba(26,26,26,0.05)]">
            <p className="text-[13px] font-medium text-ms-gold-dark">404</p>
            <h1 className="mt-1 text-[clamp(1.75rem,5vw,2rem)] font-semibold tracking-tight text-ms-black">
              Cette page n&apos;existe pas
            </h1>
            <p className="mt-2 text-[17px] leading-snug text-ms-gray-700">
              L&apos;adresse ne correspond à aucune méditation ni à aucune page
              de Morning Star.
            </p>
            <div className="mt-6 flex flex-col gap-3 sm:flex-row">
              <ButtonLink href={PUBLIC_ROUTES.home}>Aujourd&apos;hui</ButtonLink>
              <ButtonLink href={PUBLIC_ROUTES.archive} variant="secondary">
                Archive
              </ButtonLink>
            </div>
          </section>
        </Container>
        </main>
        <SiteFooter />
      </div>
    </>
  );
}
