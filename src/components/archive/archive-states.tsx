import { Typography } from "@/components/ui";
import { ButtonLink } from "@/components/ui/button-link";
import { PUBLIC_ROUTES } from "@/constants/routes";

export function ArchiveEmpty({
  hasFilters,
}: {
  hasFilters: boolean;
}) {
  return (
    <section
      aria-labelledby="archive-empty-heading"
      className="rounded-[22px] bg-white px-5 py-8 shadow-[0_1px_2px_rgba(26,26,26,0.05)]"
    >
      <Typography
        id="archive-empty-heading"
        variant="title"
        as="h2"
        className="text-[length:var(--ms-text-2xl)]"
      >
        Aucune méditation
      </Typography>
      <Typography variant="lede" className="mt-4 max-w-[var(--ms-measure)]">
        {hasFilters
          ? "Aucun résultat ne correspond à ces critères. Élargissez la recherche ou réinitialisez les filtres."
          : "L'archive est encore vide. Les méditations publiées apparaîtront ici."}
      </Typography>
      {hasFilters ? (
        <div className="mt-8">
          <ButtonLink href={PUBLIC_ROUTES.archive} variant="secondary">
            Réinitialiser
          </ButtonLink>
        </div>
      ) : null}
    </section>
  );
}

export function ArchiveError({ message }: { message?: string }) {
  return (
    <section
      role="alert"
      aria-labelledby="archive-error-heading"
      className="rounded-[22px] bg-white px-5 py-8 shadow-[0_1px_2px_rgba(26,26,26,0.05)]"
    >
      <Typography
        id="archive-error-heading"
        variant="title"
        as="h2"
        className="text-[length:var(--ms-text-2xl)]"
      >
        Impossible de charger l&apos;archive
      </Typography>
      <Typography variant="lede" className="mt-4 max-w-[var(--ms-measure)]">
        {message ??
          "Une erreur est survenue lors de la récupération des méditations. Réessayez dans un instant."}
      </Typography>
      <div className="mt-8">
        <ButtonLink href={PUBLIC_ROUTES.archive} variant="primary">
          Réessayer
        </ButtonLink>
      </div>
    </section>
  );
}

export function ArchiveLoading() {
  return (
    <div
      aria-busy="true"
      aria-live="polite"
      className="flex flex-col gap-8"
    >
      <p className="sr-only">Chargement de l&apos;archive…</p>
      <div className="overflow-hidden rounded-[22px] bg-white shadow-[0_1px_2px_rgba(26,26,26,0.05)]">
        {[1, 2, 3].map((i) => (
          <div
            key={i}
            className="border-b border-black/5 px-4 py-4 last:border-b-0"
          >
            <div className="ms-skeleton h-4 w-1/3 animate-pulse rounded-md bg-ms-cream-deep" />
            <div className="ms-skeleton mt-2 h-3 w-2/3 animate-pulse rounded-md bg-ms-cream-deep" />
          </div>
        ))}
      </div>
    </div>
  );
}
