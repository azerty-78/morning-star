import { SupportedImportFormat } from "@/domain/import";
import type {
  DocumentParser,
  ParserInput,
  RawExtraction,
} from "./document-parser";
import { MOCK_IMPORT_SAMPLE_TEXT } from "../fixtures/sample-meditation";

/**
 * Extracteur PDF.
 * V1 architecture : fallback mock tant qu'aucune lib PDF n'est branchée.
 * Remplacer `extractWithLibrary` plus tard (pdf.js / unpdf / etc.).
 */
export class PdfParser implements DocumentParser {
  readonly id = "pdf";
  readonly formats = [SupportedImportFormat.PDF] as const;

  canParse(format: SupportedImportFormat, mimeType: string): boolean {
    return (
      format === SupportedImportFormat.PDF ||
      mimeType === "application/pdf"
    );
  }

  async extract(input: ParserInput): Promise<RawExtraction> {
    const libraryResult = await this.extractWithLibrary(input);
    if (libraryResult) return libraryResult;

    return {
      text: MOCK_IMPORT_SAMPLE_TEXT,
      meta: {
        parser: this.id,
        mode: "mock-fallback",
        filename: input.filename,
        bytes: input.bytes.byteLength,
      },
      warnings: [
        "Extraction PDF réelle non branchée — contenu de démonstration utilisé.",
      ],
    };
  }

  /**
   * Point d'extension : brancher ici la lib PDF.
   * Retourner null pour activer le fallback mock.
   */
  protected async extractWithLibrary(
    _input: ParserInput,
  ): Promise<RawExtraction | null> {
    return null;
  }
}
