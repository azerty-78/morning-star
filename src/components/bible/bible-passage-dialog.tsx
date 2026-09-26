"use client";

import { useCallback, useEffect, useMemo, useState } from "react";
import type {
  BiblePassage,
  BibleResolveStatus,
  BibleTranslation,
  ResolvedBibleReference,
} from "@/domain/bible";
import { Typography } from "@/components/ui";
import { Button } from "@/components/ui/button";
import { Dialog } from "@/components/ui/dialog";
import { passageLookupKey, referenceKey } from "@/lib/bible";
import { cn } from "@/lib/utils";

export interface BiblePassageDialogProps {
  open: boolean;
  onClose: () => void;
  reference: ResolvedBibleReference | null;
  translations: BibleTranslation[];
  defaultTranslationCode: string;
  /** Clé : `${translationCode}::${referenceKey}` */
  passages: Record<string, BiblePassage>;
  /** Statut de résolution optionnel (API / service). */
  resolveStatus?: BibleResolveStatus;
  resolveMessage?: string;
}

export function BiblePassageDialog({
  open,
  onClose,
  reference,
  translations,
  defaultTranslationCode,
  passages,
  resolveStatus,
  resolveMessage,
}: BiblePassageDialogProps) {
  const usableTranslations = useMemo(
    () => translations.filter((t) => t.licenseVerified),
    [translations],
  );

  const initialCode =
    usableTranslations.find((t) => t.code === defaultTranslationCode)?.code ??
    usableTranslations[0]?.code ??
    defaultTranslationCode;

  const [translationCode, setTranslationCode] = useState(initialCode);

  useEffect(() => {
    if (open) {
      setTranslationCode(initialCode);
    }
  }, [open, reference, initialCode]);

  const handleClose = useCallback(() => {
    onClose();
  }, [onClose]);

  const translation =
    translations.find((t) => t.code === translationCode) ?? null;

  const passage = reference
    ? passages[passageLookupKey(translationCode, referenceKey(reference))]
    : null;

  const title = reference?.label ?? "Passage biblique";

  const verseLabel = reference
    ? reference.verseStart == null
      ? "chapitre entier"
      : reference.verseStart === (reference.verseEnd ?? reference.verseStart)
        ? String(reference.verseStart)
        : `${reference.verseStart}–${reference.verseEnd}`
    : "";

  const emptyReason = describeEmptyState({
    reference,
    translation,
    passage,
    resolveStatus,
    resolveMessage,
  });

  return (
    <Dialog
      open={open}
      title={title}
      onClose={handleClose}
      className="w-[min(100%,32rem)] max-w-[calc(100vw-2rem)]"
    >
      {!reference ? (
        <Typography variant="meta">
          {resolveMessage ??
            "Référence invalide ou non reconnue. Aucune redirection externe."}
        </Typography>
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
                {translation?.name ?? translationCode}
              </dd>
            </div>
          </dl>

          {usableTranslations.length > 0 ? (
            <div>
              <label
                htmlFor="bible-translation"
                className="mb-2 block text-[length:var(--ms-text-2xs)] font-medium uppercase tracking-[var(--ms-tracking-widest)] text-ms-muted"
              >
                Traduction (textes licenciés uniquement)
              </label>
              <select
                id="bible-translation"
                value={translationCode}
                onChange={(e) => setTranslationCode(e.target.value)}
                className="w-full rounded-none border-0 border-b border-ms-border bg-transparent py-2 text-[length:var(--ms-text-base)] text-ms-fg focus-visible:border-ms-black focus-visible:outline-none"
              >
                {usableTranslations.map((t) => (
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
              <div
                role="status"
                className={cn("border border-ms-border px-4 py-5")}
              >
                <Typography variant="label" className="mb-2 text-ms-gold-dark">
                  Passage non disponible
                </Typography>
                <Typography variant="meta">{emptyReason}</Typography>
              </div>
            )}
          </div>

          {translation?.licenseNotice ? (
            <Typography variant="meta" className="text-[length:var(--ms-text-2xs)]">
              {translation.licenseNotice}
            </Typography>
          ) : null}

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

function describeEmptyState(input: {
  reference: ResolvedBibleReference | null;
  translation: BibleTranslation | null;
  passage: BiblePassage | null;
  resolveStatus?: BibleResolveStatus;
  resolveMessage?: string;
}): string {
  if (input.resolveMessage) return input.resolveMessage;
  if (input.resolveStatus === "LICENSE_BLOCKED") {
    return "Licence non vérifiée pour cette traduction. Aucun texte n'est affiché.";
  }
  if (input.resolveStatus === "IMPORT_REQUIRED") {
    return "Traduction déclarée mais non importée. Utilisez l'importeur de traductions autorisées.";
  }
  if (input.translation && !input.translation.licenseVerified) {
    return "Cette traduction est restreinte (licence). Importez uniquement des textes autorisés.";
  }
  if (input.translation?.requiresImport) {
    return `Aucun contenu chargé pour ${input.translation.code}. Import requis.`;
  }
  if (input.reference) {
    return `Le passage ${input.reference.label} n'est pas présent dans la base locale. Aucune redirection vers une Bible externe.`;
  }
  return "Passage introuvable.";
}
