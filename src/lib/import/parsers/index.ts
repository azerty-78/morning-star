import type { SupportedImportFormat } from "@/domain/import";
import type { DocumentParser } from "./document-parser";
import { PdfParser } from "./pdf-parser";
import { WordParser } from "./word-parser";

const defaultParsers: DocumentParser[] = [new PdfParser(), new WordParser()];

export function resolveDocumentParser(
  format: SupportedImportFormat,
  mimeType: string,
  parsers: DocumentParser[] = defaultParsers,
): DocumentParser | null {
  return (
    parsers.find((parser) => parser.canParse(format, mimeType)) ?? null
  );
}

export { PdfParser, WordParser };
export type { DocumentParser, ParserInput, RawExtraction } from "./document-parser";
