"use client";

import { useEffect } from "react";
import { ArchiveError } from "@/components/archive";
import { Container, PageHeader } from "@/components/ui";

export default function ArchiveErrorPage({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  useEffect(() => {
    console.error(error);
  }, [error]);

  return (
    <Container className="pb-[var(--ms-space-10)]">
      <PageHeader eyebrow="Chronologie" title="Archive" />
      <div className="mt-10">
        <ArchiveError message={error.message} />
        <button
          type="button"
          onClick={reset}
          className="mt-6 text-[length:var(--ms-text-xs)] uppercase tracking-[var(--ms-tracking-wider)] underline"
        >
          Réessayer
        </button>
      </div>
    </Container>
  );
}
