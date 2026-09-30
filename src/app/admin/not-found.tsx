import { Container, Typography } from "@/components/ui";
import { ButtonLink } from "@/components/ui/button-link";
import { ADMIN_ROUTES } from "@/constants/routes";

export default function AdminNotFound() {
  return (
    <Container className="py-16">
      <Typography variant="label" className="mb-4 text-ms-gold-dark">
        Administration
      </Typography>
      <Typography variant="title">Page introuvable</Typography>
      <Typography variant="body" className="mt-4 max-w-[var(--ms-measure)]">
        Cette adresse n’existe pas dans l’espace auteur.
      </Typography>
      <div className="mt-8">
        <ButtonLink href={ADMIN_ROUTES.dashboard}>Retour au dashboard</ButtonLink>
      </div>
    </Container>
  );
}
