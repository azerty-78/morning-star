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

function resolveBook(bookRaw: string) {
  const key = normalizeBookKey(bookRaw);
  return BOOKS_BY_ALIAS_LENGTH.find((entry) => entry.alias === key)?.book;
}

function formatLabel(
  bookName: string,
  chapter: number,
  verseStart?: number,
  verseEnd?: number,
): string {
  if (verseStart == null) {
    return `${bookName} ${chapter}`;
  }
  if (verseEnd == null || verseEnd === verseStart) {
    return `${bookName} ${chapter}:${verseStart}`;
  }
  return `${bookName} ${chapter}:${verseStart}-${verseEnd}`;
}

/**
 * Parse une référence isolée.
 * Accepte : "Jean 3:16", "1 Jean 1:7-9", "Matthieu 5:3-12", "Psaume 23".
 */
export function parseBibleReference(
  raw: string,
): ResolvedBibleReference | null {
  const trimmed = raw.trim().replace(/\.$/, "");

  const withVerses = trimmed.match(
    /^(.+?)\s+(\d+)\s*[:\.]\s*(\d+)(?:\s*[-–—]\s*(\d+))?$/u,
  );
  if (withVerses) {
    const bookRaw = withVerses[1];
    const chapter = Number(withVerses[2]);
    const verseStart = Number(withVerses[3]);
    const verseEnd = withVerses[4] ? Number(withVerses[4]) : verseStart;
    if (!bookRaw || !chapter || !verseStart || verseEnd < verseStart) {
      return null;
    }
    const book = resolveBook(bookRaw);
    if (!book) return null;
    return {
      label: formatLabel(book.name, chapter, verseStart, verseEnd),
      bookId: book.id,
      bookName: book.name,
      chapter,
      verseStart,
      verseEnd,
    };
  }

  // Chapitre seul : « Psaume 23 », « Jean 3 »
  const chapterOnly = trimmed.match(/^(.+?)\s+(\d+)$/u);
  if (chapterOnly) {
    const bookRaw = chapterOnly[1];
    const chapter = Number(chapterOnly[2]);
    if (!bookRaw || !chapter) return null;
    const book = resolveBook(bookRaw);
    if (!book) return null;
    return {
      label: formatLabel(book.name, chapter),
      bookId: book.id,
      bookName: book.name,
      chapter,
    };
  }

  return null;
}

/**
 * Détecte les références dans un texte.
 * Ordre : formes avec versets d'abord, puis chapitres seuls (sans chevauchement).
 */
export function detectBibleReferences(text: string): BibleReferenceMatch[] {
  if (!text) return [];

  const matches: BibleReferenceMatch[] = [];

  const versePattern =
    /\b(\d+\s+[A-Za-zÀ-ÿœŒ]+(?:\s+[A-Za-zÀ-ÿœŒ]+)?|[A-Za-zÀ-ÿœŒ]+)\s+(\d+)\s*[:\.]\s*(\d+)(?:\s*[-–—]\s*(\d+))?/gu;

  let match: RegExpExecArray | null;
  while ((match = versePattern.exec(text)) !== null) {
    const parsed = parseBibleReference(match[0]);
    if (!parsed) continue;
    pushIfNoOverlap(matches, {
      reference: parsed,
      start: match.index,
      end: match.index + match[0].length,
    });
  }

  const chapterPattern =
    /\b(\d+\s+[A-Za-zÀ-ÿœŒ]+(?:\s+[A-Za-zÀ-ÿœŒ]+)?|[A-Za-zÀ-ÿœŒ]+)\s+(\d+)\b/gu;

  while ((match = chapterPattern.exec(text)) !== null) {
    const raw = match[0];
    // Ignorer si déjà couvert par une ref avec versets
    const start = match.index;
    const end = start + raw.length;
    if (matches.some((m) => !(end <= m.start || start >= m.end))) continue;

    const parsed = parseBibleReference(raw);
    if (!parsed || parsed.verseStart != null) continue;

    pushIfNoOverlap(matches, { reference: parsed, start, end });
  }

  return matches.sort((a, b) => a.start - b.start);
}

function pushIfNoOverlap(
  matches: BibleReferenceMatch[],
  candidate: BibleReferenceMatch,
): void {
  const overlaps = matches.some(
    (existing) =>
      !(candidate.end <= existing.start || candidate.start >= existing.end),
  );
  if (!overlaps) matches.push(candidate);
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
    map.set(referenceKey(detected.reference), detected.reference);
  }

  for (const label of structuredLabels) {
    const parsed = parseBibleReference(label);
    if (!parsed) continue;
    map.set(referenceKey(parsed), parsed);
  }

  return [...map.values()];
}

export function referenceKey(ref: ResolvedBibleReference): string {
  if (ref.verseStart == null) {
    return `${ref.bookId}:${ref.chapter}:*`;
  }
  const end = ref.verseEnd ?? ref.verseStart;
  return `${ref.bookId}:${ref.chapter}:${ref.verseStart}-${end}`;
}
