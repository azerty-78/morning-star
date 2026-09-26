import {
  EditorialCard,
  EditorialCardList,
} from "@/components/editorial";
import { Typography } from "@/components/ui";
import { PUBLIC_ROUTES } from "@/constants/routes";
import type { ArchiveResult } from "@/domain/meditation";
import { MOCK_THEME_LABELS } from "@/lib/mock";

export interface ArchiveResultsProps {
  result: ArchiveResult;
}

export function ArchiveResults({ result }: ArchiveResultsProps) {
  const { items, meta, query } = result;
  const offset = (meta.page - 1) * meta.pageSize;

  return (
    <section aria-labelledby="archive-results-heading">
      <div className="mb-6 flex flex-col gap-2 sm:flex-row sm:items-baseline sm:justify-between">
        <Typography id="archive-results-heading" variant="label" as="h2">
          Résultats
        </Typography>
        <Typography variant="meta">
          {meta.total} méditation{meta.total > 1 ? "s" : ""}
          {query.q ? ` pour « ${query.q} »` : ""}
          {meta.pageCount > 1
            ? ` · page ${meta.page} / ${meta.pageCount}`
            : ""}
        </Typography>
      </div>

      <EditorialCardList>
        {items.map((m, i) => (
          <EditorialCard
            key={m.id}
            href={`${PUBLIC_ROUTES.meditations}/${m.slug}`}
            title={m.title}
            excerpt={m.excerpt}
            date={m.publicationDate}
            index={String(offset + i + 1).padStart(2, "0")}
            themes={m.themes?.map((t) => MOCK_THEME_LABELS[t] ?? t)}
          />
        ))}
      </EditorialCardList>
    </section>
  );
}
