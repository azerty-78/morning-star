import {
  ARCHIVE_DEFAULT_PAGE_SIZE,
  ARCHIVE_MAX_PAGE_SIZE,
  ArchiveSearchScope,
  ArchiveSort,
  type ArchiveQuery,
  type NormalizedArchiveQuery,
} from "@/domain/meditation";
import { isIsoDate } from "@/lib/validation";

/**
 * Normalise les paramètres URL / API vers une ArchiveQuery Prisma-ready.
 */
export function normalizeArchiveQuery(
  input: ArchiveQuery,
): NormalizedArchiveQuery {
  const q = (input.q ?? "").trim();

  const scope =
    input.scope === ArchiveSearchScope.TITLE ||
    input.scope === ArchiveSearchScope.BODY
      ? input.scope
      : ArchiveSearchScope.ALL;

  const sort =
    input.sort === ArchiveSort.OLDEST
      ? ArchiveSort.OLDEST
      : ArchiveSort.NEWEST;

  const page = Math.max(1, Math.floor(input.page ?? 1));
  const rawSize = Math.floor(input.pageSize ?? ARCHIVE_DEFAULT_PAGE_SIZE);
  const pageSize = Math.min(
    ARCHIVE_MAX_PAGE_SIZE,
    Math.max(1, rawSize),
  );

  const date =
    input.date && isIsoDate(input.date) ? input.date : undefined;

  const year =
    typeof input.year === "number" &&
    Number.isFinite(input.year) &&
    input.year >= 1900 &&
    input.year <= 2100
      ? Math.trunc(input.year)
      : undefined;

  const theme = input.theme?.trim() ? input.theme.trim().toLowerCase() : undefined;

  return {
    q,
    scope,
    ...(date ? { date } : {}),
    ...(year ? { year } : {}),
    ...(theme ? { theme } : {}),
    sort,
    page,
    pageSize,
  };
}

export function parseArchiveSearchParams(
  params: Record<string, string | string[] | undefined>,
): ArchiveQuery {
  const get = (key: string): string | undefined => {
    const value = params[key];
    if (Array.isArray(value)) return value[0];
    return value;
  };

  const yearRaw = get("year");
  const pageRaw = get("page");
  const pageSizeRaw = get("pageSize");
  const scopeRaw = get("in") ?? get("scope");
  const sortRaw = get("sort");

  return {
    q: get("q"),
    scope:
      scopeRaw === "title"
        ? ArchiveSearchScope.TITLE
        : scopeRaw === "body"
          ? ArchiveSearchScope.BODY
          : ArchiveSearchScope.ALL,
    date: get("date"),
    year: yearRaw ? Number(yearRaw) : undefined,
    theme: get("theme"),
    sort:
      sortRaw === "oldest" ? ArchiveSort.OLDEST : ArchiveSort.NEWEST,
    page: pageRaw ? Number(pageRaw) : 1,
    pageSize: pageSizeRaw ? Number(pageSizeRaw) : undefined,
  };
}

/** Construit la query string archives (sans pageSize par défaut). */
export function buildArchiveSearchParams(
  query: Partial<NormalizedArchiveQuery>,
  overrides: Partial<NormalizedArchiveQuery> = {},
): URLSearchParams {
  const merged = { ...query, ...overrides };
  const params = new URLSearchParams();

  if (merged.q) params.set("q", merged.q);
  if (merged.scope && merged.scope !== ArchiveSearchScope.ALL) {
    params.set("in", merged.scope);
  }
  if (merged.date) params.set("date", merged.date);
  if (merged.year) params.set("year", String(merged.year));
  if (merged.theme) params.set("theme", merged.theme);
  if (merged.sort && merged.sort !== ArchiveSort.NEWEST) {
    params.set("sort", merged.sort);
  }
  if (merged.page && merged.page > 1) {
    params.set("page", String(merged.page));
  }

  return params;
}

export function archiveHref(
  query: Partial<NormalizedArchiveQuery>,
  overrides: Partial<NormalizedArchiveQuery> = {},
): string {
  const params = buildArchiveSearchParams(query, overrides);
  const qs = params.toString();
  return qs ? `/archive?${qs}` : "/archive";
}
