import type { ImportPreviewContent } from "@/domain/import";
import type { ResolvedBibleReference } from "@/domain/bible";
import type { AnalysisResult } from "../analyze/content-analyzer";

export interface StructureInput {
  analysis: AnalysisResult;
  cleanedBody: string;
  references: ResolvedBibleReference[];
  removedBlogspotLinks: string[];
  warnings: string[];
}

/**
 * Transforme l'analyse + nettoyage en preview éditoriale structurée.
 * Ne publie jamais — produit uniquement une proposition pour l'admin.
 */
export class MeditationStructurer {
  structure(input: StructureInput): ImportPreviewContent {
    const { analysis, cleanedBody, references, removedBlogspotLinks } = input;
    const body =
      analysis.paragraphs.length > 0
        ? analysis.paragraphs.join("\n\n")
        : cleanedBody;

    const title = analysis.candidateTitle?.trim() || "Sans titre";
    const excerpt = buildExcerpt(body);

    const themes = inferThemes(title, body);

    return {
      title,
      subtitle: analysis.candidateSubtitle,
      excerpt,
      body,
      highlightQuote: analysis.candidateQuote?.replace(/^[«"]|[»"]$/g, "").trim(),
      themes,
      bibleReferences: references.map((r) => ({
        label: r.label,
        bookId: r.bookId,
        bookName: r.bookName,
        chapter: r.chapter,
        verseStart: r.verseStart,
        verseEnd: r.verseEnd,
      })),
      removedBlogspotLinks,
      warnings: [...input.warnings, ...analysis.warnings],
    };
  }
}

function buildExcerpt(body: string, max = 180): string {
  const plain = body.replace(/\s+/g, " ").trim();
  if (plain.length <= max) return plain;
  const slice = plain.slice(0, max);
  const lastSpace = slice.lastIndexOf(" ");
  return `${(lastSpace > 40 ? slice.slice(0, lastSpace) : slice).trim()}…`;
}

function inferThemes(title: string, body: string): string[] {
  const hay = `${title} ${body}`.toLowerCase();
  const catalog: Array<[string, RegExp]> = [
    ["lumiere", /lumi[eè]re|étoile|etoile/],
    ["espoir", /espoir|esp[eé]rance|promesse/],
    ["priere", /pri[eè]re|silence/],
    ["fidelite", /fid[eé]lit[eé]/],
  ];
  return catalog.filter(([, re]) => re.test(hay)).map(([id]) => id);
}
