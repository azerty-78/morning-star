import type { Metadata } from "next";
import { Container, Separator, Typography } from "@/components/ui";
import {
  HomeArchiveTeaser,
  HomeToday,
  NewsletterSignup,
} from "@/components/public";
import { APP_DESCRIPTION } from "@/constants/app";
import { PUBLIC_ROUTES } from "@/constants/routes";
import { buildPublicPageMetadata } from "@/lib/seo";
import { createMeditationService } from "@/services/meditation";

export const metadata: Metadata = buildPublicPageMetadata({
  title: "Méditation du jour",
  description: APP_DESCRIPTION,
  path: PUBLIC_ROUTES.home,
});

export default async function HomePage() {
  const service = createMeditationService();
  const today = await service.getToday();
  const published = await service.listPublished(4);
  const previous = today
    ? published.filter((m) => m.id !== today.id).slice(0, 3)
    : published.slice(0, 3);

  return (
    <Container className="pb-6 pt-[var(--ms-space-7)] md:pt-[var(--ms-space-8)]">
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
