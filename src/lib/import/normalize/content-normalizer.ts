export interface NormalizationResult {
  text: string;
  warnings: string[];
}

/**
 * Normalise le texte extrait (espaces, césures, caractères parasites).
 * Étape progressive — règles ajoutables sans toucher au pipeline.
 */
export class ContentNormalizer {
  normalize(raw: string): NormalizationResult {
    const warnings: string[] = [];
    let text = raw;

    // Unifier les fins de ligne
    text = text.replace(/\r\n/g, "\n").replace(/\r/g, "\n");

    // Césures PDF courantes : "pa-\nrole" → "parole"
    text = text.replace(/(\p{L})-\n(\p{L})/gu, "$1$2");

    // Espaces non breakables / tabs
    text = text.replace(/\u00a0/g, " ").replace(/\t/g, " ");

    // Compresser espaces horizontaux
    text = text.replace(/[^\S\n]{2,}/g, " ");

    // Plus de 2 sauts de ligne → double
    text = text.replace(/\n{3,}/g, "\n\n");

    text = text.trim();

    if (!text) {
      warnings.push("Texte vide après normalisation.");
    }

    return { text, warnings };
  }
}
