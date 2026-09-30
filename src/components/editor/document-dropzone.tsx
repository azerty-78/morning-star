"use client";

import { useCallback, useState } from "react";
import { useRouter } from "next/navigation";
import { ADMIN_ROUTES, API_ROUTES } from "@/constants/routes";
import { cn } from "@/lib/utils";

const ACCEPT = ".pdf,.doc,.docx,application/pdf,application/msword,application/vnd.openxmlformats-officedocument.wordprocessingml.document";

export function DocumentDropzone() {
  const router = useRouter();
  const [dragging, setDragging] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [pending, setPending] = useState(false);

  const upload = useCallback(
    async (file: File) => {
      setError(null);
      setPending(true);
      try {
        const form = new FormData();
        form.append("file", file);
        const response = await fetch(API_ROUTES.import, {
          method: "POST",
          body: form,
        });
        const json = (await response.json()) as {
          data?: { id: string; status: string; error?: string };
          error?: string;
        };

        if (!response.ok && !json.data) {
          throw new Error(json.error ?? "Échec de l'import.");
        }

        const job = json.data;
        if (!job) throw new Error("Réponse invalide.");

        if (job.status === "FAILED") {
          setError(job.error ?? "Import échoué.");
          return;
        }

        router.push(`${ADMIN_ROUTES.import}/${job.id}`);
      } catch (err) {
        setError(err instanceof Error ? err.message : "Erreur inconnue.");
      } finally {
        setPending(false);
      }
    },
    [router],
  );

  const onFiles = useCallback(
    (list: FileList | null) => {
      const file = list?.[0];
      if (file) void upload(file);
    },
    [upload],
  );

  return (
    <div className="flex flex-col gap-4">
      <div
        role="button"
        tabIndex={0}
        aria-label="Zone de dépôt de document PDF, DOC ou DOCX"
        aria-disabled={pending}
        onKeyDown={(e) => {
          if (e.key === "Enter" || e.key === " ") {
            e.preventDefault();
            document.getElementById("import-file-input")?.click();
          }
        }}
        onDragEnter={(e) => {
          e.preventDefault();
          setDragging(true);
        }}
        onDragOver={(e) => {
          e.preventDefault();
          setDragging(true);
        }}
        onDragLeave={(e) => {
          e.preventDefault();
          setDragging(false);
        }}
        onDrop={(e) => {
          e.preventDefault();
          setDragging(false);
          onFiles(e.dataTransfer.files);
        }}
        className={cn(
          "rounded-3xl border border-dashed border-ms-gold/60 bg-white px-6 py-12 text-center shadow-[0_1px_2px_rgba(26,26,26,0.05)]",
          dragging && "border-ms-gold bg-ms-gold/10",
          pending && "opacity-60",
        )}
      >
        <p className="text-[13px] font-semibold text-ms-gold-dark">Import</p>
        <p className="mt-2 text-[22px] font-semibold tracking-tight text-ms-black">
          Déposer un document
        </p>
        <p className="mx-auto mt-2 max-w-md text-[14px] leading-snug text-ms-gray-600">
          PDF, DOC ou DOCX — le fichier sera analysé puis présenté en preview.
          Aucune publication automatique.
        </p>
        <div className="mt-6">
          <label htmlFor="import-file-input">
            <span className="sr-only">Choisir un fichier</span>
            <button
              type="button"
              disabled={pending}
              onClick={() =>
                document.getElementById("import-file-input")?.click()
              }
              className="inline-flex h-11 cursor-pointer items-center rounded-full bg-ms-gold px-5 text-[15px] font-semibold text-ms-black disabled:cursor-not-allowed disabled:opacity-50"
            >
              {pending ? "Analyse…" : "Choisir un fichier"}
            </button>
          </label>
          <input
            id="import-file-input"
            type="file"
            accept={ACCEPT}
            className="sr-only"
            disabled={pending}
            onChange={(e) => onFiles(e.target.files)}
          />
        </div>
      </div>

      {error ? (
        <p className="text-[length:var(--ms-text-sm)] text-ms-gold-dark" role="alert">
          {error}
        </p>
      ) : null}
    </div>
  );
}
