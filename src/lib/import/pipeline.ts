import {
  ImportJobStatus,
  ImportStage,
  SupportedImportFormat,
  type ImportFileMeta,
  type ImportJob,
  type ImportStageResult,
} from "@/domain/import";
import { ContentAnalyzer } from "./analyze/content-analyzer";
import { BibleReferenceDetector } from "./bible/bible-reference-detector";
import { BlogspotLinkCleaner } from "./clean/blogspot-link-cleaner";
import { ContentNormalizer } from "./normalize/content-normalizer";
import { resolveDocumentParser } from "./parsers";
import { MeditationStructurer } from "./structure/meditation-structurer";
import { DocumentValidator } from "./validation/document-validator";

export interface PipelineRunInput {
  filename: string;
  mimeType: string;
  sizeBytes: number;
  bytes: Uint8Array;
  /** Identifiant job pré-créé (UPLOAD déjà enregistré). */
  jobId?: string;
}

/**
 * Orchestre le pipeline d'import jusqu'à PREVIEW.
 * Ne passe JAMAIS automatiquement à PUBLICATION / SCHEDULE.
 */
export class ImportPipeline {
  constructor(
    private readonly validator = new DocumentValidator(),
    private readonly normalizer = new ContentNormalizer(),
    private readonly analyzer = new ContentAnalyzer(),
    private readonly bibleDetector = new BibleReferenceDetector(),
    private readonly blogspotCleaner = new BlogspotLinkCleaner(),
    private readonly structurer = new MeditationStructurer(),
  ) {}

  async run(input: PipelineRunInput): Promise<ImportJob> {
    const now = () => new Date().toISOString();
    const stages: ImportStageResult[] = [];
    const jobId = input.jobId ?? createId();

    const fail = (stage: ImportStage, message: string, file?: ImportFileMeta): ImportJob => {
      stages.push(stageResult(stage, false, message));
      return {
        id: jobId,
        status: ImportJobStatus.FAILED,
        currentStage: stage,
        file: file ?? {
          filename: input.filename,
          mimeType: input.mimeType,
          sizeBytes: input.sizeBytes,
          format: SupportedImportFormat.PDF,
        },
        stages,
        error: message,
        createdAt: now(),
        updatedAt: now(),
      };
    };

    // UPLOAD (métadonnées déjà reçues)
    stages.push(
      stageResult(ImportStage.UPLOAD, true, "Fichier reçu."),
    );

    // VALIDATION
    const validation = this.validator.validate({
      filename: input.filename,
      mimeType: input.mimeType,
      sizeBytes: input.sizeBytes,
    });
    if (!validation.ok || !validation.meta) {
      return fail(
        ImportStage.VALIDATION,
        validation.errors.join(" "),
      );
    }
    stages.push(
      stageResult(ImportStage.VALIDATION, true, "Fichier validé."),
    );
    const file = validation.meta;

    // EXTRACTION
    const parser = resolveDocumentParser(file.format, file.mimeType);
    if (!parser) {
      return fail(ImportStage.EXTRACTION, "Aucun parser pour ce format.", file);
    }
    let rawText: string;
    const extractWarnings: string[] = [];
    try {
      const extraction = await parser.extract({
        filename: file.filename,
        mimeType: file.mimeType,
        format: file.format,
        bytes: input.bytes,
      });
      rawText = extraction.text;
      extractWarnings.push(...(extraction.warnings ?? []));
      stages.push(
        stageResult(
          ImportStage.EXTRACTION,
          true,
          `Extraction via ${parser.id}.`,
          extractWarnings,
        ),
      );
    } catch (error) {
      return fail(
        ImportStage.EXTRACTION,
        error instanceof Error ? error.message : "Échec extraction.",
        file,
      );
    }

    // NORMALISATION
    const normalized = this.normalizer.normalize(rawText);
    stages.push(
      stageResult(
        ImportStage.NORMALISATION,
        true,
        "Texte normalisé.",
        normalized.warnings,
      ),
    );

    // ANALYSE
    const analysis = this.analyzer.analyze(normalized.text);
    stages.push(
      stageResult(
        ImportStage.ANALYSE,
        true,
        "Structure heuristique détectée.",
        analysis.warnings,
      ),
    );

    // CLEANING (Blogspot) — avant structuration finale du corps
    // Décision : nettoyer tôt pour que détection Bible / preview soient propres.
    const cleaned = this.blogspotCleaner.clean(normalized.text);
    // Re-analyse légère du corps nettoyé pour les paragraphes
    const cleanedAnalysis = this.analyzer.analyze(cleaned.text);

    // STRUCTURATION (intermédiaire — refs encore à injecter)
    stages.push(
      stageResult(
        ImportStage.STRUCTURATION,
        true,
        "Proposition éditoriale construite.",
      ),
    );

    // DÉTECTION RÉFÉRENCES BIBLIQUES
    const bible = this.bibleDetector.detect(cleaned.text);
    stages.push(
      stageResult(
        ImportStage.BIBLE_DETECTION,
        true,
        `${bible.references.length} référence(s) détectée(s).`,
        bible.warnings,
      ),
    );

    // NETTOYAGE (étape explicite dans le journal — Blogspot déjà appliqué)
    stages.push(
      stageResult(
        ImportStage.CLEANING,
        true,
        cleaned.removedLinks.length > 0
          ? `${cleaned.removedLinks.length} lien(s) Blogspot retiré(s).`
          : "Aucun lien Blogspot détecté.",
      ),
    );

    // PREVIEW
    const allWarnings = [
      ...extractWarnings,
      ...normalized.warnings,
      ...cleanedAnalysis.warnings,
      ...bible.warnings,
    ];

    const preview = this.structurer.structure({
      analysis: cleanedAnalysis,
      cleanedBody: cleaned.text,
      references: bible.references,
      removedBlogspotLinks: cleaned.removedLinks,
      warnings: allWarnings,
    });

    stages.push(
      stageResult(
        ImportStage.PREVIEW,
        true,
        "Preview prête — validation admin requise avant publication.",
      ),
    );

    return {
      id: jobId,
      status: ImportJobStatus.AWAITING_REVIEW,
      currentStage: ImportStage.PREVIEW,
      file,
      stages,
      rawText,
      cleanedText: cleaned.text,
      preview,
      createdAt: now(),
      updatedAt: now(),
    };
  }
}

function stageResult(
  stage: ImportStage,
  ok: boolean,
  message?: string,
  warnings?: string[],
): ImportStageResult {
  const ts = new Date().toISOString();
  return {
    stage,
    ok,
    startedAt: ts,
    finishedAt: ts,
    message,
    warnings,
  };
}

function createId(): string {
  return `import_${Date.now().toString(36)}_${Math.random().toString(36).slice(2, 8)}`;
}

export function createImportPipeline(): ImportPipeline {
  return new ImportPipeline();
}
