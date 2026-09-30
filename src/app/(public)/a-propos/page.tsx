import type { Metadata } from "next";
import { AboutArticle } from "@/components/public/about-article";
import { PUBLIC_ROUTES } from "@/constants/routes";
import { buildPublicPageMetadata } from "@/lib/seo";
import { createBibleService } from "@/services/bible";

const REFERENCE_LABELS = [
  "Apocalypse 22:16",
  "2 Pierre 1:19",
  "Apocalypse 2:28",
  "Nombres 24:17",
  "Ésaïe 14:12",
];

export const metadata: Metadata = buildPublicPageMetadata({
  title: "À propos",
  description:
    "Morning Star tient son nom de l'étoile brillante du matin : le Christ, dans Apocalypse 22:16. Une méditation chrétienne chaque jour.",
  path: PUBLIC_ROUTES.about,
});

export default async function AboutPage() {
  const bible = await createBibleService().resolvePassagesForMeditation(
    "",
    REFERENCE_LABELS.map((label) => ({ label })),
  );

  return (
    <AboutArticle
      passages={bible.passages}
      translations={bible.translations}
      defaultTranslationCode={bible.translationCode}
    />
  );
}
