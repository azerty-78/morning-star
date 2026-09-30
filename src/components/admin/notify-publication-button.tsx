"use client";

import { useState, useTransition } from "react";
import { API_ROUTES } from "@/constants/routes";

export function NotifyPublicationButton({
  meditationId,
}: {
  meditationId: string;
}) {
  const [pending, startTransition] = useTransition();
  const [status, setStatus] = useState<string | null>(null);

  function handleClick() {
    setStatus(null);
    startTransition(async () => {
      try {
        const res = await fetch(API_ROUTES.newsletterNotifyPublication, {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ meditationId }),
        });
        const data = (await res.json()) as {
          ok: boolean;
          message?: string;
          sent?: number;
          failed?: number;
        };
        if (!data.ok) {
          setStatus(data.message ?? "Échec de l’envoi.");
          return;
        }
        setStatus(
          `Notification envoyée (mock) — ${data.sent ?? 0} ok` +
            (data.failed ? `, ${data.failed} échec` : "") +
            ".",
        );
      } catch {
        setStatus("Impossible de déclencher la notification.");
      }
    });
  }

  return (
    <div className="flex flex-col gap-3 sm:flex-row sm:items-center">
      <button
        type="button"
        disabled={pending}
        onClick={handleClick}
        className="inline-flex h-10 cursor-pointer items-center rounded-full bg-ms-gold px-4 text-[15px] font-semibold text-ms-black disabled:cursor-not-allowed disabled:opacity-50"
      >
        {pending ? "Envoi…" : "Notifier les abonnés"}
      </button>
      <p role="status" aria-live="polite" className="text-sm text-ms-muted">
        {status}
      </p>
    </div>
  );
}
