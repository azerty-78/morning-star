export interface AnalysisResult {
  /** Lignes / paragraphes candidats titre. */
  candidateTitle?: string;
  candidateSubtitle?: string;
  candidateQuote?: string;
  paragraphs: string[];
  warnings: string[];
}

/**
 * Analyse heuristique du texte normalisé (titre, chapô, corps).
 * Règles simples V1 — destinées à être enrichies.
 */
export class ContentAnalyzer {
  analyze(text: string): AnalysisResult {
    const warnings: string[] = [];
    const paragraphs = text
      .split(/\n\n+/)
      .map((p) => p.trim())
      .filter(Boolean);

    if (paragraphs.length === 0) {
      return {
        paragraphs: [],
        warnings: ["Aucun paragraphe détecté."],
      };
    }

    const first = paragraphs[0]!;
    const second = paragraphs[1];

    let candidateTitle = first;
    let candidateSubtitle: string | undefined;
    let bodyStart = 1;

    // Titre court sur la première ligne → sous-titre éventuel
    if (first.length <= 80 && !first.includes(". ")) {
      candidateTitle = first;
      if (second && second.length <= 120 && !second.includes(". ")) {
        candidateSubtitle = second;
        bodyStart = 2;
      }
    } else {
      warnings.push(
        "Titre ambigu — la première ligne a été prise comme titre par défaut.",
      );
      candidateTitle = first.slice(0, 80);
    }

    const bodyParagraphs = paragraphs.slice(bodyStart);
    const candidateQuote = bodyParagraphs.find(
      (p) => p.startsWith("«") || p.startsWith('"') || p.length > 40 && p.length < 180 && p.includes("étoile"),
    );

    return {
      candidateTitle: candidateTitle.trim(),
      candidateSubtitle,
      candidateQuote,
      paragraphs: bodyParagraphs.length > 0 ? bodyParagraphs : paragraphs,
      warnings,
    };
  }
}
