import { ButtonLink, Typography } from "@/components/ui";
import type { NormalizedArchiveQuery } from "@/domain/meditation";
import { archiveHref } from "@/lib/archive";

export interface ArchivePaginationProps {
  query: NormalizedArchiveQuery;
  page: number;
  pageCount: number;
  hasPreviousPage: boolean;
  hasNextPage: boolean;
}

export function ArchivePagination({
  query,
  page,
  pageCount,
  hasPreviousPage,
  hasNextPage,
}: ArchivePaginationProps) {
  if (pageCount <= 1) return null;

  return (
    <nav
      aria-label="Pagination des archives"
      className="mt-4 flex items-center justify-between gap-3"
    >
      <Typography variant="meta">
        Page {page} sur {pageCount}
      </Typography>
      <div className="flex flex-wrap gap-3">
        {hasPreviousPage ? (
          <ButtonLink
            href={archiveHref(query, { page: page - 1 })}
            variant="secondary"
            size="sm"
          >
            Précédent
          </ButtonLink>
        ) : (
          <span
            aria-disabled="true"
            className="inline-flex h-9 items-center rounded-full bg-white px-3.5 text-[14px] font-semibold text-ms-gray-400"
          >
            Précédent
          </span>
        )}
        {hasNextPage ? (
          <ButtonLink
            href={archiveHref(query, { page: page + 1 })}
            variant="primary"
            size="sm"
          >
            Suivant
          </ButtonLink>
        ) : (
          <span
            aria-disabled="true"
            className="inline-flex h-9 items-center rounded-full bg-white px-3.5 text-[14px] font-semibold text-ms-gray-400"
          >
            Suivant
          </span>
        )}
      </div>
    </nav>
  );
}
