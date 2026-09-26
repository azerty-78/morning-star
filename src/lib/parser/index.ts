/**
 * Parser PDF/DOCX — emplacement réservé pour la phase import.
 * Ne pas implémenter le parsing ici.
 */

export type SupportedDocumentType = "pdf" | "docx";

export interface ParsedDocumentStub {
  type: SupportedDocumentType;
  rawText: string;
}
