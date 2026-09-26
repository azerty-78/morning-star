import type {
  BiblePassage,
  BibleTranslation,
  ResolvedBibleReference,
} from "@/domain/bible";
import { referenceKey } from "@/lib/bible";
import {
  MOCK_DEFAULT_TRANSLATION_CODE,
  buildMockPassage,
  mockBibleTranslations,
} from "@/lib/mock";
import type { BibleRepository } from "./bible.repository";

export class MockBibleRepository implements BibleRepository {
  async listTranslations(): Promise<BibleTranslation[]> {
    return mockBibleTranslations;
  }

  async getDefaultTranslationCode(): Promise<string> {
    return MOCK_DEFAULT_TRANSLATION_CODE;
  }

  async findPassage(
    reference: ResolvedBibleReference,
    translationCode?: string,
  ): Promise<BiblePassage | null> {
    return buildMockPassage(
      reference,
      translationCode ?? MOCK_DEFAULT_TRANSLATION_CODE,
    );
  }

  async findPassages(
    references: ResolvedBibleReference[],
    translationCode?: string,
  ): Promise<Record<string, BiblePassage>> {
    const code = translationCode ?? MOCK_DEFAULT_TRANSLATION_CODE;
    const result: Record<string, BiblePassage> = {};
    for (const ref of references) {
      const passage = buildMockPassage(ref, code);
      if (passage) result[referenceKey(ref)] = passage;
    }
    return result;
  }
}
