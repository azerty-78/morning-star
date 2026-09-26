"use client";

import { useCallback, useState } from "react";
import type {
  BiblePassage,
  BibleTranslation,
  ResolvedBibleReference,
} from "@/domain/bible";
import { Typography } from "@/components/ui";
import { BiblePassageDialog } from "./bible-passage-dialog";
import { cn } from "@/lib/utils";
import { parseBibleReference } from "@/lib/bible";

export interface BibleReferenceProps {
  /** Libellé brut ou déjà résolu. */
  label?: string;
  reference?: ResolvedBibleReference;
  /** Affiche le texte inline si fourni. */
  verseText?: string;
  className?: string;
  /** Mode interactif (ouvre le Dialog). */
  interactive?: boolean;
  translations?: BibleTranslation[];
  defaultTranslationCode?: string;
  passages?: Record<string, BiblePassage>;
}

/**
 * Référence biblique — typographie éditoriale.
 * En mode interactif : ouvre BiblePassageDialog (contenu interne uniquement).
 */
export function BibleReference({
  label,
  reference: referenceProp,
  verseText,
  className,
  interactive = false,
  translations = [],
  defaultTranslationCode = "LSG1910",
  passages = {},
}: BibleReferenceProps) {
  const reference =
    referenceProp ?? (label ? parseBibleReference(label) : null);
  const display = reference?.label ?? label ?? "—";

  const [open, setOpen] = useState(false);
  const onClose = useCallback(() => setOpen(false), []);

  if (!interactive) {
    return (
      <figure className={cn("border-t border-ms-border pt-4", className)}>
        <Typography variant="reference" as="cite" className="not-italic">
          {display}
        </Typography>
        {verseText ? (
          <Typography
            variant="body"
            className="mt-3 font-serif text-[length:var(--ms-text-base)] leading-[var(--ms-leading-relaxed)] text-ms-gray-700"
          >
            {verseText}
          </Typography>
        ) : null}
      </figure>
    );
  }

  return (
    <>
      <button
        type="button"
        onClick={() => setOpen(true)}
        className={cn(
          "border-0 border-b border-ms-gold bg-transparent p-0 text-left",
          "font-serif text-[length:var(--ms-text-sm)] text-ms-gold-dark",
          "hover:border-ms-black hover:text-ms-fg",
          "focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-ms-gold",
          className,
        )}
        aria-haspopup="dialog"
        aria-label={`Lire le passage ${display}`}
      >
        {display}
      </button>
      <BiblePassageDialog
        open={open}
        onClose={onClose}
        reference={reference}
        translations={translations}
        defaultTranslationCode={defaultTranslationCode}
        passages={passages}
        resolveMessage={
          reference
            ? undefined
            : "Référence non reconnue. Vérifiez l'orthographe du livre."
        }
      />
    </>
  );
}

export interface BibleReferenceListProps {
  references: Array<{ label: string } | ResolvedBibleReference>;
  className?: string;
  compact?: boolean;
  interactive?: boolean;
  translations?: BibleTranslation[];
  defaultTranslationCode?: string;
  passages?: Record<string, BiblePassage>;
}

export function BibleReferenceList({
  references,
  className,
  compact = false,
  interactive = false,
  translations,
  defaultTranslationCode,
  passages,
}: BibleReferenceListProps) {
  if (references.length === 0) return null;

  if (compact) {
    return (
      <ul className={cn("flex flex-wrap gap-x-5 gap-y-2", className)}>
        {references.map((ref) => {
          const label = "label" in ref ? ref.label : String(ref);
          return (
            <li key={label}>
              {interactive ? (
                <BibleReference
                  label={label}
                  interactive
                  translations={translations}
                  defaultTranslationCode={defaultTranslationCode}
                  passages={passages}
                />
              ) : (
                <Typography variant="reference" as="span">
                  {label}
                </Typography>
              )}
            </li>
          );
        })}
      </ul>
    );
  }

  return (
    <ul className={cn("flex flex-col gap-5", className)}>
      {references.map((ref) => {
        const label = "label" in ref ? ref.label : String(ref);
        return (
          <li key={label}>
            <BibleReference
              label={label}
              interactive={interactive}
              translations={translations}
              defaultTranslationCode={defaultTranslationCode}
              passages={passages}
            />
          </li>
        );
      })}
    </ul>
  );
}
