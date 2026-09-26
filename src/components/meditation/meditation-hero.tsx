import { Badge, Typography } from "@/components/ui";
import { formatPublicationDate } from "@/lib/utils";
import type { DailyMeditation } from "@/domain/meditation";
import { MOCK_DATA_BANNER } from "@/constants/app";

export interface MeditationHeroProps {
  meditation: DailyMeditation;
  showMockBadge?: boolean;
}

export function MeditationHero({
  meditation,
  showMockBadge = true,
}: MeditationHeroProps) {
  return (
    <article>
      <div className="mb-6 flex flex-wrap items-center gap-3">
        <Typography
          variant="date"
          as="time"
          dateTime={meditation.publicationDate}
        >
          {formatPublicationDate(meditation.publicationDate)}
        </Typography>
        {showMockBadge ? <Badge tone="accent">{MOCK_DATA_BANNER}</Badge> : null}
      </div>

      <Typography variant="display" className="max-w-4xl">
        {meditation.title}
      </Typography>

      {meditation.subtitle ? (
        <Typography variant="subtitle" className="mt-5 max-w-2xl">
          {meditation.subtitle}
        </Typography>
      ) : null}

      {meditation.highlightQuote ? (
        <Typography variant="quote" className="mt-10 max-w-3xl border-l-2 border-ms-accent pl-6">
          {meditation.highlightQuote}
        </Typography>
      ) : null}

      {meditation.bibleReferences.length > 0 ? (
        <ul className="mt-6 flex flex-wrap gap-x-4 gap-y-2">
          {meditation.bibleReferences.map((ref) => (
            <li key={ref.label}>
              <Typography variant="reference" as="span">
                {ref.label}
              </Typography>
            </li>
          ))}
        </ul>
      ) : null}

      <div className="mt-10 max-w-2xl space-y-5">
        {meditation.body.split("\n\n").map((paragraph) => (
          <Typography key={paragraph.slice(0, 24)} variant="body">
            {paragraph}
          </Typography>
        ))}
      </div>
    </article>
  );
}
