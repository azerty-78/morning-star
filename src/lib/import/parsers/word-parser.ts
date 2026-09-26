import { SupportedImportFormat } from "@/domain/import";
import type {
  DocumentParser,
  ParserInput,
  RawExtraction,
} from "./document-parser";
import { MOCK_IMPORT_SAMPLE_TEXT } from "../fixtures/sample-meditation";

/**
 * Extracteur Word (.doc / .docx).
 * V1 : fallback mock. Brancher mammoth (docx) / antiword-like (doc) plus tard.
 */
export class WordParser implements DocumentParser {
  readonly id = "word";
  readonly formats = [
    SupportedImportFormat.DOC,
    SupportedImportFormat.DOCX,
  ] as const;

  canParse(format: SupportedImportFormat, mimeType: string): boolean {
    if (
      format === SupportedImportFormat.DOC ||
      format === SupportedImportFormat.DOCX
    ) {
      return true;
    }
    return (
      mimeType.includes("word") ||
      mimeType.includes("msword") ||
      mimeType.includes("officedocument.wordprocessingml")
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
        format: input.format,
        filename: input.filename,
        bytes: input.bytes.byteLength,
      },
      warnings: [
        input.format === SupportedImportFormat.DOC
          ? "Parser .doc réel non branché — contenu de démonstration utilisé."
          : "Parser .docx réel non branché — contenu de démonstration utilisé.",
      ],
    };
  }

  protected async extractWithLibrary(
    _input: ParserInput,
  ): Promise<RawExtraction | null> {
    return null;
  }
}
