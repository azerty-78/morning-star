/**
 * Point d'entrée historique — réexporte le module import.
 * @deprecated Importer depuis `@/lib/import`.
 */
export {
  type DocumentParser,
  type SupportedImportFormat,
} from "./reexport";

// Compat types
export type { SupportedImportFormat as SupportedDocumentType } from "@/domain/import";
