import { Container, PageHeader, Typography } from "@/components/ui";
import { MeditationList } from "@/components/meditation";
import { createMeditationService } from "@/services/meditation";

export const metadata = {
  title: "Archive",
};

export default async function ArchivePage() {
  const meditations = await createMeditationService().listPublished();

  return (
    <Container className="pb-16">
      <PageHeader
        eyebrow="Chronologie"
        title="Archive"
        description="Les méditations précédentes, par date de publication."
      />
      <div className="mt-10">
        <MeditationList meditations={meditations} />
      </div>
      <Typography variant="meta" className="mt-8">
        La navigation par calendrier sera ajoutée dans une étape ultérieure.
      </Typography>
    </Container>
  );
}
