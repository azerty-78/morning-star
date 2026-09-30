import type { Metadata } from "next";
import { Container, PageHeader } from "@/components/ui";
import { MeditationList } from "@/components/meditation/meditation-list";
import { PUBLIC_ROUTES } from "@/constants/routes";
import { buildPublicPageMetadata } from "@/lib/seo";
import { createMeditationService } from "@/services/meditation";

export const metadata: Metadata = buildPublicPageMetadata({
  title: "Méditations",
  description:
    "Parcourir les méditations chrétiennes quotidiennes publiées sur Morning Star.",
  path: PUBLIC_ROUTES.meditations,
});

export default async function MeditationsPage() {
  const service = createMeditationService();
  const meditations = await service.listPublished();

  return (
    <Container className="pb-6">
      <PageHeader
        eyebrow="Lecture"
        title="Méditations"
        description="Parcourir les méditations publiées."
      />
      <div className="mt-4">
        <MeditationList meditations={meditations} />
      </div>
    </Container>
  );
}
