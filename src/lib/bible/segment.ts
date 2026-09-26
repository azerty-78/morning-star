import {
  detectBibleReferences,
  referenceKey,
} from "@/lib/bible";
import type { ResolvedBibleReference } from "@/domain/bible";

export type ReaderContentSegment =
  | { type: "text"; value: string }
  | { type: "ref"; label: string; key: string; reference: ResolvedBibleReference };

/**
 * Découpe un paragraphe en texte + références interactives.
 */
export function segmentParagraph(paragraph: string): ReaderContentSegment[] {
  const matches = detectBibleReferences(paragraph);
  if (matches.length === 0) {
    return [{ type: "text", value: paragraph }];
  }

  const segments: ReaderContentSegment[] = [];
  let cursor = 0;

  for (const match of matches) {
    if (match.start > cursor) {
      segments.push({
        type: "text",
        value: paragraph.slice(cursor, match.start),
      });
    }
    segments.push({
      type: "ref",
      label: paragraph.slice(match.start, match.end),
      key: referenceKey(match.reference),
      reference: match.reference,
    });
    cursor = match.end;
  }

  if (cursor < paragraph.length) {
    segments.push({ type: "text", value: paragraph.slice(cursor) });
  }

  return segments;
}

export function splitBodyParagraphs(body: string): string[] {
  return body
    .split(/\n\n+/)
    .map((p) => p.trim())
    .filter(Boolean);
}

export function passageLookupKey(
  translationCode: string,
  refKey: string,
): string {
  return `${translationCode}::${refKey}`;
}
