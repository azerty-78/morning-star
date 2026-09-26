import { Container, Input, PageHeader, Typography } from "@/components/ui";
import { Button } from "@/components/ui/button";

export const metadata = {
  title: "Connexion admin",
};

/**
 * Formulaire structurel uniquement.
 * L'authentification réelle sera branchée ultérieurement.
 */
export default function AdminLoginPage() {
  return (
    <Container narrow className="pb-16">
      <PageHeader
        eyebrow="Admin"
        title="Connexion"
        description="Accès réservé à l'auteur. Authentification non active à cette étape."
      />

      <form className="mt-10 flex flex-col gap-5" aria-describedby="auth-note">
        <Input
          name="email"
          type="email"
          label="Email"
          autoComplete="username"
          required
          disabled
        />
        <Input
          name="password"
          type="password"
          label="Mot de passe"
          autoComplete="current-password"
          required
          disabled
        />
        <Button type="submit" disabled>
          Se connecter
        </Button>
      </form>

      <Typography variant="meta" id="auth-note" className="mt-6">
        Les champs sont désactivés volontairement. Voir{" "}
        <code className="font-mono text-sm">src/lib/auth</code> pour les
        fondations d&apos;authentification.
      </Typography>
    </Container>
  );
}
