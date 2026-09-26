import { Container, Typography } from "@/components/ui";
import { MeditationHero } from "@/components/meditation";
import { createMeditationService } from "@/services/meditation";

export default async function HomePage() {
  const service = createMeditationService();
  const meditation = await service.getToday();

  return (
    <Container className="py-10 md:py-16">
      {meditation ? (
        <MeditationHero meditation={meditation} />
      ) : (
        <Typography variant="body">
          Aucune méditation disponible pour aujourd&apos;hui.
        </Typography>
      )}
    </Container>
  );
}
