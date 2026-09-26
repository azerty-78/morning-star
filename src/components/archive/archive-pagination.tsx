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
      className="mt-10 flex flex-col gap-4 border-t border-ms-border pt-8 sm:flex-row sm:items-center sm:justify-between"
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
            className="inline-flex min-h-8 items-center border border-ms-border px-3 text-[length:var(--ms-text-xs)] uppercase tracking-[var(--ms-tracking-wide)] text-ms-muted opacity-35"
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
            className="inline-flex min-h-8 items-center border border-ms-border px-3 text-[length:var(--ms-text-xs)] uppercase tracking-[var(--ms-tracking-wide)] text-ms-muted opacity-35"
          >
            Suivant
          </span>
        )}
      </div>
    </nav>
  );
}
