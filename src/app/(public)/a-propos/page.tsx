import type { Metadata } from "next";
import { Container, PageHeader, Typography } from "@/components/ui";
import { APP_NAME } from "@/constants/app";
import { PUBLIC_ROUTES } from "@/constants/routes";
import { buildPublicPageMetadata } from "@/lib/seo";

export const metadata: Metadata = buildPublicPageMetadata({
  title: "À propos",
  description:
    "Morning Star publie une méditation chrétienne chaque jour : un texte court, une référence biblique, sans bruit.",
  path: PUBLIC_ROUTES.about,
});

export default function AboutPage() {
  return (
    <Container narrow className="pb-[var(--ms-space-10)]">
      <PageHeader
        eyebrow="La publication"
        title="À propos"
        description="Une méditation par jour, pour commencer la journée dans la Parole."
      />

      <div className="mt-8 flex max-w-[var(--ms-measure)] flex-col gap-6">
        <Typography variant="body">
          {APP_NAME} est une publication éditoriale de méditations chrétiennes
          quotidiennes. Chaque texte est écrit pour être lu lentement : un
          titre, quelques paragraphes, une référence biblique que l’on peut
          ouvrir sans quitter la page.
        </Typography>
        <Typography variant="body">
          Il n’y a pas de fil d’actualité, pas de commentaires publics bruyants,
          pas de redirection vers un site extérieur pour lire la Bible. La
          lecture reste ici.
        </Typography>
        <Typography variant="body">
          L’auteur prépare, programme et publie seul. La newsletter envoie la
          méditation du jour à celles et ceux qui l’ont confirmée — un message,
          puis le silence.
        </Typography>
      </div>
    </Container>
  );
}
