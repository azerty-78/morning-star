import {
  BibleResolveStatus,
  type BibleResolveResult,
  type BibleTranslation,
  type ResolvedBibleReference,
} from "@/domain/bible";
import type { BibleRepository } from "@/repositories/bible";
import { BibleReferenceParser } from "./bible-reference-parser";

/**
 * Résout une référence textuelle vers traduction + livre + chapitre + versets.
 * Ne quitte jamais l'application ; gère licence / import manquant.
 */
export class BibleReferenceResolver {
  constructor(
    private readonly repo: BibleRepository,
    private readonly parser = new BibleReferenceParser(),
  ) {}

  async resolve(
    rawOrReference: string | ResolvedBibleReference,
    translationCode?: string,
  ): Promise<BibleResolveResult> {
    const reference =
      typeof rawOrReference === "string"
        ? this.parser.parse(rawOrReference)
        : rawOrReference;

    if (!reference) {
      return {
        status: BibleResolveStatus.INVALID_REFERENCE,
        reference: null,
        translation: null,
        passage: null,
        message:
          "Référence biblique non reconnue. Vérifiez le livre et la numérotation.",
      };
    }

    const code =
      translationCode ?? (await this.repo.getDefaultTranslationCode());
    const translation = await this.repo.findTranslationByCode(code);

    if (!translation) {
      return {
        status: BibleResolveStatus.TRANSLATION_UNKNOWN,
        reference,
        translation: null,
        passage: null,
        message: `Traduction « ${code} » inconnue.`,
      };
    }

    if (!translation.licenseVerified) {
      return {
        status: BibleResolveStatus.LICENSE_BLOCKED,
        reference,
        translation,
        passage: null,
        message:
          "Cette traduction n'est pas activée : licence non vérifiée. Importez uniquement des textes autorisés.",
      };
    }

    if (translation.requiresImport) {
      const hasContent = await this.repo.hasVerseContent(translation.code);
      if (!hasContent) {
        return {
          status: BibleResolveStatus.IMPORT_REQUIRED,
          reference,
          translation,
          passage: null,
          message: `La traduction ${translation.code} est déclarée mais son texte n'a pas encore été importé.`,
        };
      }
    }

    const passage = await this.repo.findPassage(reference, translation.code);
    if (!passage) {
      return {
        status: BibleResolveStatus.PASSAGE_NOT_FOUND,
        reference,
        translation,
        passage: null,
        message: `Passage ${reference.label} introuvable dans ${translation.code}.`,
      };
    }

    return {
      status: BibleResolveStatus.OK,
      reference,
      translation,
      passage,
      message: "Passage résolu.",
    };
  }

  async resolveMany(
    references: ResolvedBibleReference[],
    translationCode?: string,
  ): Promise<BibleResolveResult[]> {
    return Promise.all(
      references.map((ref) => this.resolve(ref, translationCode)),
    );
  }
}

export function createBibleReferenceResolver(
  repo: BibleRepository,
): BibleReferenceResolver {
  return new BibleReferenceResolver(repo);
}

export type { BibleTranslation };
