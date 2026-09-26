import type { DailyMeditation } from "@/domain/meditation";

export interface MeditationRepository {
  findById(id: string): Promise<DailyMeditation | null>;
  findBySlug(slug: string): Promise<DailyMeditation | null>;
  findByPublicationDate(date: string): Promise<DailyMeditation | null>;
  findPublished(limit?: number): Promise<DailyMeditation[]>;
  search(query: string): Promise<DailyMeditation[]>;
}
