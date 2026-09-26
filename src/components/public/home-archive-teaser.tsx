import {
  EditorialCard,
  EditorialCardList,
} from "@/components/editorial";
import { ButtonLink, Typography } from "@/components/ui";
import { PUBLIC_ROUTES } from "@/constants/routes";
import type { DailyMeditation } from "@/domain/meditation";

export interface HomeArchiveTeaserProps {
  meditations: DailyMeditation[];
}

/**
 * Accès archives — liste éditoriale courte, sans cards SaaS.
 */
export function HomeArchiveTeaser({ meditations }: HomeArchiveTeaserProps) {
  if (meditations.length === 0) return null;

  return (
    <section aria-labelledby="archives-heading">
      <div className="mb-8 flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
        <div>
          <Typography variant="label" className="mb-3 text-ms-gold-dark">
            Chronologie
          </Typography>
          <Typography id="archives-heading" variant="title" as="h2">
            Précédemment
          </Typography>
        </div>
        <ButtonLink href={PUBLIC_ROUTES.archive} variant="link">
          Voir toutes les archives
        </ButtonLink>
      </div>

      <EditorialCardList>
        {meditations.map((m, i) => (
          <EditorialCard
            key={m.id}
            href={`${PUBLIC_ROUTES.meditations}/${m.slug}`}
            title={m.title}
            excerpt={m.excerpt}
            date={m.publicationDate}
            index={String(i + 1).padStart(2, "0")}
          />
        ))}
      </EditorialCardList>
    </section>
  );
}
