import type { ImportJob } from "@/domain/import";

/**
 * Store mémoire pour les jobs d'import (remplacé par Prisma plus tard).
 * Process-local — suffisant pour l'architecture / démo admin.
 */
const jobs = new Map<string, ImportJob>();

export const importJobStore = {
  save(job: ImportJob): void {
    jobs.set(job.id, job);
  },
  get(id: string): ImportJob | undefined {
    return jobs.get(id);
  },
  update(id: string, patch: Partial<ImportJob>): ImportJob | undefined {
    const current = jobs.get(id);
    if (!current) return undefined;
    const next: ImportJob = {
      ...current,
      ...patch,
      updatedAt: new Date().toISOString(),
    };
    jobs.set(id, next);
    return next;
  },
  list(): ImportJob[] {
    return [...jobs.values()].sort((a, b) =>
      b.createdAt.localeCompare(a.createdAt),
    );
  },
};
