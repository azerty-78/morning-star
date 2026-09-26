import { cn } from "@/lib/utils";
import { Typography } from "@/components/ui";
import type { BibleReference as BibleReferenceType } from "@/domain/meditation";

export interface BibleReferenceProps {
  reference: BibleReferenceType;
  /** Affiche le texte du verset si fourni. */
  verseText?: string;
  className?: string;
}

/**
 * Référence biblique — typographie serif, accent doré discret.
 */
export function BibleReference({
  reference,
  verseText,
  className,
}: BibleReferenceProps) {
  return (
    <figure
      className={cn(
        "border-t border-ms-border pt-4",
        className,
      )}
    >
      <Typography variant="reference" as="cite" className="not-italic">
        {reference.label}
      </Typography>
      {verseText ? (
        <Typography variant="body" className="mt-3 font-serif text-[length:var(--ms-text-base)] leading-[var(--ms-leading-relaxed)] text-ms-gray-700">
          {verseText}
        </Typography>
      ) : null}
    </figure>
  );
}

export interface BibleReferenceListProps {
  references: BibleReferenceType[];
  className?: string;
  compact?: boolean;
}

export function BibleReferenceList({
  references,
  className,
  compact = false,
}: BibleReferenceListProps) {
  if (references.length === 0) return null;

  if (compact) {
    return (
      <ul
        className={cn(
          "flex flex-wrap gap-x-5 gap-y-2",
          className,
        )}
      >
        {references.map((ref) => (
          <li key={ref.label}>
            <Typography variant="reference" as="span">
              {ref.label}
            </Typography>
          </li>
        ))}
      </ul>
    );
  }

  return (
    <ul className={cn("flex flex-col gap-5", className)}>
      {references.map((ref) => (
        <li key={ref.label}>
          <BibleReference reference={ref} />
        </li>
      ))}
    </ul>
  );
}
