/**
 * @deprecated Utiliser `@/lib/import`.
 * Conservé pour ne pas casser d'imports éventuels.
 */
export {
  type DocumentParser,
  PdfParser,
  WordParser,
  createImportPipeline,
} from "@/lib/import";
export type { SupportedImportFormat as SupportedDocumentType } from "@/domain/import";
