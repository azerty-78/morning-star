/**
 * Modèles Bible — indépendants de toute traduction concrète.
 * Les versets appartiennent à une traduction ; les livres canoniques
 * sont identifiés par `canonicalId` stable (jhn, rom, psa…).
 */

export type BibleLicenseKind =
  | "public_domain"
  | "licensed"
  | "unknown"
  | "restricted";

export interface BibleTranslation {
  id: string;
  /** Code court : LSG1910, LSG1990, BDS… */
  code: string;
  name: string;
  language: string;
  /** Notice affichée dans le Dialog (attribution). */
  licenseNotice?: string;
  licenseKind: BibleLicenseKind;
  /**
   * true uniquement si la licence a été vérifiée et l'import autorisé.
   * Les traductions non vérifiées n'exposent aucun texte verset.
   */
  licenseVerified: boolean;
  /** true si le texte doit être importé (pas de contenu embarqué). */
  requiresImport: boolean;
  isDefault: boolean;
}

export interface BibleBook {
  id: string;
  translationId: string;
  /** Identifiant canonique stable (indépendant de la traduction). */
  canonicalId: string;
  name: string;
  abbreviation: string;
  order: number;
}

export interface BibleVerse {
  id: string;
  bookId: string;
  chapter: number;
  verse: number;
  text: string;
}
