/**
 * Domaine Meditation — modèles métier.
 */

export const MeditationStatus = {
  DRAFT: "DRAFT",
  SCHEDULED: "SCHEDULED",
  PUBLISHED: "PUBLISHED",
  ARCHIVED: "ARCHIVED",
} as const;

export type MeditationStatus =
  (typeof MeditationStatus)[keyof typeof MeditationStatus];

export interface BibleReference {
  /** Affichage libre, ex. "Jean 1:1-5" */
  label: string;
  book?: string;
  chapter?: number;
  verseStart?: number;
  verseEnd?: number;
}

export interface DailyMeditation {
  id: string;
  slug: string;
  title: string;
  subtitle?: string;
  /** Date de publication éditoriale (YYYY-MM-DD) */
  publicationDate: string;
  status: MeditationStatus;
  excerpt: string;
  body: string;
  /** Citation mise en avant */
  highlightQuote?: string;
  bibleReferences: BibleReference[];
  /** Thèmes éditoriaux (filtre archives) — prêt pour Prisma String[] */
  themes?: string[];
  authorId: string;
  editionId?: string;
  createdAt: Date;
  updatedAt: Date;
}

export interface MeditationEdition {
  id: string;
  title: string;
  year: number;
  description?: string;
}
