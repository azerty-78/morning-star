import { Separator } from "@/components/ui";
import type {
  BiblePassage,
  BibleTranslation,
} from "@/domain/bible";
import type { DailyMeditation } from "@/domain/meditation";
import { MeditationReaderInteractive } from "./meditation-reader-interactive";
import { ReaderHeader } from "./reader-header";
import { ReaderNav } from "./reader-nav";

export interface MeditationReaderProps {
  meditation: DailyMeditation;
  authorName: string;
  passages: Record<string, BiblePassage>;
  translations: BibleTranslation[];
  defaultTranslationCode: string;
  previous: DailyMeditation | null;
  next: DailyMeditation | null;
}

/**
 * Lecteur méditation — article sémantique (Server Component).
 * Interactivité Bible / partage isolée dans un îlot client.
 */
export function MeditationReader({
  meditation,
  authorName,
  passages,
  translations,
  defaultTranslationCode,
  previous,
  next,
}: MeditationReaderProps) {
  return (
    <article
      itemScope
      itemType="https://schema.org/Article"
      aria-labelledby="meditation-title"
    >
      <meta itemProp="headline" content={meditation.title} />
      <meta itemProp="datePublished" content={meditation.publicationDate} />
      <meta itemProp="author" content={authorName} />

      <ReaderHeader
        title={meditation.title}
        subtitle={meditation.subtitle}
        date={meditation.publicationDate}
        authorName={authorName}
      />

      <MeditationReaderInteractive
        meditation={meditation}
        authorName={authorName}
        passages={passages}
        translations={translations}
        defaultTranslationCode={defaultTranslationCode}
      />

      <Separator tone="default" className="my-12 md:my-16" />

      <ReaderNav previous={previous} next={next} />
    </article>
  );
}
