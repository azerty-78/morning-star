import type {
  BiblePassage,
  BibleResolveResult,
  BibleTranslation,
  ResolvedBibleReference,
} from "@/domain/bible";
import { BibleResolveStatus } from "@/domain/bible";
import {
  BibleReferenceParser,
  BibleReferenceResolver,
  passageLookupKey,
  referenceKey,
} from "@/lib/bible";
import { getBibleRepository } from "@/lib/db";
import type { BibleReference } from "@/domain/meditation";

/**
 * Façade métier Bible — parsing, résolution, passages.
 * Aucune redirection vers une Bible externe.
 */
export class BibleService {
  private readonly parser = new BibleReferenceParser();
  private readonly resolver: BibleReferenceResolver;

  constructor(private readonly repo = getBibleRepository()) {
    this.resolver = new BibleReferenceResolver(repo, this.parser);
  }

  async listTranslations(): Promise<BibleTranslation[]> {
    return this.repo.listTranslations();
  }

  async getDefaultTranslationCode(): Promise<string> {
    return this.repo.getDefaultTranslationCode();
  }

  parseReference(raw: string): ResolvedBibleReference | null {
    return this.parser.parse(raw);
  }

  async resolve(
    rawOrReference: string | ResolvedBibleReference,
    translationCode?: string,
  ): Promise<BibleResolveResult> {
    return this.resolver.resolve(rawOrReference, translationCode);
  }

  async getPassage(
    reference: ResolvedBibleReference,
    translationCode?: string,
  ): Promise<BiblePassage | null> {
    const result = await this.resolver.resolve(reference, translationCode);
    return result.status === BibleResolveStatus.OK ? result.passage : null;
  }

  /**
   * Précharge les passages pour le lecteur (toutes traductions vérifiées).
   */
  async resolvePassagesForMeditation(
    body: string,
    structured: BibleReference[] = [],
  ): Promise<{
    references: ResolvedBibleReference[];
    passages: Record<string, BiblePassage>;
    translationCode: string;
    translations: BibleTranslation[];
  }> {
    const translations = await this.repo.listTranslations();
    const translationCode = await this.repo.getDefaultTranslationCode();
    const references = this.parser.collectUnique(
      body,
      structured.map((r) => r.label),
    );

    const passages: Record<string, BiblePassage> = {};
    for (const translation of translations) {
      if (!translation.licenseVerified) continue;
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

export { referenceKey, BibleResolveStatus };
