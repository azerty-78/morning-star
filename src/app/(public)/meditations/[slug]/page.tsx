import { notFound } from "next/navigation";
import { Container } from "@/components/ui";
import { MeditationHero } from "@/components/meditation";
import { createMeditationService } from "@/services/meditation";

interface PageProps {
  params: Promise<{ slug: string }>;
}

export async function generateMetadata({ params }: PageProps) {
  const { slug } = await params;
  const meditation = await createMeditationService().getBySlug(slug);
  return {
    title: meditation?.title ?? "Méditation",
  };
}

export default async function MeditationDetailPage({ params }: PageProps) {
  const { slug } = await params;
  const meditation = await createMeditationService().getBySlug(slug);
  if (!meditation) notFound();

  return (
    <Container className="py-10 md:py-16">
      <MeditationHero meditation={meditation} />
    </Container>
  );
}
