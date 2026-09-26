import type {
  ArchiveFacets,
  ArchiveQuery,
  ArchiveResult,
  DailyMeditation,
} from "@/domain/meditation";
import { getMeditationRepository } from "@/lib/db";

/**
 * Service méditation — logique métier au-dessus du repository.
 */
export class MeditationService {
  constructor(private readonly repo = getMeditationRepository()) {}

  async getToday(date = todayIso()): Promise<DailyMeditation | null> {
    const today = await this.repo.findByPublicationDate(date);
    if (today) return today;
    const published = await this.repo.findPublished(1);
    return published[0] ?? null;
  }

  async listPublished(limit?: number): Promise<DailyMeditation[]> {
    return this.repo.findPublished(limit);
  }

  async listAll(limit?: number): Promise<DailyMeditation[]> {
    return this.repo.findAll(limit);
  }

  async getBySlug(slug: string): Promise<DailyMeditation | null> {
    return this.repo.findBySlug(slug);
  }

  async search(query: string): Promise<DailyMeditation[]> {
    return this.repo.search(query);
  }

  async searchArchive(query: ArchiveQuery): Promise<ArchiveResult> {
    return this.repo.findArchive(query);
  }

  async getArchiveFacets(): Promise<ArchiveFacets> {
    return this.repo.getArchiveFacets();
  }

  /**
   * Méditations précédente / suivante selon la date de publication.
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
      previous: published[index + 1] ?? null,
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
