import {
  EditorialCard,
  EditorialCardList,
} from "@/components/editorial";
import { Typography } from "@/components/ui";
import type { DailyMeditation } from "@/domain/meditation";
import { PUBLIC_ROUTES } from "@/constants/routes";

export interface MeditationListProps {
  meditations: DailyMeditation[];
}

export function MeditationList({ meditations }: MeditationListProps) {
  if (meditations.length === 0) {
    return (
      <Typography variant="meta">Aucune méditation pour le moment.</Typography>
    );
  }

  return (
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
  );
}
