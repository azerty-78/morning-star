import type { DailyMeditation } from "@/domain/meditation";
import { getMeditationRepository } from "@/lib/db";

/**
 * Service méditation — logique métier au-dessus du repository.
 */
export class MeditationService {
  constructor(
    private readonly repo = getMeditationRepository(),
  ) {}

  async getToday(date = todayIso()): Promise<DailyMeditation | null> {
    const today = await this.repo.findByPublicationDate(date);
    if (today) return today;
    // Fallback démo : dernière publiée si pas de méditation pour la date
    const published = await this.repo.findPublished(1);
    return published[0] ?? null;
  }

  async listPublished(limit?: number): Promise<DailyMeditation[]> {
    return this.repo.findPublished(limit);
  }

  async getBySlug(slug: string): Promise<DailyMeditation | null> {
    return this.repo.findBySlug(slug);
  }

  async search(query: string): Promise<DailyMeditation[]> {
    return this.repo.search(query);
  }

  /**
   * Méditations précédente / suivante selon la date de publication (ordre chronologique inverse).
   */
  async getNeighbors(slug: string): Promise<{
    previous: DailyMeditation | null;
    next: DailyMeditation | null;
  }> {
    const published = await this.repo.findPublished(200);
    const index = published.findIndex((m) => m.slug === slug);
    if (index < 0) {
      return { previous: null, next: null };
    }
    return {
      // Liste triée desc : index+1 = plus ancienne = « précédente »
      previous: published[index + 1] ?? null,
      // index-1 = plus récente = « suivante »
      next: published[index - 1] ?? null,
    };
  }
}

function todayIso(): string {
  return new Date().toISOString().slice(0, 10);
}

export function createMeditationService(): MeditationService {
  return new MeditationService();
}
