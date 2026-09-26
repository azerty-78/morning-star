import type {
  BiblePassage,
  BibleTranslation,
  ResolvedBibleReference,
} from "@/domain/bible";

export interface BibleRepository {
  listTranslations(): Promise<BibleTranslation[]>;
  findTranslationByCode(code: string): Promise<BibleTranslation | null>;
  getDefaultTranslationCode(): Promise<string>;
  /** Indique si des versets sont disponibles pour cette traduction. */
  hasVerseContent(translationCode: string): Promise<boolean>;
  findPassage(
    reference: ResolvedBibleReference,
    translationCode?: string,
  ): Promise<BiblePassage | null>;
  findPassages(
    references: ResolvedBibleReference[],
    translationCode?: string,
  ): Promise<Record<string, BiblePassage>>;
}
