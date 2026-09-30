"use client";

import { useMemo } from "react";
import type { ResolvedBibleReference } from "@/domain/bible";
import { Typography } from "@/components/ui";
import { segmentParagraph, splitBodyParagraphs } from "@/lib/bible";
import { cn } from "@/lib/utils";

export interface ReaderBodyProps {
  body: string;
  onOpenReference: (reference: ResolvedBibleReference) => void;
  className?: string;
}

export function ReaderBody({
  body,
  onOpenReference,
  className,
}: ReaderBodyProps) {
  const paragraphs = useMemo(() => splitBodyParagraphs(body), [body]);

  return (
    <div className={cn("ms-prose", className)}>
      {paragraphs.map((paragraph) => {
        const segments = segmentParagraph(paragraph);
        return (
          <Typography
            key={paragraph.slice(0, 48)}
            variant="body"
            className="text-[length:var(--ms-text-lg)] leading-[var(--ms-leading-relaxed)]"
          >
            {segments.map((segment, index) => {
              if (segment.type === "text") {
                return (
                  <span key={`t-${index}-${segment.value.slice(0, 12)}`}>
                    {segment.value}
                  </span>
                );
              }

              return (
                <button
                  key={`r-${segment.key}-${index}`}
                  type="button"
                  onClick={() => onOpenReference(segment.reference)}
                  className={cn(
                    "inline border-0 border-b border-ms-gold bg-transparent p-0",
                    "font-serif text-[length:var(--ms-text-lg)] text-ms-gold-dark",
                    "cursor-pointer",
                    "hover:text-ms-black",
                    "focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-ms-gold",
                  )}
                  aria-haspopup="dialog"
                  aria-label={`Lire le passage ${segment.reference.label}`}
                >
                  {segment.label}
                </button>
              );
            })}
          </Typography>
        );
      })}
    </div>
  );
}
