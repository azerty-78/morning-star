"use client";

import { useCallback, useState } from "react";
import { Button } from "@/components/ui";
import { API_ROUTES } from "@/constants/routes";
import type { DailyMeditation } from "@/domain/meditation";
import { meditationCanonical } from "@/lib/seo/metadata";

export interface ReaderActionsProps {
  meditation: DailyMeditation;
  authorName: string;
}

export function ReaderActions({
  meditation,
  authorName,
}: ReaderActionsProps) {
  const [shareStatus, setShareStatus] = useState<string | null>(null);
  const shareUrl = meditationCanonical(meditation.slug);

  const handleShare = useCallback(async () => {
    const payload = {
      title: meditation.title,
      text: `${meditation.title} — ${meditation.excerpt}`,
      url: shareUrl,
    };

    try {
      if (navigator.share) {
        await navigator.share(payload);
        setShareStatus("Partage ouvert.");
        return;
      }
      await navigator.clipboard.writeText(shareUrl);
      setShareStatus("Lien copié dans le presse-papiers.");
    } catch {
      setShareStatus("Partage annulé.");
    }
  }, [meditation.excerpt, meditation.title, shareUrl]);

  const handleDownload = useCallback(() => {
    const lines = [
      meditation.title,
      meditation.subtitle ?? "",
      formatLine(meditation.publicationDate),
      `Auteur : ${authorName}`,
      "",
      meditation.highlightQuote
        ? `« ${meditation.highlightQuote} »`
        : "",
      "",
      meditation.body,
      "",
      "Références :",
      ...meditation.bibleReferences.map((r) => `- ${r.label}`),
      "",
      `Source : ${shareUrl}`,
    ].filter((line, i, arr) => !(line === "" && arr[i - 1] === ""));

    const blob = new Blob([lines.join("\n")], {
      type: "text/plain;charset=utf-8",
    });
    const url = URL.createObjectURL(blob);
    const anchor = document.createElement("a");
    anchor.href = url;
    anchor.download = `${meditation.slug}.txt`;
    anchor.click();
    URL.revokeObjectURL(url);
    setShareStatus("Fichier texte téléchargé.");

    void fetch(API_ROUTES.analyticsDownload, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ meditationId: meditation.id }),
      credentials: "same-origin",
      keepalive: true,
    }).catch(() => {
      /* analytics non bloquant */
    });
  }, [authorName, meditation, shareUrl]);

  return (
    <div className="flex flex-col gap-3 sm:flex-row sm:flex-wrap sm:items-center">
      <Button type="button" variant="secondary" onClick={handleShare}>
        Partager
      </Button>
      <Button type="button" variant="ghost" onClick={handleDownload}>
        Télécharger
      </Button>
      <p
        role="status"
        aria-live="polite"
        className="text-[length:var(--ms-text-sm)] text-ms-muted sm:ml-2"
      >
        {shareStatus}
      </p>
    </div>
  );
}

function formatLine(isoDate: string): string {
  return new Intl.DateTimeFormat("fr-FR", {
    weekday: "long",
    day: "numeric",
    month: "long",
    year: "numeric",
  }).format(new Date(`${isoDate}T12:00:00`));
}
