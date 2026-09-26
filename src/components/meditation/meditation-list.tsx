import Link from "next/link";
import { Typography } from "@/components/ui";
import { formatPublicationDate } from "@/lib/utils";
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
    <ul className="divide-y divide-ms-border border-y border-ms-border">
      {meditations.map((m) => (
        <li key={m.id}>
          <Link
            href={`${PUBLIC_ROUTES.meditations}/${m.slug}`}
            className="grid gap-2 py-6 no-underline transition-colors hover:bg-ms-gray-100/60 md:grid-cols-12 md:gap-6 md:py-7"
          >
            <Typography
              variant="date"
              as="time"
              dateTime={m.publicationDate}
              className="md:col-span-3"
            >
              {formatPublicationDate(m.publicationDate)}
            </Typography>
            <div className="md:col-span-9">
              <Typography variant="subtitle" as="h2" className="text-ms-fg">
                {m.title}
              </Typography>
              <Typography variant="meta" className="mt-2 max-w-xl">
                {m.excerpt}
              </Typography>
            </div>
          </Link>
        </li>
      ))}
    </ul>
  );
}
