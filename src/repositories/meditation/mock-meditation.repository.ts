import type { DailyMeditation } from "@/domain/meditation";
import { MeditationStatus } from "@/domain/meditation";
import { mockMeditations } from "@/lib/mock";
import type { MeditationRepository } from "./meditation.repository";

/** Implémentation mock — utilisée tant que DATA_SOURCE != "prisma". */
export class MockMeditationRepository implements MeditationRepository {
  async findById(id: string): Promise<DailyMeditation | null> {
    return mockMeditations.find((m) => m.id === id) ?? null;
  }

  async findBySlug(slug: string): Promise<DailyMeditation | null> {
    return mockMeditations.find((m) => m.slug === slug) ?? null;
  }

  async findByPublicationDate(date: string): Promise<DailyMeditation | null> {
    return (
      mockMeditations.find(
        (m) =>
          m.publicationDate === date &&
          m.status === MeditationStatus.PUBLISHED,
      ) ?? null
    );
  }

  async findPublished(limit = 20): Promise<DailyMeditation[]> {
    return mockMeditations
      .filter((m) => m.status === MeditationStatus.PUBLISHED)
      .sort((a, b) => b.publicationDate.localeCompare(a.publicationDate))
      .slice(0, limit);
  }

  async search(query: string): Promise<DailyMeditation[]> {
    const q = query.trim().toLowerCase();
    if (!q) return [];
    return mockMeditations.filter(
      (m) =>
        m.status === MeditationStatus.PUBLISHED &&
        (m.title.toLowerCase().includes(q) ||
          m.excerpt.toLowerCase().includes(q) ||
          m.body.toLowerCase().includes(q)),
    );
  }
}
