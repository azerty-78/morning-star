"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import type { ImportJob } from "@/domain/import";
import { ImportStage } from "@/domain/import";
import {
  Badge,
  Button,
  Separator,
  Typography,
} from "@/components/ui";
import { ADMIN_ROUTES, API_ROUTES } from "@/constants/routes";

const STAGE_ORDER: ImportStage[] = [
  ImportStage.UPLOAD,
  ImportStage.VALIDATION,
  ImportStage.EXTRACTION,
  ImportStage.NORMALISATION,
  ImportStage.ANALYSE,
  ImportStage.STRUCTURATION,
  ImportStage.BIBLE_DETECTION,
  ImportStage.CLEANING,
  ImportStage.PREVIEW,
];

export function ImportPipelineStatus({ job }: { job: ImportJob }) {
  return (
    <ol className="grid gap-2 border border-ms-border p-4 md:grid-cols-3">
      {STAGE_ORDER.map((stage) => {
        const result = job.stages.find((s) => s.stage === stage);
        const done = Boolean(result?.ok);
        return (
          <li
            key={stage}
            className="flex items-baseline justify-between gap-2 border-b border-ms-border py-2 last:border-b-0 md:border-b-0"
          >
            <Typography variant="label" as="span" className="text-ms-muted">
              {stage.replaceAll("_", " ")}
            </Typography>
            <Badge tone={done ? "accent" : "neutral"}>
              {done ? "OK" : "—"}
            </Badge>
          </li>
        );
      })}
    </ol>
  );
}

export function ImportPreviewPanel({ job }: { job: ImportJob }) {
  const router = useRouter();
  const [message, setMessage] = useState<string | null>(null);
  const [pending, setPending] = useState(false);
  const preview = job.preview;

  async function postAction(action: string, extra?: Record<string, string>) {
    setPending(true);
    setMessage(null);
    try {
      const response = await fetch(`${API_ROUTES.import}/${job.id}`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ action, ...extra }),
      });
      const json = (await response.json()) as {
        data?: ImportJob;
        error?: string;
      };
      if (!response.ok) {
        throw new Error(json.error ?? "Action refusée.");
      }
      setMessage(
        action === "approve"
          ? "Preview approuvée. Vous pouvez publier ou programmer."
          : action === "publish"
            ? "Publication enregistrée (stub — Prisma à brancher)."
            : action === "reject"
              ? "Import rejeté."
              : "Action effectuée.",
      );
      router.refresh();
    } catch (err) {
      setMessage(err instanceof Error ? err.message : "Erreur.");
    } finally {
      setPending(false);
    }
  }

  if (!preview) {
    return (
      <Typography variant="meta">
        Aucune preview disponible{job.error ? ` — ${job.error}` : "."}
      </Typography>
    );
  }

  return (
    <div className="flex flex-col gap-10">
      <ImportPipelineStatus job={job} />

      <section aria-labelledby="preview-heading">
        <Typography id="preview-heading" variant="label" className="mb-4 text-ms-gold-dark">
          Preview éditoriale
        </Typography>
        <Typography variant="display" className="max-w-[16ch] text-[length:var(--ms-text-3xl)] md:text-[length:var(--ms-text-display)]">
          {preview.title}
        </Typography>
        {preview.subtitle ? (
          <Typography variant="subtitle" className="mt-4">
            {preview.subtitle}
          </Typography>
        ) : null}
        <Typography variant="lede" className="mt-6 max-w-[var(--ms-measure)]">
          {preview.excerpt}
        </Typography>
        {preview.highlightQuote ? (
          <Typography
            variant="quote"
            className="mt-8 max-w-[var(--ms-measure-wide)] border-l-[3px] border-ms-gold pl-6"
          >
            {preview.highlightQuote}
          </Typography>
        ) : null}

        <div className="ms-prose mt-10">
          {preview.body.split(/\n\n+/).map((p) => (
            <Typography key={p.slice(0, 40)} variant="body">
              {p}
            </Typography>
          ))}
        </div>
      </section>

      <section>
        <Typography variant="label" className="mb-3 text-ms-muted">
          Références détectées
        </Typography>
        {preview.bibleReferences.length === 0 ? (
          <Typography variant="meta">Aucune.</Typography>
        ) : (
          <ul className="flex flex-wrap gap-x-4 gap-y-2">
            {preview.bibleReferences.map((r) => (
              <li key={r.label}>
                <Typography variant="reference" as="span">
                  {r.label}
                </Typography>
              </li>
            ))}
          </ul>
        )}
      </section>

      {preview.removedBlogspotLinks.length > 0 ? (
        <section>
          <Typography variant="label" className="mb-3 text-ms-muted">
            Liens Blogspot retirés
          </Typography>
          <ul className="flex flex-col gap-1">
            {preview.removedBlogspotLinks.map((url) => (
              <li key={url}>
                <Typography variant="meta" className="break-all line-through">
                  {url}
                </Typography>
              </li>
            ))}
          </ul>
        </section>
      ) : null}

      {preview.warnings.length > 0 ? (
        <section>
          <Typography variant="label" className="mb-3 text-ms-muted">
            Avertissements
          </Typography>
          <ul className="list-disc space-y-1 pl-5">
            {preview.warnings.map((w) => (
              <li key={w}>
                <Typography variant="meta">{w}</Typography>
              </li>
            ))}
          </ul>
        </section>
      ) : null}

      <Separator tone="strong" />

      <section aria-labelledby="validation-heading">
        <Typography id="validation-heading" variant="label" className="mb-4 text-ms-gold-dark">
          Validation administrateur
        </Typography>
        <Typography variant="meta" className="mb-6 max-w-[var(--ms-measure)]">
          Aucune publication automatique. Approuvez la preview, puis publiez
          ou programmez explicitement.
        </Typography>
        <div className="flex flex-col gap-3 sm:flex-row sm:flex-wrap">
          <Button
            type="button"
            variant="primary"
            disabled={pending || job.status === "APPROVED" || job.status === "PUBLISHED"}
            onClick={() => void postAction("approve")}
          >
            Approuver
          </Button>
          <Button
            type="button"
            variant="secondary"
            disabled={pending || job.status !== "APPROVED"}
            onClick={() => void postAction("publish")}
          >
            Publier
          </Button>
          <Button
            type="button"
            variant="ghost"
            disabled={pending}
            onClick={() => void postAction("reject", { reason: "Rejeté depuis la preview." })}
          >
            Rejeter
          </Button>
          <Button
            type="button"
            variant="link"
            onClick={() => router.push(ADMIN_ROUTES.import)}
          >
            Nouvel import
          </Button>
        </div>
        {message ? (
          <p className="mt-4 text-[length:var(--ms-text-sm)] text-ms-muted" role="status">
            {message}
          </p>
        ) : null}
        <Typography variant="meta" className="mt-4">
          Statut job : {job.status} · étape : {job.currentStage}
        </Typography>
      </section>
    </div>
  );
}
