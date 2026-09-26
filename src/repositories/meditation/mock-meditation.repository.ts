import type {
  ArchiveFacets,
  ArchiveQuery,
  ArchiveResult,
  DailyMeditation,
} from "@/domain/meditation";
import {
  ArchiveSearchScope,
  ArchiveSort,
  MeditationStatus,
} from "@/domain/meditation";
import { normalizeArchiveQuery } from "@/lib/archive";
import { MOCK_THEME_LABELS, mockMeditations } from "@/lib/mock";
import type { MeditationRepository } from "./meditation.repository";

/** Implémentation mock — miroir logique du futur Prisma. */
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
    return this.published()
      .sort((a, b) => b.publicationDate.localeCompare(a.publicationDate))
      .slice(0, limit);
  }

  async search(query: string): Promise<DailyMeditation[]> {
    const result = await this.findArchive({
      q: query,
      scope: ArchiveSearchScope.ALL,
      page: 1,
      pageSize: 100,
    });
    return result.items;
  }

  async findArchive(input: ArchiveQuery): Promise<ArchiveResult> {
    const query = normalizeArchiveQuery(input);
    let items = this.published();

    if (query.date) {
      items = items.filter((m) => m.publicationDate === query.date);
    }

    if (query.year) {
      items = items.filter((m) =>
        m.publicationDate.startsWith(`${query.year}-`),
      );
    }

    if (query.theme) {
      items = items.filter((m) =>
        (m.themes ?? []).some((t) => t.toLowerCase() === query.theme),
      );
    }

    if (query.q) {
      const q = query.q.toLowerCase();
      items = items.filter((m) => matchesScope(m, q, query.scope));
    }

    items = [...items].sort((a, b) => {
      const cmp = a.publicationDate.localeCompare(b.publicationDate);
      return query.sort === ArchiveSort.OLDEST ? cmp : -cmp;
    });

    const total = items.length;
    const pageCount = Math.max(1, Math.ceil(total / query.pageSize));
    const page = Math.min(query.page, pageCount);
    const start = (page - 1) * query.pageSize;
    const pageItems = items.slice(start, start + query.pageSize);

    return {
      items: pageItems,
      meta: {
        total,
        page,
        pageSize: query.pageSize,
        pageCount,
        hasPreviousPage: page > 1,
        hasNextPage: page < pageCount,
      },
      query: { ...query, page },
    };
  }

  async getArchiveFacets(): Promise<ArchiveFacets> {
    const published = this.published();
    const yearSet = new Set<number>();
    const themeCounts = new Map<string, number>();

    for (const m of published) {
      const year = Number(m.publicationDate.slice(0, 4));
      if (Number.isFinite(year)) yearSet.add(year);
      for (const theme of m.themes ?? []) {
        const key = theme.toLowerCase();
        themeCounts.set(key, (themeCounts.get(key) ?? 0) + 1);
      }
    }

    return {
      years: [...yearSet].sort((a, b) => b - a),
      themes: [...themeCounts.entries()]
        .map(([value, count]) => ({
          value,
          label: MOCK_THEME_LABELS[value] ?? capitalize(value),
          count,
        }))
        .sort((a, b) => a.label.localeCompare(b.label, "fr")),
    };
  }

  private published(): DailyMeditation[] {
    return mockMeditations.filter(
      (m) => m.status === MeditationStatus.PUBLISHED,
    );
  }
}

function matchesScope(
  m: DailyMeditation,
  q: string,
  scope: ArchiveSearchScope,
): boolean {
  const title = m.title.toLowerCase();
  const subtitle = (m.subtitle ?? "").toLowerCase();
  const excerpt = m.excerpt.toLowerCase();
  const body = m.body.toLowerCase();

  if (scope === ArchiveSearchScope.TITLE) {
    return title.includes(q) || subtitle.includes(q);
  }
  if (scope === ArchiveSearchScope.BODY) {
    return excerpt.includes(q) || body.includes(q);
  }
  return (
    title.includes(q) ||
    subtitle.includes(q) ||
    excerpt.includes(q) ||
    body.includes(q)
  );
}

function capitalize(value: string): string {
  return value.charAt(0).toUpperCase() + value.slice(1);
}
