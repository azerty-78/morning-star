import { Container } from "@/components/ui";
import { ButtonLink } from "@/components/ui/button-link";
import { ADMIN_ROUTES } from "@/constants/routes";

export default function AdminNotFound() {
  return (
    <Container className="ios-ui py-6">
      <section className="rounded-[22px] bg-white px-5 py-8 shadow-[0_1px_2px_rgba(26,26,26,0.05)]">
        <p className="text-[13px] font-medium text-ms-gold-dark">Administration</p>
        <h1 className="mt-1 text-[28px] font-semibold tracking-tight text-ms-black">
          Page introuvable
        </h1>
        <p className="mt-2 text-[16px] text-ms-gray-700">
          Cette adresse n’existe pas dans l’espace auteur.
        </p>
        <div className="mt-6">
          <ButtonLink href={ADMIN_ROUTES.dashboard}>Retour au dashboard</ButtonLink>
        </div>
      </section>
    </Container>
  );
}
