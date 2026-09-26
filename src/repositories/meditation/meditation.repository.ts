import type {
  ArchiveFacets,
  ArchiveQuery,
  ArchiveResult,
  DailyMeditation,
} from "@/domain/meditation";

/**
 * Contrat repository méditations.
 * `findArchive` / `getArchiveFacets` sont pensés pour un mapping Prisma direct.
 */
export interface MeditationRepository {
  findById(id: string): Promise<DailyMeditation | null>;
  findBySlug(slug: string): Promise<DailyMeditation | null>;
  findByPublicationDate(date: string): Promise<DailyMeditation | null>;
  findPublished(limit?: number): Promise<DailyMeditation[]>;
  /** Toutes les méditations (admin) — brouillons inclus. */
  findAll(limit?: number): Promise<DailyMeditation[]>;
  /** @deprecated Préférer findArchive — conservé pour compat. */
  search(query: string): Promise<DailyMeditation[]>;

  /**
   * Archive paginée : recherche, filtres, tri.
   * Implémentation Prisma future : where + orderBy + skip/take + count.
   */
  findArchive(query: ArchiveQuery): Promise<ArchiveResult>;

  /**
   * Facettes pour l'UI (années, thèmes).
   * Prisma futur : groupBy / distinct sur publicationDate et themes.
   */
  getArchiveFacets(): Promise<ArchiveFacets>;
}
