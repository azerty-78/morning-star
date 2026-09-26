import {
  ImportJobStatus,
  ImportStage,
  type ImportJob,
  type ImportPreviewContent,
} from "@/domain/import";
import {
  createImportPipeline,
  importJobStore,
} from "@/lib/import";

/**
 * Service d'import — orchestration métier.
 * Publication / programmation uniquement après validation admin explicite.
 */
export class ImportService {
  constructor(private readonly pipeline = createImportPipeline()) {}

  async ingestFile(input: {
    filename: string;
    mimeType: string;
    sizeBytes: number;
    bytes: Uint8Array;
  }): Promise<ImportJob> {
    const job = await this.pipeline.run(input);
    importJobStore.save(job);
    return job;
  }

  getJob(id: string): ImportJob | null {
    return importJobStore.get(id) ?? null;
  }

  listJobs(): ImportJob[] {
    return importJobStore.list();
  }

  /**
   * Met à jour la preview après édition manuelle admin (titre, corps…).
   * Reste en AWAITING_REVIEW.
   */
  updatePreview(
    jobId: string,
    preview: ImportPreviewContent,
  ): ImportJob | null {
    const job = importJobStore.get(jobId);
    if (!job || job.status !== ImportJobStatus.AWAITING_REVIEW) {
      return null;
    }
    return (
      importJobStore.update(jobId, {
        preview,
        currentStage: ImportStage.VALIDATION_ADMIN,
      }) ?? null
    );
  }

  /**
   * Validation admin — marque APPROVED, ne publie pas encore.
   */
  approve(jobId: string): ImportJob | null {
    const job = importJobStore.get(jobId);
    if (!job?.preview || job.status !== ImportJobStatus.AWAITING_REVIEW) {
      return null;
    }
    return (
      importJobStore.update(jobId, {
        status: ImportJobStatus.APPROVED,
        currentStage: ImportStage.VALIDATION_ADMIN,
      }) ?? null
    );
  }

  reject(jobId: string, reason?: string): ImportJob | null {
    const job = importJobStore.get(jobId);
    if (!job) return null;
    return (
      importJobStore.update(jobId, {
        status: ImportJobStatus.REJECTED,
        error: reason ?? "Rejeté par l'administrateur.",
      }) ?? null
    );
  }

  /**
   * Publication — stub architecture.
   * Branchement Prisma Article à venir ; jamais appelé automatiquement.
   */
  publish(jobId: string): ImportJob | null {
    const job = importJobStore.get(jobId);
    if (!job?.preview) return null;
    if (
      job.status !== ImportJobStatus.APPROVED &&
      job.status !== ImportJobStatus.AWAITING_REVIEW
    ) {
      return null;
    }
    // Exiger approve explicite
    if (job.status !== ImportJobStatus.APPROVED) {
      return null;
    }
    return (
      importJobStore.update(jobId, {
        status: ImportJobStatus.PUBLISHED,
        currentStage: ImportStage.PUBLICATION,
        publishedArticleId: `article_pending_${jobId}`,
      }) ?? null
    );
  }

  /**
   * Programmation — stub architecture.
   */
  schedule(jobId: string, scheduledAt: string): ImportJob | null {
    const job = importJobStore.get(jobId);
    if (!job?.preview || job.status !== ImportJobStatus.APPROVED) {
      return null;
    }
    return (
      importJobStore.update(jobId, {
        status: ImportJobStatus.SCHEDULED,
        currentStage: ImportStage.SCHEDULE,
        scheduledAt,
      }) ?? null
    );
  }
}

export function createImportService(): ImportService {
  return new ImportService();
}
