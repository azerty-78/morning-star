"use client";

import { useCallback, useState } from "react";
import { PullQuote } from "@/components/editorial";
import { BiblePassageDialog } from "@/components/bible/bible-passage-dialog";
import { Typography } from "@/components/ui";
import type {
  BiblePassage,
  BibleTranslation,
  ResolvedBibleReference,
} from "@/domain/bible";
import type { DailyMeditation } from "@/domain/meditation";
import { parseBibleReference } from "@/lib/bible";
import { cn } from "@/lib/utils";
import { ReaderActions } from "./reader-actions";
import { ReaderBody } from "./reader-body";

export interface MeditationReaderInteractiveProps {
  meditation: DailyMeditation;
  authorName: string;
  passages: Record<string, BiblePassage>;
  translations: BibleTranslation[];
  defaultTranslationCode: string;
}

/**
 * Îlot client — références bibliques, partage, dialog.
 * L’en-tête et la nav restent en Server Components (LCP / SEO).
 */
export function MeditationReaderInteractive({
  meditation,
  authorName,
  passages,
  translations,
  defaultTranslationCode,
}: MeditationReaderInteractiveProps) {
  const primaryCite = meditation.bibleReferences[0]?.label;
  const [activeRef, setActiveRef] = useState<ResolvedBibleReference | null>(
    null,
  );
  const [open, setOpen] = useState(false);

  const openReference = useCallback((reference: ResolvedBibleReference) => {
    setActiveRef(reference);
    setOpen(true);
  }, []);

  const close = useCallback(() => setOpen(false), []);

  const openFromLabel = useCallback(
    (label: string) => {
      const parsed = parseBibleReference(label);
      if (parsed) openReference(parsed);
    },
    [openReference],
  );

  return (
    <>
      {meditation.highlightQuote ? (
        <PullQuote cite={primaryCite} className="mt-10 md:mt-12">
          {meditation.highlightQuote}
        </PullQuote>
      ) : null}

      <div className="mt-10 md:mt-12 md:grid md:grid-cols-12 md:gap-6">
        <div className="md:col-span-8 md:col-start-5">
          <ReaderBody body={meditation.body} onOpenReference={openReference} />

          {meditation.bibleReferences.length > 0 ? (
            <aside
              className="mt-12 border-t border-ms-border pt-8"
              aria-label="Références bibliques"
            >
              <Typography variant="label" className="mb-4 text-ms-muted">
                Références
              </Typography>
              <ul className="flex flex-wrap gap-x-5 gap-y-2">
                {meditation.bibleReferences.map((ref) => (
                  <li key={ref.label}>
                    <button
                      type="button"
                      onClick={() => openFromLabel(ref.label)}
                      className={cn(
                        "border-0 border-b border-ms-gold bg-transparent p-0",
                        "font-serif text-[length:var(--ms-text-sm)] text-ms-gold-dark",
                        "hover:border-ms-black hover:text-ms-fg",
                        "focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-ms-gold",
                      )}
                      aria-haspopup="dialog"
                      aria-label={`Lire le passage ${ref.label}`}
                    >
                      {ref.label}
                    </button>
                  </li>
                ))}
              </ul>
            </aside>
          ) : null}

          <div className="mt-10">
            <ReaderActions meditation={meditation} authorName={authorName} />
          </div>
        </div>
      </div>

      <BiblePassageDialog
        open={open}
        onClose={close}
        reference={activeRef}
        translations={translations}
        defaultTranslationCode={defaultTranslationCode}
        passages={passages}
      />
    </>
  );
}
