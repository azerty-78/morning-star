import type {
  BiblePassage,
  BibleTranslation,
  ResolvedBibleReference,
} from "@/domain/bible";
import { collectUniqueReferences, passageLookupKey, referenceKey } from "@/lib/bible";
import { getBibleRepository } from "@/lib/db";
import type { BibleReference } from "@/domain/meditation";

export class BibleService {
  constructor(private readonly repo = getBibleRepository()) {}

  async listTranslations(): Promise<BibleTranslation[]> {
    return this.repo.listTranslations();
  }

  async getDefaultTranslationCode(): Promise<string> {
    return this.repo.getDefaultTranslationCode();
  }

  async getPassage(
    reference: ResolvedBibleReference,
    translationCode?: string,
  ): Promise<BiblePassage | null> {
    return this.repo.findPassage(reference, translationCode);
  }

  /**
   * Résout les passages pour un corps de méditation + références structurées.
   * Précharge toutes les traductions disponibles (lecture 100 % interne).
   */
  async resolvePassagesForMeditation(
    body: string,
    structured: BibleReference[] = [],
  ): Promise<{
    references: ResolvedBibleReference[];
    /** Clé `${translationCode}::${referenceKey}` */
    passages: Record<string, BiblePassage>;
    translationCode: string;
    translations: BibleTranslation[];
  }> {
    const translations = await this.repo.listTranslations();
    const translationCode = await this.repo.getDefaultTranslationCode();
    const references = collectUniqueReferences(
      body,
      structured.map((r) => r.label),
    );

    const passages: Record<string, BiblePassage> = {};
    for (const translation of translations) {
      const batch = await this.repo.findPassages(
        references,
        translation.code,
      );
      for (const [key, passage] of Object.entries(batch)) {
        passages[passageLookupKey(translation.code, key)] = passage;
      }
    }

    return { references, passages, translationCode, translations };
  }
}

export function createBibleService(): BibleService {
  return new BibleService();
}

export { referenceKey };
