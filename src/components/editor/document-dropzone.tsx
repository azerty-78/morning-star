"use client";

import { useCallback, useState } from "react";
import { useRouter } from "next/navigation";
import { Button, Typography } from "@/components/ui";
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
          "border border-dashed border-ms-black bg-ms-off-white px-6 py-14 text-center",
          dragging && "bg-ms-gray-100",
          pending && "opacity-60",
        )}
      >
        <Typography variant="label" className="text-ms-gold-dark">
          Import
        </Typography>
        <Typography variant="title" as="p" className="mt-3 text-[length:var(--ms-text-2xl)]">
          Déposer un document
        </Typography>
        <Typography variant="meta" className="mx-auto mt-3 max-w-md">
          PDF, DOC ou DOCX — le fichier sera analysé puis présenté en preview.
          Aucune publication automatique.
        </Typography>
        <div className="mt-8">
          <label htmlFor="import-file-input">
            <span className="sr-only">Choisir un fichier</span>
            <Button
              type="button"
              variant="primary"
              disabled={pending}
              onClick={() =>
                document.getElementById("import-file-input")?.click()
              }
            >
              {pending ? "Analyse…" : "Choisir un fichier"}
            </Button>
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
