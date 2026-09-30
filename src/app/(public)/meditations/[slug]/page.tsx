import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { MeditationViewTracker } from "@/components/analytics";
import { Container } from "@/components/ui";
import { MeditationReader } from "@/components/meditation/reader/meditation-reader";
import { JsonLd } from "@/components/seo";
import { PUBLIC_ROUTES } from "@/constants/routes";
import { getUserRepository } from "@/lib/db";
import {
  breadcrumbJsonLd,
  buildMeditationMetadata,
  meditationArticleJsonLd,
} from "@/lib/seo";
import { createBibleService } from "@/services/bible";
import { createMeditationService } from "@/services/meditation";

interface PageProps {
  params: Promise<{ slug: string }>;
}

export async function generateStaticParams() {
  const meditations = await createMeditationService().listPublished(200);
  return meditations.map((m) => ({ slug: m.slug }));
}

export async function generateMetadata({
  params,
}: PageProps): Promise<Metadata> {
  const { slug } = await params;
  const meditation = await createMeditationService().getBySlug(slug);
  if (!meditation || meditation.status !== "PUBLISHED") {
    return {
      title: "Méditation introuvable",
      robots: { index: false, follow: false },
    };
  }

  const author = await getUserRepository().findById(meditation.authorId);
  return buildMeditationMetadata(
    meditation,
    author?.name ?? "Morning Star",
  );
}

export default async function MeditationDetailPage({ params }: PageProps) {
  const { slug } = await params;
  const meditationService = createMeditationService();
  const meditation = await meditationService.getBySlug(slug);
  if (!meditation || meditation.status !== "PUBLISHED") notFound();

  const [{ previous, next }, author, bible] = await Promise.all([
    meditationService.getNeighbors(slug),
    getUserRepository().findById(meditation.authorId),
    createBibleService().resolvePassagesForMeditation(
      meditation.body,
      meditation.bibleReferences,
    ),
  ]);

  const authorName = author?.name ?? "Morning Star";

  return (
    <Container className="pb-[var(--ms-space-10)] pt-[var(--ms-space-7)] md:pt-[var(--ms-space-8)]">
      <MeditationViewTracker meditationId={meditation.id} />
      <JsonLd
        data={[
          meditationArticleJsonLd(meditation, authorName),
          breadcrumbJsonLd([
            { name: "Accueil", path: PUBLIC_ROUTES.home },
            { name: "Méditations", path: PUBLIC_ROUTES.meditations },
            {
              name: meditation.title,
              path: `${PUBLIC_ROUTES.meditations}/${meditation.slug}`,
            },
          ]),
        ]}
      />
      <MeditationReader
        meditation={meditation}
        authorName={authorName}
        passages={bible.passages}
        translations={bible.translations}
        defaultTranslationCode={bible.translationCode}
        previous={previous}
        next={next}
      />
    </Container>
  );
}
