import type { BiblePassage } from "./passage";
import type { BibleTranslation } from "./types";
import type { ResolvedBibleReference } from "./passage";

/**
 * Résultat de résolution d'une référence — jamais d'URL externe.
 */
export const BibleResolveStatus = {
  OK: "OK",
  INVALID_REFERENCE: "INVALID_REFERENCE",
  TRANSLATION_UNKNOWN: "TRANSLATION_UNKNOWN",
  LICENSE_BLOCKED: "LICENSE_BLOCKED",
  PASSAGE_NOT_FOUND: "PASSAGE_NOT_FOUND",
  IMPORT_REQUIRED: "IMPORT_REQUIRED",
} as const;

export type BibleResolveStatus =
  (typeof BibleResolveStatus)[keyof typeof BibleResolveStatus];

export interface BibleResolveResult {
  status: BibleResolveStatus;
  /** Référence parsée (même si le texte est absent). */
  reference: ResolvedBibleReference | null;
  translation: BibleTranslation | null;
  passage: BiblePassage | null;
  /** Message UI (français). */
  message: string;
}
