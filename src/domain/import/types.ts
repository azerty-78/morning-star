/**
 * Domaine Import — jobs, étapes du pipeline, preview éditoriale.
 *
 * Aucune publication automatique : le terminal du pipeline est PREVIEW,
 * puis VALIDATION_ADMIN, puis seulement PUBLICATION ou SCHEDULE.
 */

export const ImportStage = {
  UPLOAD: "UPLOAD",
  VALIDATION: "VALIDATION",
  EXTRACTION: "EXTRACTION",
  NORMALISATION: "NORMALISATION",
  ANALYSE: "ANALYSE",
  STRUCTURATION: "STRUCTURATION",
  BIBLE_DETECTION: "BIBLE_DETECTION",
  CLEANING: "CLEANING",
  PREVIEW: "PREVIEW",
  VALIDATION_ADMIN: "VALIDATION_ADMIN",
  PUBLICATION: "PUBLICATION",
  SCHEDULE: "SCHEDULE",
} as const;

export type ImportStage = (typeof ImportStage)[keyof typeof ImportStage];

export const ImportJobStatus = {
  PENDING: "PENDING",
  RUNNING: "RUNNING",
  AWAITING_REVIEW: "AWAITING_REVIEW",
  APPROVED: "APPROVED",
  SCHEDULED: "SCHEDULED",
  PUBLISHED: "PUBLISHED",
  REJECTED: "REJECTED",
  FAILED: "FAILED",
} as const;

export type ImportJobStatus =
  (typeof ImportJobStatus)[keyof typeof ImportJobStatus];

export const SupportedImportFormat = {
  PDF: "pdf",
  DOC: "doc",
  DOCX: "docx",
} as const;

export type SupportedImportFormat =
  (typeof SupportedImportFormat)[keyof typeof SupportedImportFormat];

export interface ImportFileMeta {
  filename: string;
  mimeType: string;
  sizeBytes: number;
  format: SupportedImportFormat;
  /** Empreinte optionnelle pour dédupliquer. */
  checksum?: string;
  storageKey?: string;
}

export interface ImportStageResult {
  stage: ImportStage;
  ok: boolean;
  startedAt: string;
  finishedAt: string;
  message?: string;
  warnings?: string[];
}

/**
 * Contenu éditorial proposé — jamais publié sans validation admin.
 */
export interface ImportPreviewContent {
  title: string;
  subtitle?: string;
  excerpt: string;
  body: string;
  highlightQuote?: string;
  publicationDate?: string;
  themes: string[];
  bibleReferences: Array<{
    label: string;
    bookId: string;
    bookName: string;
    chapter: number;
    verseStart?: number;
    verseEnd?: number;
  }>;
  /** Liens Blogspot retirés (audit). */
  removedBlogspotLinks: string[];
  /** Avertissements parser (qualité / ambiguïté). */
  warnings: string[];
}

export interface ImportJob {
  id: string;
  status: ImportJobStatus;
  currentStage: ImportStage;
  file: ImportFileMeta;
  stages: ImportStageResult[];
  /** Texte brut extrait (avant nettoyage final). */
  rawText?: string;
  /** Texte après normalisation / nettoyage. */
  cleanedText?: string;
  preview?: ImportPreviewContent;
  error?: string;
  createdAt: string;
  updatedAt: string;
  /** Renseigné seulement après validation admin explicite. */
  publishedArticleId?: string;
  scheduledAt?: string;
}
