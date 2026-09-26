import {
  ButtonLink,
  Grid,
  GridItem,
  Separator,
  Typography,
} from "@/components/ui";
import { PUBLIC_ROUTES } from "@/constants/routes";
import type { DailyMeditation } from "@/domain/meditation";
import {
  formatDayNumber,
  formatMonthYear,
  formatPublicationDate,
  formatWeekday,
} from "@/lib/utils";

export interface HomeTodayProps {
  meditation: DailyMeditation;
}

/**
 * Une du jour — composition éditoriale Swiss Style (grille 12).
 */
export function HomeToday({ meditation }: HomeTodayProps) {
  const primaryRef = meditation.bibleReferences[0];
  const readHref = `${PUBLIC_ROUTES.meditations}/${meditation.slug}`;

  return (
    <section aria-labelledby="meditation-du-jour-title">
      <Grid cols={12} gap="lg" className="items-start">
        {/* Rail date / rubrique */}
        <GridItem span={12} className="md:col-span-3">
          <div className="flex flex-col gap-5 md:sticky md:top-8 md:pr-4">
            <Typography variant="label" className="text-ms-gold-dark">
              Méditation du jour
            </Typography>

            <Separator tone="accent" className="w-12" />

            <time
              dateTime={meditation.publicationDate}
              className="block"
              aria-label={formatPublicationDate(meditation.publicationDate)}
            >
              <span className="ms-label block text-ms-muted">
                {formatWeekday(meditation.publicationDate)}
              </span>
              <span
                className="mt-2 block font-sans font-bold leading-none tracking-[var(--ms-tracking-tighter)] text-ms-fg"
                style={{ fontSize: "clamp(3.5rem, 12vw, 5.5rem)" }}
              >
                {formatDayNumber(meditation.publicationDate)}
              </span>
              <span className="mt-2 block text-[length:var(--ms-text-sm)] uppercase tracking-[var(--ms-tracking-wider)] text-ms-gray-700">
                {formatMonthYear(meditation.publicationDate)}
              </span>
            </time>
          </div>
        </GridItem>

        {/* Contenu principal */}
        <GridItem span={12} className="md:col-span-8 md:col-start-5">
          <Typography
            id="meditation-du-jour-title"
            variant="display"
            className="max-w-[18ch]"
          >
            {meditation.title}
          </Typography>

          {meditation.subtitle ? (
            <Typography
              variant="subtitle"
              className="mt-5 max-w-[var(--ms-measure)]"
            >
              {meditation.subtitle}
            </Typography>
          ) : null}

          {primaryRef ? (
            <p className="mt-8">
              <Typography variant="label" as="span" className="mr-3 text-ms-muted">
                Texte
              </Typography>
              <Typography variant="reference" as="cite" className="not-italic">
                {primaryRef.label}
              </Typography>
            </p>
          ) : null}

          <Typography
            variant="lede"
            className="mt-8 max-w-[var(--ms-measure)]"
          >
            {meditation.excerpt}
          </Typography>

          <div className="mt-10 flex flex-col gap-3 sm:flex-row sm:flex-wrap sm:items-center">
            <ButtonLink
              href={readHref}
              variant="primary"
              aria-label={`Lire la méditation : ${meditation.title}`}
            >
              Lire la méditation
            </ButtonLink>
            <ButtonLink href={PUBLIC_ROUTES.archive} variant="secondary">
              Archives
            </ButtonLink>
          </div>
        </GridItem>
      </Grid>
    </section>
  );
}
