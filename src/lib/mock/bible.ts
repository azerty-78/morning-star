/**
 * MOCK DATA Bible — clairement identifié.
 * Architecture multi-traductions prête ; contenu minimal pour la démo.
 */

import type {
  BiblePassage,
  BibleTranslation,
  BibleVerseUnit,
  ResolvedBibleReference,
} from "@/domain/bible";
import { referenceKey } from "@/lib/bible";

export const MOCK_DEFAULT_TRANSLATION_CODE = "LSG" as const;

export const mockBibleTranslations: BibleTranslation[] = [
  {
    id: "tr_mock_lsg",
    code: "LSG",
    name: "Louis Segond 1910",
  },
  {
    id: "tr_mock_s21",
    code: "S21",
    name: "Segond 21",
  },
];

type VerseStore = Record<string, BibleVerseUnit[]>;

/**
 * Clé : `${translationCode}|${bookId}|${chapter}|${verse}`
 */
const mockVerseStore: VerseStore = {
  "LSG|rev|22|16": [
    {
      verse: 16,
      text: "Moi, Jésus, j'ai envoyé mon ange pour vous attester ces choses dans les Églises. Je suis la racine et la postérité de David, l'étoile brillante du matin.",
    },
  ],
  "LSG|2pe|1|19": [
    {
      verse: 19,
      text: "Et nous tenons pour d'autant plus certaine la parole prophétique, à laquelle vous faites bien de prêter attention, comme à une lampe qui brille dans un lieu obscur, jusqu'à ce que le jour vienne à paraître et que l'étoile du matin se lève dans vos cœurs.",
    },
  ],
  "LSG|psa|46|10": [
    {
      verse: 10,
      text: "Arrêtez, et sachez que je suis Dieu : Je domine sur les nations, je domine sur la terre.",
    },
  ],
  "LSG|1jn|1|7": [
    {
      verse: 7,
      text: "Mais si nous marchons dans la lumière, comme il est lui-même dans la lumière, nous sommes en communion les uns avec les autres, et le sang de Jésus son Fils nous purifie de tout péché.",
    },
  ],
  "LSG|jhn|3|16": [
    {
      verse: 16,
      text: "Car Dieu a tant aimé le monde qu'il a donné son Fils unique, afin que quiconque croit en lui ne périsse point, mais qu'il ait la vie éternelle.",
    },
  ],
  "LSG|jhn|3|16-17": [
    {
      verse: 16,
      text: "Car Dieu a tant aimé le monde qu'il a donné son Fils unique, afin que quiconque croit en lui ne périsse point, mais qu'il ait la vie éternelle.",
    },
    {
      verse: 17,
      text: "Dieu, en effet, n'a pas envoyé son Fils dans le monde pour qu'il juge le monde, mais pour que le monde soit sauvé par lui.",
    },
  ],
  // Variante S21 (même sens, formulation distincte pour démontrer multi-traduction)
  "S21|jhn|3|16": [
    {
      verse: 16,
      text: "Oui, Dieu a tant aimé le monde qu'il a donné son Fils unique afin que quiconque croit en lui ne périsse pas mais ait la vie éternelle.",
    },
  ],
  "S21|rev|22|16": [
    {
      verse: 16,
      text: "Moi, Jésus, j'ai envoyé mon ange pour vous apporter ce témoignage au sujet des Églises. Je suis le rejeton de la racine de David, l'étoile brillante du matin.",
    },
  ],
};

function verseRangeKey(
  translationCode: string,
  bookId: string,
  chapter: number,
  verseStart: number,
  verseEnd: number,
): string {
  if (verseStart === verseEnd) {
    return `${translationCode}|${bookId}|${chapter}|${verseStart}`;
  }
  return `${translationCode}|${bookId}|${chapter}|${verseStart}-${verseEnd}`;
}

export function getMockTranslation(
  code: string = MOCK_DEFAULT_TRANSLATION_CODE,
): BibleTranslation {
  return (
    mockBibleTranslations.find((t) => t.code === code) ??
    mockBibleTranslations[0]!
  );
}

export function buildMockPassage(
  reference: ResolvedBibleReference,
  translationCode: string = MOCK_DEFAULT_TRANSLATION_CODE,
): BiblePassage | null {
  const translation = getMockTranslation(translationCode);
  const verseStart = reference.verseStart;
  const verseEnd = reference.verseEnd ?? reference.verseStart;

  // Chapitre entier sans versets précis : pas de mock passage détaillé pour l'instant
  if (verseStart == null || verseEnd == null) {
    return null;
  }

  const rangeKey = verseRangeKey(
    translation.code,
    reference.bookId,
    reference.chapter,
    verseStart,
    verseEnd,
  );

  let verses = mockVerseStore[rangeKey];

  if (!verses && verseStart !== verseEnd) {
    verses = [];
    for (let v = verseStart; v <= verseEnd; v += 1) {
      const single =
        mockVerseStore[
          verseRangeKey(
            translation.code,
            reference.bookId,
            reference.chapter,
            v,
            v,
          )
        ];
      if (single?.[0]) verses.push(single[0]);
    }
    if (verses.length === 0) verses = undefined;
  }

  if (!verses || verses.length === 0) {
    // Fallback LSG si traduction demandée absente
    if (translation.code !== MOCK_DEFAULT_TRANSLATION_CODE) {
      return buildMockPassage(reference, MOCK_DEFAULT_TRANSLATION_CODE);
    }
    return null;
  }

  return {
    reference,
    translation,
    verses,
  };
}

export function listMockPassagesForReferences(
  references: ResolvedBibleReference[],
  translationCode: string = MOCK_DEFAULT_TRANSLATION_CODE,
): Record<string, BiblePassage> {
  const result: Record<string, BiblePassage> = {};
  for (const ref of references) {
    const passage = buildMockPassage(ref, translationCode);
    if (passage) {
      result[referenceKey(ref)] = passage;
    }
  }
  return result;
}
