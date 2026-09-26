import type {
  ArchiveFacets,
  ArchiveQuery,
  ArchiveResult,
} from "@/domain/meditation";
import type { MeditationRepository } from "./meditation.repository";

const NOT_WIRED =
  "PrismaMeditationRepository n'est pas encore branché. Utilisez DATA_SOURCE=mock.";

/**
 * Stub Prisma — signatures alignées pour le remplacement futur.
 *
 * findArchive (indicatif) :
 * ```
 * const where = buildWhere(query) // status PUBLISHED + ILIKE + date/year/theme
 * const [total, items] = await Promise.all([
 *   prisma.dailyMeditation.count({ where }),
 *   prisma.dailyMeditation.findMany({
 *     where,
 *     orderBy: { publicationDate: query.sort === 'oldest' ? 'asc' : 'desc' },
 *     skip: (page - 1) * pageSize,
 *     take: pageSize,
 *   }),
 * ])
 * ```
 */
export class PrismaMeditationRepository implements MeditationRepository {
  async findById(): Promise<null> {
    throw new Error(NOT_WIRED);
  }

  async findBySlug(): Promise<null> {
    throw new Error(NOT_WIRED);
  }

  async findByPublicationDate(): Promise<null> {
    throw new Error(NOT_WIRED);
  }

  async findPublished(): Promise<never[]> {
    throw new Error(NOT_WIRED);
  }

  async findAll(): Promise<never[]> {
    throw new Error(NOT_WIRED);
  }

  async search(): Promise<never[]> {
    throw new Error(NOT_WIRED);
  }

  async findArchive(_query: ArchiveQuery): Promise<ArchiveResult> {
    throw new Error(NOT_WIRED);
  }

  async getArchiveFacets(): Promise<ArchiveFacets> {
    throw new Error(NOT_WIRED);
  }
}
