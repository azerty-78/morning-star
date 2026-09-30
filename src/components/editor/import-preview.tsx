"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import type { ImportJob } from "@/domain/import";
import { ImportStage } from "@/domain/import";
import { Typography } from "@/components/ui";
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
    <ol className="overflow-hidden rounded-3xl bg-white shadow-[0_1px_2px_rgba(26,26,26,0.05)]">
      {STAGE_ORDER.map((stage) => {
        const result = job.stages.find((s) => s.stage === stage);
        const done = Boolean(result?.ok);
        return (
          <li
            key={stage}
            className="flex items-center justify-between gap-3 border-b border-black/5 px-4 py-3 last:border-b-0"
          >
            <span className="text-[15px] text-ms-black">
              {stage.replaceAll("_", " ")}
            </span>
            <span
              className={
                done
                  ? "rounded-full bg-ms-gold px-2.5 py-1 text-[11px] font-semibold text-ms-black"
                  : "rounded-full bg-ms-cream-deep px-2.5 py-1 text-[11px] font-semibold text-ms-gray-600"
              }
            >
              {done ? "OK" : "—"}
            </span>
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

      <section
        aria-labelledby="validation-heading"
        className="rounded-3xl bg-white p-4 shadow-[0_1px_2px_rgba(26,26,26,0.05)]"
      >
        <h2 id="validation-heading" className="text-[15px] font-semibold text-ms-black">
          Validation
        </h2>
        <p className="mt-1 text-[14px] text-ms-gray-600">
          Approuvez la preview, puis publiez ou programmez explicitement.
        </p>
        <div className="mt-4 flex flex-col gap-2 sm:flex-row sm:flex-wrap">
          <button
            type="button"
            disabled={pending || job.status === "APPROVED" || job.status === "PUBLISHED"}
            onClick={() => void postAction("approve")}
            className="h-11 cursor-pointer rounded-full bg-ms-gold px-5 text-[15px] font-semibold text-ms-black disabled:cursor-not-allowed disabled:opacity-40"
          >
            Approuver
          </button>
          <button
            type="button"
            disabled={pending || job.status !== "APPROVED"}
            onClick={() => void postAction("publish")}
            className="h-11 cursor-pointer rounded-full bg-ms-black px-5 text-[15px] font-semibold text-white disabled:cursor-not-allowed disabled:opacity-40"
          >
            Publier
          </button>
          <button
            type="button"
            disabled={pending}
            onClick={() => void postAction("reject", { reason: "Rejeté depuis la preview." })}
            className="h-11 cursor-pointer rounded-full bg-ms-cream-deep px-5 text-[15px] font-semibold text-ms-black disabled:cursor-not-allowed disabled:opacity-40"
          >
            Rejeter
          </button>
          <button
            type="button"
            onClick={() => router.push(ADMIN_ROUTES.import)}
            className="h-11 cursor-pointer rounded-full px-5 text-[15px] font-semibold text-ms-gold-dark"
          >
            Nouvel import
          </button>
        </div>
        {message ? (
          <p className="mt-3 text-[14px] text-ms-gray-600" role="status">
            {message}
          </p>
        ) : null}
        <p className="mt-3 text-[13px] text-ms-gray-600">
          Statut : {job.status} · étape : {job.currentStage}
        </p>
      </section>
    </div>
  );
}
