import { BIBLE_BOOKS } from "@/domain/bible/books";
import type {
  BibleReferenceMatch,
  ResolvedBibleReference,
} from "@/domain/bible/passage";

/** Normalise accents / casse pour comparaison. */
export function normalizeBookKey(value: string): string {
  return value
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .toLowerCase()
    .replace(/\s+/g, " ")
    .trim();
}

const BOOKS_BY_ALIAS_LENGTH = [...BIBLE_BOOKS]
  .flatMap((book) =>
    [book.name, ...book.aliases].map((alias) => ({
      book,
      alias: normalizeBookKey(alias),
    })),
  )
  .sort((a, b) => b.alias.length - a.alias.length);

/**
 * Parse une référence isolée : "Jean 3:16", "1 Jean 1:7-9", "Psaume 46:10".
 */
export function parseBibleReference(
  raw: string,
): ResolvedBibleReference | null {
  const trimmed = raw.trim();
  const match = trimmed.match(
    /^(.+?)\s+(\d+)\s*:\s*(\d+)(?:\s*[-–—]\s*(\d+))?$/u,
  );
  if (!match) return null;

  const bookRaw = match[1];
  const chapter = Number(match[2]);
  const verseStart = Number(match[3]);
  const verseEnd = match[4] ? Number(match[4]) : verseStart;

  if (!bookRaw || !chapter || !verseStart || verseEnd < verseStart) {
    return null;
  }

  const key = normalizeBookKey(bookRaw);
  const found = BOOKS_BY_ALIAS_LENGTH.find((entry) => entry.alias === key);
  if (!found) return null;

  const label =
    verseEnd === verseStart
      ? `${found.book.name} ${chapter}:${verseStart}`
      : `${found.book.name} ${chapter}:${verseStart}-${verseEnd}`;

  return {
    label,
    bookId: found.book.id,
    bookName: found.book.name,
    chapter,
    verseStart,
    verseEnd,
  };
}

/**
 * Détecte toutes les références bibliques dans un texte structuré.
 * Les chevauchements sont évités (premier match gagnant, livres longs d'abord).
 */
export function detectBibleReferences(text: string): BibleReferenceMatch[] {
  if (!text) return [];

  const pattern =
    /\b(\d+\s+[A-Za-zÀ-ÿœŒ]+(?:\s+[A-Za-zÀ-ÿœŒ]+)?|[A-Za-zÀ-ÿœŒ]+\.?)\s+(\d+)\s*:\s*(\d+)(?:\s*[-–—]\s*(\d+))?/gu;

  const matches: BibleReferenceMatch[] = [];
  let match: RegExpExecArray | null;

  while ((match = pattern.exec(text)) !== null) {
    const raw = match[0];
    const parsed = parseBibleReference(raw);
    if (!parsed) continue;

    const start = match.index;
    const end = start + raw.length;

    const overlaps = matches.some(
      (existing) => !(end <= existing.start || start >= existing.end),
    );
    if (overlaps) continue;

    matches.push({ reference: parsed, start, end });
  }

  return matches.sort((a, b) => a.start - b.start);
}

/**
 * Fusionne références détectées dans le corps et références structurées.
 */
export function collectUniqueReferences(
  body: string,
  structuredLabels: string[] = [],
): ResolvedBibleReference[] {
  const map = new Map<string, ResolvedBibleReference>();

  for (const detected of detectBibleReferences(body)) {
    const key = referenceKey(detected.reference);
    map.set(key, detected.reference);
  }

  for (const label of structuredLabels) {
    const parsed = parseBibleReference(label);
    if (!parsed) continue;
    map.set(referenceKey(parsed), parsed);
  }

  return [...map.values()];
}

export function referenceKey(ref: ResolvedBibleReference): string {
  return `${ref.bookId}:${ref.chapter}:${ref.verseStart}-${ref.verseEnd}`;
}
