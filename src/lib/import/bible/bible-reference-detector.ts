import { detectBibleReferences } from "@/lib/bible";
import type { ResolvedBibleReference } from "@/domain/bible";

export interface BibleDetectionResult {
  references: ResolvedBibleReference[];
  warnings: string[];
}

/**
 * Détecteur de références bibliques pour le pipeline d'import.
 * S'appuie sur `lib/bible` — améliorable indépendamment (alias, formats).
 */
export class BibleReferenceDetector {
  detect(text: string): BibleDetectionResult {
    const matches = detectBibleReferences(text);
    const references = matches.map((m) => m.reference);
    const warnings: string[] = [];

    if (references.length === 0) {
      warnings.push("Aucune référence biblique détectée dans le document.");
    }

    return { references, warnings };
  }
}
