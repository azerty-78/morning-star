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
      className="border border-ms-border px-6 py-12 md:px-10"
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
      className="border border-ms-black px-6 py-12 md:px-10"
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
      <Typography variant="label" className="text-ms-muted">
        Chargement de l&apos;archive…
      </Typography>
      <div className="border-y border-ms-black">
        {[1, 2, 3].map((i) => (
          <div
            key={i}
            className="grid gap-3 border-t border-ms-border py-7 first:border-t-0 md:grid-cols-12 md:gap-6 md:py-8"
          >
            <div className="h-4 w-24 bg-ms-gray-100 md:col-span-3" />
            <div className="space-y-3 md:col-span-8 md:col-start-5">
              <div className="h-6 w-3/4 max-w-md bg-ms-gray-100" />
              <div className="h-4 w-full max-w-lg bg-ms-gray-100" />
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
