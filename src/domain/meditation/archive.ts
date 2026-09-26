/**
 * Requête / résultats d'archives — conçus pour Prisma/PostgreSQL.
 *
 * Mapping futur Prisma (indicatif) :
 * - q + scope=all   → OR [title ILIKE, excerpt ILIKE, body ILIKE]
 *                    ou full-text : to_tsvector('french', ...) @@ plainto_tsquery
 * - scope=title     → title ILIKE
 * - scope=body      → body ILIKE (et excerpt)
 * - date            → publicationDate = @db.Date
 * - year            → EXTRACT(YEAR FROM publicationDate) = year
 *                    ou gte/lt bornes calendaires
 * - theme           → themes has theme (PostgreSQL array)
 * - sort newest     → orderBy publicationDate desc
 * - sort oldest     → orderBy publicationDate asc
 * - page/pageSize   → skip/take
 */

export const ArchiveSearchScope = {
  ALL: "all",
  TITLE: "title",
  BODY: "body",
} as const;

export type ArchiveSearchScope =
  (typeof ArchiveSearchScope)[keyof typeof ArchiveSearchScope];

export const ArchiveSort = {
  NEWEST: "newest",
  OLDEST: "oldest",
} as const;

export type ArchiveSort = (typeof ArchiveSort)[keyof typeof ArchiveSort];

export const ARCHIVE_DEFAULT_PAGE_SIZE = 5;
export const ARCHIVE_MAX_PAGE_SIZE = 50;

export interface ArchiveQuery {
  /** Recherche texte (titre et/ou contenu selon scope) */
  q?: string;
  scope?: ArchiveSearchScope;
  /** Date exacte YYYY-MM-DD */
  date?: string;
  /** Année civile */
  year?: number;
  /** Thème (slug ou libellé normalisé) */
  theme?: string;
  sort?: ArchiveSort;
  page?: number;
  pageSize?: number;
}

export interface ArchiveResultMeta {
  total: number;
  page: number;
  pageSize: number;
  pageCount: number;
  hasPreviousPage: boolean;
  hasNextPage: boolean;
}

export interface ArchiveResult {
  items: import("./types").DailyMeditation[];
  meta: ArchiveResultMeta;
  /** Requête normalisée appliquée */
  query: NormalizedArchiveQuery;
}

export interface NormalizedArchiveQuery {
  q: string;
  scope: ArchiveSearchScope;
  date?: string;
  year?: number;
  theme?: string;
  sort: ArchiveSort;
  page: number;
  pageSize: number;
}

export interface ArchiveFacets {
  years: number[];
  themes: Array<{ value: string; label: string; count: number }>;
}
