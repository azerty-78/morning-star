import {
  ArticleBody,
  ArticleHeader,
  PullQuote,
} from "@/components/editorial";
import { BibleReferenceList } from "@/components/bible";
import { MOCK_DATA_BANNER } from "@/constants/app";
import type { DailyMeditation } from "@/domain/meditation";

export interface MeditationHeroProps {
  meditation: DailyMeditation;
  showMockBadge?: boolean;
}

export function MeditationHero({
  meditation,
  showMockBadge = true,
}: MeditationHeroProps) {
  const primaryCite = meditation.bibleReferences[0]?.label;

  return (
    <article>
      <ArticleHeader
        title={meditation.title}
        subtitle={meditation.subtitle}
        date={meditation.publicationDate}
        badge={showMockBadge ? MOCK_DATA_BANNER : undefined}
      />

      {meditation.highlightQuote ? (
        <PullQuote cite={primaryCite} className="mt-10">
          {meditation.highlightQuote}
        </PullQuote>
      ) : null}

      {meditation.bibleReferences.length > 0 ? (
        <BibleReferenceList
          references={meditation.bibleReferences}
          compact
          className="mt-8"
        />
      ) : null}

      <ArticleBody content={meditation.body} className="mt-10" />
    </article>
  );
}
