"use client";

import { useEffect, useRef } from "react";
import { API_ROUTES } from "@/constants/routes";

/**
 * Enregistre une page view une fois au montage.
 * Le serveur déduplique les refreshs (debounce session + article).
 */
export function MeditationViewTracker({
  meditationId,
}: {
  meditationId: string;
}) {
  const sent = useRef(false);

  useEffect(() => {
    if (sent.current || !meditationId) return;
    sent.current = true;

    const controller = new AbortController();
    void fetch(API_ROUTES.analyticsView, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ meditationId }),
      credentials: "same-origin",
      signal: controller.signal,
      keepalive: true,
    }).catch(() => {
      /* analytics non bloquant */
    });

    return () => controller.abort();
  }, [meditationId]);

  return null;
}
