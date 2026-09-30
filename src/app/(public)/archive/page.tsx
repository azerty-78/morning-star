import type { Metadata } from "next";
import { Container, PageHeader } from "@/components/ui";
import {
  ArchiveEmpty,
  ArchiveError,
  ArchiveFilters,
  ArchivePagination,
  ArchiveResults,
} from "@/components/archive";
import {
  ArchiveSearchScope,
  ArchiveSort,
} from "@/domain/meditation";
import { parseArchiveSearchParams } from "@/lib/archive";
import { PUBLIC_ROUTES } from "@/constants/routes";
import { buildPublicPageMetadata } from "@/lib/seo";
import { createMeditationService } from "@/services/meditation";

export const metadata: Metadata = buildPublicPageMetadata({
  title: "Archive",
  description:
    "Parcourir, rechercher et filtrer les méditations Morning Star.",
  path: PUBLIC_ROUTES.archive,
});


interface PageProps {
  searchParams: Promise<Record<string, string | string[] | undefined>>;
}

export default async function ArchivePage({ searchParams }: PageProps) {
  const params = await searchParams;
  const rawQuery = parseArchiveSearchParams(params);
  const service = createMeditationService();

  try {
    const [result, facets] = await Promise.all([
      service.searchArchive(rawQuery),
      service.getArchiveFacets(),
    ]);

    const hasFilters = Boolean(
      result.query.q ||
        result.query.date ||
        result.query.year ||
        result.query.theme ||
        result.query.scope !== ArchiveSearchScope.ALL ||
        result.query.sort !== ArchiveSort.NEWEST,
    );

    return (
      <Container className="pb-6">
        <PageHeader
          eyebrow="Chronologie"
          title="Archive"
          description="Liste éditoriale des méditations — recherche, filtres et tri chronologique."
        />

        <div className="mt-4">
          <ArchiveFilters query={result.query} facets={facets} />
        </div>

        <div className="mt-4">
          {result.meta.total === 0 ? (
            <ArchiveEmpty hasFilters={hasFilters} />
          ) : (
            <>
              <ArchiveResults result={result} />
              <ArchivePagination
                query={result.query}
                page={result.meta.page}
                pageCount={result.meta.pageCount}
                hasPreviousPage={result.meta.hasPreviousPage}
                hasNextPage={result.meta.hasNextPage}
              />
            </>
          )}
        </div>
      </Container>
    );
  } catch (error) {
    const message =
      error instanceof Error ? error.message : "Erreur inattendue.";

    return (
      <Container className="pb-6">
        <PageHeader
          eyebrow="Chronologie"
          title="Archive"
          description="Liste éditoriale des méditations."
        />
        <div className="mt-4">
          <ArchiveError message={message} />
        </div>
      </Container>
    );
  }
}
