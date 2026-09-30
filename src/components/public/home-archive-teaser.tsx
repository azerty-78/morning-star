import {
  EditorialCard,
  EditorialCardList,
} from "@/components/editorial";
import { ButtonLink } from "@/components/ui";
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
      <div className="mb-3 flex items-end justify-between gap-3">
        <h2 id="archives-heading" className="text-[22px] font-semibold tracking-tight text-ms-black">
          Précédemment
        </h2>
        <ButtonLink href={PUBLIC_ROUTES.archive} variant="link">
          Tout voir
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
