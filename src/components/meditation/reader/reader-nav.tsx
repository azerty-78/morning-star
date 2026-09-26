import { ButtonLink, Typography } from "@/components/ui";
import { PUBLIC_ROUTES } from "@/constants/routes";
import type { DailyMeditation } from "@/domain/meditation";
import { formatPublicationDate } from "@/lib/utils";

export interface ReaderNavProps {
  previous: DailyMeditation | null;
  next: DailyMeditation | null;
}

export function ReaderNav({ previous, next }: ReaderNavProps) {
  return (
    <nav
      aria-label="Méditations adjacentes"
      className="grid gap-6 border-t border-ms-black pt-8 md:grid-cols-2"
    >
      <div>
        {previous ? (
          <>
            <Typography variant="label" className="mb-3 text-ms-muted">
              Précédente
            </Typography>
            <Typography variant="meta" className="mb-2">
              {formatPublicationDate(previous.publicationDate)}
            </Typography>
            <Typography variant="subtitle" as="p" className="mb-4 text-ms-fg">
              {previous.title}
            </Typography>
            <ButtonLink
              href={`${PUBLIC_ROUTES.meditations}/${previous.slug}`}
              variant="secondary"
              size="sm"
            >
              Lire
            </ButtonLink>
          </>
        ) : (
          <Typography variant="meta">Pas de méditation précédente.</Typography>
        )}
      </div>

      <div className="md:text-right">
        {next ? (
          <>
            <Typography variant="label" className="mb-3 text-ms-muted">
              Suivante
            </Typography>
            <Typography variant="meta" className="mb-2">
              {formatPublicationDate(next.publicationDate)}
            </Typography>
            <Typography
              variant="subtitle"
              as="p"
              className="mb-4 text-ms-fg md:ml-auto md:max-w-sm"
            >
              {next.title}
            </Typography>
            <ButtonLink
              href={`${PUBLIC_ROUTES.meditations}/${next.slug}`}
              variant="primary"
              size="sm"
            >
              Lire
            </ButtonLink>
          </>
        ) : (
          <Typography variant="meta">Pas de méditation suivante.</Typography>
        )}
      </div>
    </nav>
  );
}
