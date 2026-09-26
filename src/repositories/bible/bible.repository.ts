import type {
  BiblePassage,
  BibleTranslation,
  ResolvedBibleReference,
} from "@/domain/bible";

export interface BibleRepository {
  listTranslations(): Promise<BibleTranslation[]>;
  getDefaultTranslationCode(): Promise<string>;
  findPassage(
    reference: ResolvedBibleReference,
    translationCode?: string,
  ): Promise<BiblePassage | null>;
  findPassages(
    references: ResolvedBibleReference[],
    translationCode?: string,
  ): Promise<Record<string, BiblePassage>>;
}
