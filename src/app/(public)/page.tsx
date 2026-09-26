import { Container, Separator, Typography } from "@/components/ui";
import {
  HomeArchiveTeaser,
  HomeToday,
  NewsletterSignup,
} from "@/components/public";
import { APP_DESCRIPTION, APP_NAME } from "@/constants/app";
import { createMeditationService } from "@/services/meditation";

export const metadata = {
  title: `${APP_NAME} · Méditation du jour`,
  description: APP_DESCRIPTION,
};

export default async function HomePage() {
  const service = createMeditationService();
  const today = await service.getToday();
  const published = await service.listPublished(4);
  const previous = today
    ? published.filter((m) => m.id !== today.id).slice(0, 3)
    : published.slice(0, 3);

  return (
    <Container className="pb-[var(--ms-space-10)] pt-[var(--ms-space-7)] md:pt-[var(--ms-space-8)]">
      {today ? (
        <HomeToday meditation={today} />
      ) : (
        <Typography variant="body">
          Aucune méditation disponible pour aujourd&apos;hui.
        </Typography>
      )}

      <Separator tone="default" className="my-[var(--ms-space-9)]" />

      <HomeArchiveTeaser meditations={previous} />

      <div className="mt-[var(--ms-space-9)]">
        <NewsletterSignup />
      </div>
    </Container>
  );
}
