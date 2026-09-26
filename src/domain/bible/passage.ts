import type { BibleTranslation } from "./types";

/**
 * Référence biblique résolue (indépendante de l'UI).
 */
export interface ResolvedBibleReference {
  /** Texte tel qu'apparu / demandé, ex. "Jean 3:16" */
  label: string;
  bookId: string;
  bookName: string;
  chapter: number;
  verseStart: number;
  verseEnd: number;
}

export interface BibleVerseUnit {
  verse: number;
  text: string;
}

/**
 * Passage prêt à l'affichage dans le Dialog lecteur.
 */
export interface BiblePassage {
  reference: ResolvedBibleReference;
  translation: BibleTranslation;
  verses: BibleVerseUnit[];
}

export interface BibleReferenceMatch {
  reference: ResolvedBibleReference;
  /** Indices dans la chaîne source */
  start: number;
  end: number;
}
