import { notFound } from "next/navigation";
import { Container } from "@/components/ui";
import { MeditationReader } from "@/components/meditation";
import { getUserRepository } from "@/lib/db";
import { createBibleService } from "@/services/bible";
import { createMeditationService } from "@/services/meditation";

interface PageProps {
  params: Promise<{ slug: string }>;
}

export async function generateMetadata({ params }: PageProps) {
  const { slug } = await params;
  const meditation = await createMeditationService().getBySlug(slug);
  return {
    title: meditation?.title ?? "Méditation",
    description: meditation?.excerpt,
  };
}

export default async function MeditationDetailPage({ params }: PageProps) {
  const { slug } = await params;
  const meditationService = createMeditationService();
  const meditation = await meditationService.getBySlug(slug);
  if (!meditation) notFound();

  const [{ previous, next }, author, bible] = await Promise.all([
    meditationService.getNeighbors(slug),
    getUserRepository().findById(meditation.authorId),
    createBibleService().resolvePassagesForMeditation(
      meditation.body,
      meditation.bibleReferences,
    ),
  ]);

  return (
    <Container className="pb-[var(--ms-space-10)] pt-[var(--ms-space-7)] md:pt-[var(--ms-space-8)]">
      <MeditationReader
        meditation={meditation}
        authorName={author?.name ?? "Morning Star"}
        passages={bible.passages}
        translations={bible.translations}
        defaultTranslationCode={bible.translationCode}
        previous={previous}
        next={next}
      />
    </Container>
  );
}
