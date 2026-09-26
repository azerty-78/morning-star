import {
  collectUniqueReferences,
  detectBibleReferences,
  parseBibleReference,
} from "./parse-reference";
import type {
  BibleReferenceMatch,
  ResolvedBibleReference,
} from "@/domain/bible";

/**
 * Parseur de références bibliques (indépendant de la traduction).
 * Délègue aux fonctions bas niveau — point d'extension pour formats additionnels.
 */
export class BibleReferenceParser {
  parse(raw: string): ResolvedBibleReference | null {
    return parseBibleReference(raw);
  }

  detectInText(text: string): BibleReferenceMatch[] {
    return detectBibleReferences(text);
  }

  collectUnique(
    body: string,
    structuredLabels: string[] = [],
  ): ResolvedBibleReference[] {
    return collectUniqueReferences(body, structuredLabels);
  }
}

export function createBibleReferenceParser(): BibleReferenceParser {
  return new BibleReferenceParser();
}
