/**
 * Architecture d'import de traductions bibliques autorisées.
 *
 * IMPORTANT — licence :
 * Ne jamais embarquer de texte protégé (ex. LSG1990, BDS) sans vérification
 * et autorisation. Cet importeur ne charge que des paquets dont
 * `licenseVerified === true` et `manifest.license` est explicite.
 */

import type { BibleTranslation, BibleVerse } from "@/domain/bible";

export interface BibleTranslationManifest {
  code: string;
  name: string;
  language: string;
  licenseKind: BibleTranslation["licenseKind"];
  licenseNotice: string;
  /** Preuve / référence de droit d'usage (URL interne, contrat, domaine public…). */
  licenseEvidence: string;
  licenseVerified: boolean;
}

export interface BibleTranslationPack {
  manifest: BibleTranslationManifest;
  /** Versets indexés : canonicalId → chapter → verse → text */
  verses: Record<string, Record<number, Record<number, string>>>;
}

export interface BibleTranslationImportResult {
  ok: boolean;
  translationCode: string;
  verseCount: number;
  errors: string[];
}

/**
 * Contrat d'import — implémentation Prisma à brancher plus tard.
 */
export interface BibleTranslationImporter {
  /**
   * Valide le manifeste (licence) puis importe les versets.
   * Refuse tout pack non vérifié.
   */
  importPack(pack: BibleTranslationPack): Promise<BibleTranslationImportResult>;
}

/**
 * Validateur de manifeste — garde-fou licence.
 */
export function assertImportAllowed(
  manifest: BibleTranslationManifest,
): string[] {
  const errors: string[] = [];
  if (!manifest.licenseVerified) {
    errors.push(
      "licenseVerified=false : import refusé. Vérifiez la licence avant import.",
    );
  }
  if (manifest.licenseKind === "restricted" || manifest.licenseKind === "unknown") {
    errors.push(
      `licenseKind=${manifest.licenseKind} : import refusé tant que le statut n'est pas clarifié.`,
    );
  }
  if (!manifest.licenseEvidence.trim()) {
    errors.push("licenseEvidence manquant.");
  }
  if (!manifest.licenseNotice.trim()) {
    errors.push("licenseNotice manquant (attribution utilisateur).");
  }
  return errors;
}

/** Helper pour aplatir un pack vers des lignes BibleVerse (futur repository). */
export function flattenPackVerses(
  pack: BibleTranslationPack,
  bookIdByCanonical: Record<string, string>,
): Omit<BibleVerse, "id">[] {
  const rows: Omit<BibleVerse, "id">[] = [];
  for (const [canonicalId, chapters] of Object.entries(pack.verses)) {
    const bookId = bookIdByCanonical[canonicalId];
    if (!bookId) continue;
    for (const [chapterStr, verses] of Object.entries(chapters)) {
      const chapter = Number(chapterStr);
      for (const [verseStr, text] of Object.entries(verses)) {
        rows.push({
          bookId,
          chapter,
          verse: Number(verseStr),
          text,
        });
      }
    }
  }
  return rows;
}
