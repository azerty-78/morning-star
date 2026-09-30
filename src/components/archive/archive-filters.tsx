import { Button, Grid, GridItem, Input } from "@/components/ui";
import type {
  ArchiveFacets,
  NormalizedArchiveQuery,
} from "@/domain/meditation";
import { ArchiveSearchScope, ArchiveSort } from "@/domain/meditation";
import { PUBLIC_ROUTES } from "@/constants/routes";
import Link from "next/link";

export interface ArchiveFiltersProps {
  query: NormalizedArchiveQuery;
  facets: ArchiveFacets;
}

/**
 * Formulaire GET — filtres archives (éditorial, sobre).
 */
export function ArchiveFilters({ query, facets }: ArchiveFiltersProps) {
  const hasActiveFilters = Boolean(
    query.q ||
      query.date ||
      query.year ||
      query.theme ||
      query.scope !== ArchiveSearchScope.ALL ||
      query.sort !== ArchiveSort.NEWEST,
  );

  return (
    <section
      aria-labelledby="archive-filters-heading"
      className="rounded-[22px] bg-white p-4 shadow-[0_1px_2px_rgba(26,26,26,0.05)] sm:p-5"
    >
      <h2 id="archive-filters-heading" className="mb-4 text-[15px] font-semibold text-ms-black">
        Filtrer
      </h2>

      <form action={PUBLIC_ROUTES.archive} method="get" className="flex flex-col gap-4 sm:gap-8">
        <Grid cols={12} gap="md">
          <GridItem span={12} className="md:col-span-6">
            <Input
              name="q"
              label="Recherche"
              defaultValue={query.q}
              placeholder="Mot, titre, passage…"
              autoComplete="off"
            />
          </GridItem>

          <GridItem span={12} className="md:col-span-3">
            <FieldSelect
              id="archive-scope"
              name="in"
              label="Chercher dans"
              defaultValue={query.scope}
              options={[
                { value: ArchiveSearchScope.ALL, label: "Titre et contenu" },
                { value: ArchiveSearchScope.TITLE, label: "Titre seulement" },
                { value: ArchiveSearchScope.BODY, label: "Contenu seulement" },
              ]}
            />
          </GridItem>

          <GridItem span={12} className="md:col-span-3">
            <FieldSelect
              id="archive-sort"
              name="sort"
              label="Tri"
              defaultValue={query.sort}
              options={[
                { value: ArchiveSort.NEWEST, label: "Plus récentes" },
                { value: ArchiveSort.OLDEST, label: "Plus anciennes" },
              ]}
            />
          </GridItem>

          <GridItem span={12} className="md:col-span-3">
            <Input
              name="date"
              type="date"
              label="Date exacte"
              defaultValue={query.date ?? ""}
            />
          </GridItem>

          <GridItem span={12} className="md:col-span-3">
            <FieldSelect
              id="archive-year"
              name="year"
              label="Année"
              defaultValue={query.year ? String(query.year) : ""}
              options={[
                { value: "", label: "Toutes" },
                ...facets.years.map((y) => ({
                  value: String(y),
                  label: String(y),
                })),
              ]}
            />
          </GridItem>

          <GridItem span={12} className="md:col-span-3">
            <FieldSelect
              id="archive-theme"
              name="theme"
              label="Thème"
              defaultValue={query.theme ?? ""}
              options={[
                { value: "", label: "Tous" },
                ...facets.themes.map((t) => ({
                  value: t.value,
                  label: `${t.label} (${t.count})`,
                })),
              ]}
            />
          </GridItem>

          <GridItem
            span={12}
            className="flex flex-col gap-3 sm:flex-row sm:items-end md:col-span-3"
          >
            <Button type="submit" variant="primary" className="w-full sm:w-auto">
              Appliquer
            </Button>
            {hasActiveFilters ? (
              <Link
                href={PUBLIC_ROUTES.archive}
                className="inline-flex h-11 items-center justify-center px-2 text-[15px] font-semibold text-ms-gold-dark no-underline hover:text-ms-black"
              >
                Réinitialiser
              </Link>
            ) : null}
          </GridItem>
        </Grid>
      </form>
    </section>
  );
}

function FieldSelect({
  id,
  name,
  label,
  defaultValue,
  options,
}: {
  id: string;
  name: string;
  label: string;
  defaultValue: string;
  options: Array<{ value: string; label: string }>;
}) {
  return (
    <div className="flex flex-col gap-[var(--ms-space-2)]">
      <label
        htmlFor={id}
        className="text-[13px] font-medium text-ms-gray-600"
      >
        {label}
      </label>
      <select
        id={id}
        name={name}
        defaultValue={defaultValue}
        className="h-12 w-full min-w-0 max-w-full cursor-pointer rounded-xl border border-ms-gold/30 bg-ms-cream-deep px-3 text-[16px] text-ms-black focus-visible:border-ms-gold focus-visible:outline-none"
      >
        {options.map((opt) => (
          <option key={opt.value || "all"} value={opt.value}>
            {opt.label}
          </option>
        ))}
      </select>
    </div>
  );
}
