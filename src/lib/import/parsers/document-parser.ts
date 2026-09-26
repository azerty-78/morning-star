import type { SupportedImportFormat } from "@/domain/import";

/** Entrée binaire / buffer pour un parser. */
export interface ParserInput {
  filename: string;
  mimeType: string;
  format: SupportedImportFormat;
  /** Contenu fichier (Node Buffer ou Uint8Array). */
  bytes: Uint8Array;
}

export interface RawExtraction {
  text: string;
  /** Métadonnées optionnelles (pages, auteur PDF, etc.). */
  meta?: Record<string, string | number | boolean | undefined>;
  warnings?: string[];
}

/**
 * Contrat d'extraction — implémentations progressives (PDF, Word…).
 */
export interface DocumentParser {
  readonly id: string;
  readonly formats: readonly SupportedImportFormat[];
  canParse(format: SupportedImportFormat, mimeType: string): boolean;
  extract(input: ParserInput): Promise<RawExtraction>;
}
