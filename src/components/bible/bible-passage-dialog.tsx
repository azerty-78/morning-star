"use client";

import { useCallback, useState } from "react";
import type {
  BiblePassage,
  BibleTranslation,
  ResolvedBibleReference,
} from "@/domain/bible";
import { Typography } from "@/components/ui";
import { Button } from "@/components/ui/button";
import { Dialog } from "@/components/ui/dialog";
import { passageLookupKey, referenceKey } from "@/lib/bible";

export interface BiblePassageDialogProps {
  open: boolean;
  onClose: () => void;
  reference: ResolvedBibleReference | null;
  translations: BibleTranslation[];
  defaultTranslationCode: string;
  /** Clé : `${translationCode}::${referenceKey}` */
  passages: Record<string, BiblePassage>;
}

export function BiblePassageDialog({
  open,
  onClose,
  reference,
  translations,
  defaultTranslationCode,
  passages,
}: BiblePassageDialogProps) {
  const [translationCode, setTranslationCode] = useState(
    defaultTranslationCode,
  );

  const handleClose = useCallback(() => {
    onClose();
    setTranslationCode(defaultTranslationCode);
  }, [onClose, defaultTranslationCode]);

  const title = reference?.label ?? "Passage biblique";
  const passage = reference
    ? (passages[
        passageLookupKey(translationCode, referenceKey(reference))
      ] ??
      passages[
        passageLookupKey(defaultTranslationCode, referenceKey(reference))
      ])
    : null;

  const verseLabel = reference
    ? reference.verseStart === reference.verseEnd
      ? String(reference.verseStart)
      : `${reference.verseStart}–${reference.verseEnd}`
    : "";

  return (
    <Dialog
      open={open}
      title={title}
      onClose={handleClose}
      className="w-[min(100%,32rem)]"
    >
      {!reference ? (
        <Typography variant="meta">Aucune référence sélectionnée.</Typography>
      ) : (
        <div className="flex flex-col gap-5">
          <dl className="grid grid-cols-2 gap-x-4 gap-y-3">
            <div>
              <Typography variant="label" as="dt" className="mb-1">
                Livre
              </Typography>
              <dd className="m-0 text-[length:var(--ms-text-sm)] text-ms-fg">
                {reference.bookName}
              </dd>
            </div>
            <div>
              <Typography variant="label" as="dt" className="mb-1">
                Chapitre
              </Typography>
              <dd className="m-0 text-[length:var(--ms-text-sm)] text-ms-fg">
                {reference.chapter}
              </dd>
            </div>
            <div>
              <Typography variant="label" as="dt" className="mb-1">
                Versets
              </Typography>
              <dd className="m-0 text-[length:var(--ms-text-sm)] text-ms-fg">
                {verseLabel}
              </dd>
            </div>
            <div>
              <Typography variant="label" as="dt" className="mb-1">
                Traduction
              </Typography>
              <dd className="m-0 text-[length:var(--ms-text-sm)] text-ms-fg">
                {passage?.translation.name ?? translationCode}
              </dd>
            </div>
          </dl>

          {translations.length > 1 ? (
            <div>
              <label
                htmlFor="bible-translation"
                className="mb-2 block text-[length:var(--ms-text-2xs)] font-medium uppercase tracking-[var(--ms-tracking-widest)] text-ms-muted"
              >
                Changer de traduction
              </label>
              <select
                id="bible-translation"
                value={translationCode}
                onChange={(e) => setTranslationCode(e.target.value)}
                className="w-full rounded-none border-0 border-b border-ms-border bg-transparent py-2 text-[length:var(--ms-text-base)] text-ms-fg focus-visible:border-ms-black focus-visible:outline-none"
              >
                {translations.map((t) => (
                  <option key={t.code} value={t.code}>
                    {t.name} ({t.code})
                  </option>
                ))}
              </select>
            </div>
          ) : null}

          <div className="border-t border-ms-border pt-5">
            {passage ? (
              <div className="flex flex-col gap-4">
                {passage.verses.map((v) => (
                  <p
                    key={v.verse}
                    className="font-serif text-[length:var(--ms-text-base)] leading-[var(--ms-leading-relaxed)] text-ms-gray-800"
                  >
                    <sup className="mr-1 font-sans text-[length:var(--ms-text-2xs)] text-ms-gold-dark">
                      {v.verse}
                    </sup>
                    {v.text}
                  </p>
                ))}
              </div>
            ) : (
              <Typography variant="meta">
                Passage non disponible dans cette traduction pour le moment.
              </Typography>
            )}
          </div>

          <div className="flex justify-end border-t border-ms-border pt-4">
            <Button
              type="button"
              variant="secondary"
              size="sm"
              onClick={handleClose}
            >
              Fermer
            </Button>
          </div>
        </div>
      )}
    </Dialog>
  );
}
