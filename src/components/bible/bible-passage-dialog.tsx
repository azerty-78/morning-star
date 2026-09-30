"use client";

import { useCallback, useEffect, useMemo, useState } from "react";
import type {
  BiblePassage,
  BibleResolveStatus,
  BibleTranslation,
  ResolvedBibleReference,
} from "@/domain/bible";
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
    ? (passages[passageLookupKey(translationCode, referenceKey(reference))] ??
      null)
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

  const facts = [
    { label: "Livre", value: reference?.bookName ?? "" },
    { label: "Chapitre", value: reference ? String(reference.chapter) : "" },
    { label: "Versets", value: verseLabel },
  ];

  return (
    <Dialog open={open} title={title} onClose={handleClose}>
      {!reference ? (
        <p className="rounded-2xl bg-white px-4 py-4 text-[15px] leading-snug text-ms-muted">
          {resolveMessage ??
            "Référence invalide ou non reconnue. Aucune redirection externe."}
        </p>
      ) : (
        <div className="flex flex-col gap-3">
          <dl className="overflow-hidden rounded-2xl bg-white">
            {facts.map((fact) => (
              <div
                key={fact.label}
                className="flex items-center justify-between gap-4 border-b border-ms-gold/15 px-4 py-3 last:border-b-0"
              >
                <dt className="text-[15px] text-ms-muted">{fact.label}</dt>
                <dd className="m-0 text-right text-[15px] font-medium text-ms-black">
                  {fact.value}
                </dd>
              </div>
            ))}
          </dl>

          {usableTranslations.length > 0 ? (
            <div>
              <label
                htmlFor="bible-translation"
                className="mb-1.5 block px-1 text-[13px] font-medium text-ms-muted"
              >
                Traduction
              </label>
              <select
                id="bible-translation"
                value={translationCode}
                onChange={(e) => setTranslationCode(e.target.value)}
                className="w-full cursor-pointer appearance-none rounded-2xl border-0 bg-white px-4 py-3 text-[16px] text-ms-black focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-ms-gold"
              >
                {usableTranslations.map((t) => (
                  <option key={t.code} value={t.code}>
                    {t.name} ({t.code})
                  </option>
                ))}
              </select>
            </div>
          ) : null}

          {passage ? (
            <div className="rounded-2xl bg-white px-4 py-4">
              <p className="mb-3 text-[12px] font-semibold tracking-wide text-ms-gold-dark">
                {translation?.name ?? translationCode}
              </p>
              <div className="flex flex-col gap-4">
                {passage.verses.map((v) => (
                  <p
                    key={v.verse}
                    className="font-serif text-[length:var(--ms-text-base)] leading-[var(--ms-leading-relaxed)] text-ms-gray-800"
                  >
                    <sup className="mr-1 font-sans text-[11px] font-semibold text-ms-gold-dark">
                      {v.verse}
                    </sup>
                    {v.text}
                  </p>
                ))}
              </div>
            </div>
          ) : (
            <div role="status" className={cn("rounded-2xl bg-white px-4 py-4")}>
              <p className="text-[15px] font-semibold text-ms-black">
                Passage non disponible
              </p>
              <p className="mt-1 text-[14px] leading-snug text-ms-muted">
                {emptyReason}
              </p>
            </div>
          )}

          {translation?.licenseNotice ? (
            <p className="px-1 text-[12px] leading-snug text-ms-muted">
              {translation.licenseNotice}
            </p>
          ) : null}
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
