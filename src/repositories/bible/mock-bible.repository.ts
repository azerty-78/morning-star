import type {
  BiblePassage,
  BibleTranslation,
  ResolvedBibleReference,
} from "@/domain/bible";
import { referenceKey } from "@/lib/bible/parse-reference";
import {
  MOCK_DEFAULT_TRANSLATION_CODE,
  buildMockPassage,
  getMockTranslation,
  mockBibleTranslations,
  translationHasMockContent,
} from "@/lib/mock";
import type { BibleRepository } from "./bible.repository";

export class MockBibleRepository implements BibleRepository {
  async listTranslations(): Promise<BibleTranslation[]> {
    return mockBibleTranslations;
  }

  async findTranslationByCode(code: string): Promise<BibleTranslation | null> {
    return getMockTranslation(code) ?? null;
  }

  async getDefaultTranslationCode(): Promise<string> {
    const def = mockBibleTranslations.find((t) => t.isDefault);
    return def?.code ?? MOCK_DEFAULT_TRANSLATION_CODE;
  }

  async hasVerseContent(translationCode: string): Promise<boolean> {
    return translationHasMockContent(translationCode);
  }

  async findPassage(
    reference: ResolvedBibleReference,
    translationCode?: string,
  ): Promise<BiblePassage | null> {
    const code =
      translationCode ?? (await this.getDefaultTranslationCode());
    return buildMockPassage(reference, code);
  }

  async findPassages(
    references: ResolvedBibleReference[],
    translationCode?: string,
  ): Promise<Record<string, BiblePassage>> {
    const code =
      translationCode ?? (await this.getDefaultTranslationCode());
    const result: Record<string, BiblePassage> = {};
    for (const ref of references) {
      const passage = buildMockPassage(ref, code);
      if (passage) result[referenceKey(ref)] = passage;
    }
    return result;
  }
}
