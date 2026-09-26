import { mkdirSync, readFileSync, readdirSync, writeFileSync, existsSync } from "node:fs";
import path from "node:path";
import type { ImportJob } from "@/domain/import";

/**
 * Persistance locale des jobs d'import (remplacée par Prisma plus tard).
 * Évite la perte de jobs entre route handlers et pages RSC en dev.
 */
const DIR = path.join(process.cwd(), ".data", "import-jobs");

function ensureDir(): void {
  if (!existsSync(DIR)) {
    mkdirSync(DIR, { recursive: true });
  }
}

function jobPath(id: string): string {
  const safe = id.replace(/[^a-zA-Z0-9_-]/g, "");
  return path.join(DIR, `${safe}.json`);
}

export const importJobStore = {
  save(job: ImportJob): void {
    ensureDir();
    writeFileSync(jobPath(job.id), JSON.stringify(job, null, 2), "utf8");
  },

  get(id: string): ImportJob | undefined {
    const file = jobPath(id);
    if (!existsSync(file)) return undefined;
    try {
      return JSON.parse(readFileSync(file, "utf8")) as ImportJob;
    } catch {
      return undefined;
    }
  },

  update(id: string, patch: Partial<ImportJob>): ImportJob | undefined {
    const current = this.get(id);
    if (!current) return undefined;
    const next: ImportJob = {
      ...current,
      ...patch,
      updatedAt: new Date().toISOString(),
    };
    this.save(next);
    return next;
  },

  list(): ImportJob[] {
    ensureDir();
    return readdirSync(DIR)
      .filter((f) => f.endsWith(".json"))
      .map((f) => {
        try {
          return JSON.parse(
            readFileSync(path.join(DIR, f), "utf8"),
          ) as ImportJob;
        } catch {
          return null;
        }
      })
      .filter((j): j is ImportJob => Boolean(j))
      .sort((a, b) => b.createdAt.localeCompare(a.createdAt));
  },
};
