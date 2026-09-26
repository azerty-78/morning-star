/**
 * MOCK DATA Bible — architecture multi-traductions.
 *
 * LICENCE :
 * - LSG1910 : domaine public (texte de démo minimal uniquement).
 * - LSG1990 / BDS : métadonnées seulement — AUCUN texte verset embarqué
 *   (contenu protégé ; import autorisé requis).
 */

import type {
  BiblePassage,
  BibleTranslation,
  BibleVerseUnit,
  ResolvedBibleReference,
} from "@/domain/bible";
import { referenceKey } from "@/lib/bible/parse-reference";

export const MOCK_DEFAULT_TRANSLATION_CODE = "LSG1910" as const;

export const mockBibleTranslations: BibleTranslation[] = [
  {
    id: "tr_lsg1910",
    code: "LSG1910",
    name: "Louis Segond 1910",
    language: "fr",
    licenseKind: "public_domain",
    licenseVerified: true,
    requiresImport: false,
    isDefault: true,
    licenseNotice:
      "Louis Segond 1910 — domaine public. Extraits de démonstration uniquement.",
  },
  {
    id: "tr_lsg1990",
    code: "LSG1990",
    name: "Louis Segond 1990",
    language: "fr",
    licenseKind: "restricted",
    licenseVerified: false,
    requiresImport: true,
    isDefault: false,
    licenseNotice:
      "LSG1990 — droits réservés. Ne pas importer sans autorisation.",
  },
  {
    id: "tr_bds",
    code: "BDS",
    name: "Bible du Semeur",
    language: "fr",
    licenseKind: "restricted",
    licenseVerified: false,
    requiresImport: true,
    isDefault: false,
    licenseNotice:
      "Bible du Semeur — droits réservés. Ne pas importer sans autorisation.",
  },
];

type VerseStore = Record<string, BibleVerseUnit[]>;

/**
 * Uniquement LSG1910 (domaine public) — volume minimal pour tests UI.
 * Clé : `${translationCode}|${bookId}|${chapter}|${verse}`
 */
const mockVerseStore: VerseStore = {
  "LSG1910|rev|22|16": [
    {
      verse: 16,
      text: "Moi, Jésus, j'ai envoyé mon ange pour vous attester ces choses dans les Églises. Je suis la racine et la postérité de David, l'étoile brillante du matin.",
    },
  ],
  "LSG1910|2pe|1|19": [
    {
      verse: 19,
      text: "Et nous tenons pour d'autant plus certaine la parole prophétique, à laquelle vous faites bien de prêter attention, comme à une lampe qui brille dans un lieu obscur, jusqu'à ce que le jour vienne à paraître et que l'étoile du matin se lève dans vos cœurs.",
    },
  ],
  "LSG1910|psa|46|10": [
    {
      verse: 10,
      text: "Arrêtez, et sachez que je suis Dieu : Je domine sur les nations, je domine sur la terre.",
    },
  ],
  "LSG1910|1jn|1|7": [
    {
      verse: 7,
      text: "Mais si nous marchons dans la lumière, comme il est lui-même dans la lumière, nous sommes en communion les uns avec les autres, et le sang de Jésus son Fils nous purifie de tout péché.",
    },
  ],
  "LSG1910|jhn|3|16": [
    {
      verse: 16,
      text: "Car Dieu a tant aimé le monde qu'il a donné son Fils unique, afin que quiconque croit en lui ne périsse point, mais qu'il ait la vie éternelle.",
    },
  ],
  "LSG1910|jhn|3|16-17": [
    {
      verse: 16,
      text: "Car Dieu a tant aimé le monde qu'il a donné son Fils unique, afin que quiconque croit en lui ne périsse point, mais qu'il ait la vie éternelle.",
    },
    {
      verse: 17,
      text: "Dieu, en effet, n'a pas envoyé son Fils dans le monde pour qu'il juge le monde, mais pour que le monde soit sauvé par lui.",
    },
  ],
  "LSG1910|rom|8|28": [
    {
      verse: 28,
      text: "Nous savons, du reste, que toutes choses concourent au bien de ceux qui aiment Dieu, de ceux qui sont appelés selon son dessein.",
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
): BibleTranslation | undefined {
  return mockBibleTranslations.find((t) => t.code === code);
}

export function translationHasMockContent(code: string): boolean {
  return Object.keys(mockVerseStore).some((k) => k.startsWith(`${code}|`));
}

export function buildMockPassage(
  reference: ResolvedBibleReference,
  translationCode: string = MOCK_DEFAULT_TRANSLATION_CODE,
): BiblePassage | null {
  const translation = getMockTranslation(translationCode);
  if (!translation) return null;

  // Pas de texte pour traductions non vérifiées / non importées
  if (!translation.licenseVerified || translation.requiresImport) {
    if (!translationHasMockContent(translation.code)) {
      return null;
    }
  }

  const verseStart = reference.verseStart;
  const verseEnd = reference.verseEnd ?? reference.verseStart;
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
