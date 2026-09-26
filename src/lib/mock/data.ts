/**
 * MOCK DATA — clairement identifié.
 * Ne jamais mélanger silencieusement avec des données Prisma/réelles.
 */

import { UserRole, type User } from "@/domain/user";
import {
  MeditationStatus,
  type DailyMeditation,
} from "@/domain/meditation";
import type { BibleVerse } from "@/domain/bible";

export const MOCK_SOURCE = "mock" as const;

export const mockAdminUser: User = {
  id: "user_admin_mock_001",
  email: "admin@morning-star.local",
  name: "Auteur Morning Star",
  role: UserRole.ADMIN,
  createdAt: new Date("2026-01-01T00:00:00.000Z"),
  updatedAt: new Date("2026-01-01T00:00:00.000Z"),
};

export const mockMeditations: DailyMeditation[] = [
  {
    id: "med_mock_20260926",
    slug: "letoile-du-matin",
    title: "L'étoile du matin",
    subtitle: "Une lumière qui précède le jour",
    publicationDate: "2026-09-26",
    status: MeditationStatus.PUBLISHED,
    excerpt:
      "Avant que le jour ne se lève, une lumière discrète annonce déjà la promesse.",
    body: `Il y a des matins où l'horizon paraît encore fermé. Pourtant, une étoile brille déjà — discrète, précise, certaine.

Cette lumière n'impose pas. Elle indique. Elle rappelle que la nuit n'a pas le dernier mot, et que la fidélité de Dieu précède souvent notre capacité à voir clairement.

Aujourd'hui, arrêtons-nous. Non pour accumuler des mots, mais pour laisser cette lumière faire son œuvre : orienter, consoler, et remettre le regard vers Celui qui vient.`,
    highlightQuote:
      "Je suis la racine et la postérité de David, l'étoile brillante du matin.",
    bibleReferences: [
      {
        label: "Apocalypse 22:16",
        book: "Apocalypse",
        chapter: 22,
        verseStart: 16,
        verseEnd: 16,
      },
      {
        label: "2 Pierre 1:19",
        book: "2 Pierre",
        chapter: 1,
        verseStart: 19,
        verseEnd: 19,
      },
    ],
    authorId: mockAdminUser.id,
    createdAt: new Date("2026-09-20T10:00:00.000Z"),
    updatedAt: new Date("2026-09-25T18:00:00.000Z"),
  },
  {
    id: "med_mock_20260925",
    slug: "le-silence-qui-forme",
    title: "Le silence qui forme",
    publicationDate: "2026-09-25",
    status: MeditationStatus.PUBLISHED,
    excerpt:
      "Le silence n'est pas un vide : c'est un espace où la Parole peut prendre racine.",
    body: `Nous avons appris à remplir chaque pause. Pourtant, l'Écriture célèbre souvent le silence comme un lieu de formation.

Dans le silence, les urgences se dissolvent. Les priorités redeviennent visibles. Et la voix intérieure — trop souvent étouffée — peut enfin se faire entendre.`,
    bibleReferences: [
      {
        label: "Psaume 46:10",
        book: "Psaume",
        chapter: 46,
        verseStart: 10,
        verseEnd: 10,
      },
    ],
    authorId: mockAdminUser.id,
    createdAt: new Date("2026-09-19T10:00:00.000Z"),
    updatedAt: new Date("2026-09-24T18:00:00.000Z"),
  },
  {
    id: "med_mock_20260924",
    slug: "marcher-dans-la-lumiere",
    title: "Marcher dans la lumière",
    publicationDate: "2026-09-24",
    status: MeditationStatus.PUBLISHED,
    excerpt:
      "La lumière ne nous demande pas d'être parfaits : elle nous invite à être vrais.",
    body: `Marcher dans la lumière, ce n'est pas exhiber une vertu sans faille. C'est accepter d'être vu, corrigé, et relevé.

La lumière révèle, mais elle guérit aussi. Elle expose ce qui doit être transformé, tout en affirmant que la grâce précède le jugement.`,
    bibleReferences: [
      {
        label: "1 Jean 1:7",
        book: "1 Jean",
        chapter: 1,
        verseStart: 7,
        verseEnd: 7,
      },
    ],
    authorId: mockAdminUser.id,
    createdAt: new Date("2026-09-18T10:00:00.000Z"),
    updatedAt: new Date("2026-09-23T18:00:00.000Z"),
  },
];

/** Versets mockés pour démontrer l'intégration Bible future. */
export const mockBibleVerses: BibleVerse[] = [
  {
    id: "verse_mock_rev_22_16",
    bookId: "book_mock_revelation",
    chapter: 22,
    verse: 16,
    text: "Moi, Jésus, j'ai envoyé mon ange pour vous attester ces choses dans les Églises. Je suis la racine et la postérité de David, l'étoile brillante du matin.",
  },
  {
    id: "verse_mock_2pet_1_19",
    bookId: "book_mock_2peter",
    chapter: 1,
    verse: 19,
    text: "Et nous tenons pour d'autant plus certaine la parole prophétique, à laquelle vous faites bien de prêter attention, comme à une lampe qui brille dans un lieu obscur, jusqu'à ce que le jour vienne à paraître et que l'étoile du matin se lève dans vos cœurs.",
  },
];

export function isMockDataSource(source: string | undefined): boolean {
  return source !== "prisma";
}
