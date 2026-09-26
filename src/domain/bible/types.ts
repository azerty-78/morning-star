export interface BibleTranslation {
  id: string;
  code: string;
  name: string;
}

export interface BibleBook {
  id: string;
  translationId: string;
  name: string;
  abbreviation: string;
  order: number;
}

export interface BibleVerse {
  id: string;
  bookId: string;
  chapter: number;
  verse: number;
  text: string;
}
