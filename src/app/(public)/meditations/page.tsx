import { Container, PageHeader } from "@/components/ui";
import { MeditationList } from "@/components/meditation";
import { createMeditationService } from "@/services/meditation";

export const metadata = {
  title: "Méditations",
};

export default async function MeditationsPage() {
  const service = createMeditationService();
  const meditations = await service.listPublished();

  return (
    <Container className="pb-16">
      <PageHeader
        eyebrow="Lecture"
        title="Méditations"
        description="Parcourir les méditations publiées."
      />
      <div className="mt-10">
        <MeditationList meditations={meditations} />
      </div>
    </Container>
  );
}
