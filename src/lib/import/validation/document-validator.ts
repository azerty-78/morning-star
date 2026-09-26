import {
  SupportedImportFormat,
  type ImportFileMeta,
} from "@/domain/import";

const MAX_BYTES = 15 * 1024 * 1024; // 15 Mo

const MIME_BY_FORMAT: Record<SupportedImportFormat, string[]> = {
  [SupportedImportFormat.PDF]: ["application/pdf"],
  [SupportedImportFormat.DOC]: ["application/msword"],
  [SupportedImportFormat.DOCX]: [
    "application/vnd.openxmlformats-officedocument.wordprocessingml.document",
  ],
};

export interface FileValidationResult {
  ok: boolean;
  meta?: ImportFileMeta;
  errors: string[];
}

/**
 * Validation du fichier uploadé (type, taille) — avant extraction.
 */
export class DocumentValidator {
  validate(input: {
    filename: string;
    mimeType: string;
    sizeBytes: number;
  }): FileValidationResult {
    const errors: string[] = [];
    const format = detectFormat(input.filename, input.mimeType);

    if (!format) {
      errors.push(
        "Format non supporté. Déposez un fichier PDF, DOC ou DOCX.",
      );
    }

    if (input.sizeBytes <= 0) {
      errors.push("Fichier vide.");
    }

    if (input.sizeBytes > MAX_BYTES) {
      errors.push("Fichier trop volumineux (max. 15 Mo).");
    }

    if (errors.length > 0 || !format) {
      return { ok: false, errors };
    }

    return {
      ok: true,
      errors: [],
      meta: {
        filename: input.filename,
        mimeType: input.mimeType || MIME_BY_FORMAT[format][0]!,
        sizeBytes: input.sizeBytes,
        format,
      },
    };
  }
}

export function detectFormat(
  filename: string,
  mimeType: string,
): SupportedImportFormat | null {
  const lower = filename.toLowerCase();
  if (lower.endsWith(".pdf") || mimeType === "application/pdf") {
    return SupportedImportFormat.PDF;
  }
  if (lower.endsWith(".docx") || mimeType.includes("wordprocessingml")) {
    return SupportedImportFormat.DOCX;
  }
  if (lower.endsWith(".doc") || mimeType === "application/msword") {
    return SupportedImportFormat.DOC;
  }
  return null;
}
