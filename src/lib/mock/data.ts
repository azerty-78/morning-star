/**
 * MOCK DATA — clairement identifié.
 * Ne jamais mélanger silencieusement avec des données Prisma/réelles.
 */

import { UserRole, type User } from "@/domain/user";
import {
  MeditationStatus,
  type DailyMeditation,
} from "@/domain/meditation";

export const MOCK_SOURCE = "mock" as const;

export const mockAdminUser: User = {
  id: "user_admin_mock_001",
  email: "admin@morning-star.local",
  name: "Auteur Morning Star",
  role: UserRole.ADMIN,
  createdAt: new Date("2026-01-01T00:00:00.000Z"),
  updatedAt: new Date("2026-01-01T00:00:00.000Z"),
};

const base = {
  authorId: mockAdminUser.id,
  status: MeditationStatus.PUBLISHED,
} as const;

export const mockMeditations: DailyMeditation[] = [
  {
    ...base,
    id: "med_mock_20260926",
    slug: "letoile-du-matin",
    title: "L'étoile du matin",
    subtitle: "Une lumière qui précède le jour",
    publicationDate: "2026-09-26",
    themes: ["espoir", "lumiere"],
    excerpt:
      "Avant que le jour ne se lève, une lumière discrète annonce déjà la promesse.",
    body: `Il y a des matins où l'horizon paraît encore fermé. Pourtant, une étoile brille déjà — discrète, précise, certaine.

Cette lumière n'impose pas. Elle indique. Elle rappelle que la nuit n'a pas le dernier mot, et que la fidélité de Dieu précède souvent notre capacité à voir clairement. Apocalypse 22:16 nomme Jésus « l'étoile brillante du matin ».

Comme l'écrit 2 Pierre 1:19, la parole prophétique est une lampe dans l'obscurité, jusqu'à ce que le jour paraisse. Aujourd'hui, arrêtons-nous. Non pour accumuler des mots, mais pour laisser cette lumière faire son œuvre : orienter, consoler, et remettre le regard vers Celui qui vient.`,
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
    createdAt: new Date("2026-09-20T10:00:00.000Z"),
    updatedAt: new Date("2026-09-25T18:00:00.000Z"),
  },
  {
    ...base,
    id: "med_mock_20260925",
    slug: "le-silence-qui-forme",
    title: "Le silence qui forme",
    publicationDate: "2026-09-25",
    themes: ["silence", "priere"],
    excerpt:
      "Le silence n'est pas un vide : c'est un espace où la Parole peut prendre racine.",
    body: `Nous avons appris à remplir chaque pause. Pourtant, l'Écriture célèbre souvent le silence comme un lieu de formation. Psaume 46:10 nous invite : « Arrêtez, et sachez que je suis Dieu ».

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
    createdAt: new Date("2026-09-19T10:00:00.000Z"),
    updatedAt: new Date("2026-09-24T18:00:00.000Z"),
  },
  {
    ...base,
    id: "med_mock_20260924",
    slug: "marcher-dans-la-lumiere",
    title: "Marcher dans la lumière",
    publicationDate: "2026-09-24",
    themes: ["lumiere", "verite"],
    excerpt:
      "La lumière ne nous demande pas d'être parfaits : elle nous invite à être vrais.",
    body: `Marcher dans la lumière, ce n'est pas exhiber une vertu sans faille. C'est accepter d'être vu, corrigé, et relevé. 1 Jean 1:7 affirme que si nous marchons dans la lumière, nous sommes en communion les uns avec les autres.

La lumière révèle, mais elle guérit aussi. Elle expose ce qui doit être transformé, tout en affirmant que la grâce précède le jugement — comme le rappelle Jean 3:16.`,
    bibleReferences: [
      {
        label: "1 Jean 1:7",
        book: "1 Jean",
        chapter: 1,
        verseStart: 7,
        verseEnd: 7,
      },
      {
        label: "Jean 3:16",
        book: "Jean",
        chapter: 3,
        verseStart: 16,
        verseEnd: 16,
      },
    ],
    createdAt: new Date("2026-09-18T10:00:00.000Z"),
    updatedAt: new Date("2026-09-23T18:00:00.000Z"),
  },
  {
    ...base,
    id: "med_mock_20260920",
    slug: "la-fidelite-discrete",
    title: "La fidélité discrète",
    publicationDate: "2026-09-20",
    themes: ["fidelite", "espoir"],
    excerpt:
      "Dieu agit souvent sans bruit — une constance qui traverse les saisons.",
    body: `La fidélité de Dieu n'est pas un spectacle. Elle ressemble davantage à une présence régulière, presque invisible, qui soutient le quotidien.

Lorsque les grands gestes manquent, reste cette discrétion qui porte. Elle nous apprend à faire confiance au travail lent de la grâce.`,
    bibleReferences: [
      { label: "Lamentations 3:22", book: "Lamentations", chapter: 3, verseStart: 22, verseEnd: 22 },
    ],
    createdAt: new Date("2026-09-15T10:00:00.000Z"),
    updatedAt: new Date("2026-09-19T18:00:00.000Z"),
  },
  {
    ...base,
    id: "med_mock_20260915",
    slug: "pain-quotidien",
    title: "Pain quotidien",
    publicationDate: "2026-09-15",
    themes: ["priere", "dependance"],
    excerpt:
      "Demander le pain de ce jour, c'est accepter de ne pas tout maîtriser demain.",
    body: `La prière du pain quotidien recentre le cœur. Elle refuse l'accumulation anxieuse et choisit la dépendance confiante.

Chaque matin devient alors une invitation à recevoir, non à stocker.`,
    bibleReferences: [
      { label: "Matthieu 6:11", book: "Matthieu", chapter: 6, verseStart: 11, verseEnd: 11 },
    ],
    createdAt: new Date("2026-09-10T10:00:00.000Z"),
    updatedAt: new Date("2026-09-14T18:00:00.000Z"),
  },
  {
    ...base,
    id: "med_mock_20260901",
    slug: "commencer-encore",
    title: "Commencer encore",
    publicationDate: "2026-09-01",
    themes: ["espoir", "renouveau"],
    excerpt:
      "Un nouveau mois n'efface pas hier — il ouvre un espace pour recommencer.",
    body: `Recommencer n'est pas nier le passé. C'est croire qu'une page peut encore être écrite avec lucidité et grâce.

Le renouveau biblique n'est jamais cosmétique : il transforme le regard avant de transformer le calendrier.`,
    bibleReferences: [
      { label: "Ésaïe 43:19", book: "Ésaïe", chapter: 43, verseStart: 19, verseEnd: 19 },
    ],
    createdAt: new Date("2026-08-28T10:00:00.000Z"),
    updatedAt: new Date("2026-08-31T18:00:00.000Z"),
  },
  {
    ...base,
    id: "med_mock_20251224",
    slug: "nuit-de-promesse",
    title: "Nuit de promesse",
    publicationDate: "2025-12-24",
    themes: ["espoir", "incarnation"],
    excerpt:
      "Dans la nuit la plus longue, une naissance discrète change l'histoire.",
    body: `La veille de Noël rappelle que Dieu choisit souvent l'obscurité pour révéler sa proximité.

La promesse n'attend pas le plein jour pour agir. Elle commence dans la nuit, fidèle et tendre.`,
    bibleReferences: [
      { label: "Luc 2:7", book: "Luc", chapter: 2, verseStart: 7, verseEnd: 7 },
    ],
    createdAt: new Date("2025-12-20T10:00:00.000Z"),
    updatedAt: new Date("2025-12-23T18:00:00.000Z"),
  },
  {
    ...base,
    id: "med_mock_20250615",
    slug: "racines-et-vent",
    title: "Racines et vent",
    publicationDate: "2025-06-15",
    themes: ["fidelite", "perseverance"],
    excerpt:
      "Être enraciné n'empêche pas d'être agité — cela permet de tenir.",
    body: `Le vent de l'épreuve révèle la profondeur des racines. Sans racines, tout plie. Avec des racines, on plie parfois, mais on ne se déracine pas.

La persévérance chrétienne n'est pas rigidité : c'est une souplesse ancrée.`,
    bibleReferences: [
      { label: "Jérémie 17:8", book: "Jérémie", chapter: 17, verseStart: 8, verseEnd: 8 },
    ],
    createdAt: new Date("2025-06-10T10:00:00.000Z"),
    updatedAt: new Date("2025-06-14T18:00:00.000Z"),
  },
  {
    ...base,
    id: "med_mock_20250301",
    slug: "premiere-pluie",
    title: "Première pluie",
    publicationDate: "2025-03-01",
    themes: ["renouveau", "esperance"],
    excerpt:
      "Après la sécheresse intérieure, une première pluie suffit à réveiller l'espoir.",
    body: `La première pluie ne remplit pas encore les citernes. Elle annonce seulement que la saison change.

Ainsi de la grâce : un signe suffit parfois pour rappeler que la terre peut encore porter du fruit.`,
    bibleReferences: [
      { label: "Joël 2:23", book: "Joël", chapter: 2, verseStart: 23, verseEnd: 23 },
    ],
    createdAt: new Date("2025-02-25T10:00:00.000Z"),
    updatedAt: new Date("2025-02-28T18:00:00.000Z"),
  },
  {
    ...base,
    id: "med_mock_draft_001",
    slug: "brouillon-patience",
    title: "La patience du grain",
    publicationDate: "2026-10-01",
    status: MeditationStatus.DRAFT,
    themes: ["perseverance"],
    excerpt: "Brouillon — la croissance invisible de la Parole.",
    body: `Texte en cours de rédaction. Le grain pousse dans le silence de la terre.`,
    bibleReferences: [
      { label: "Marc 4:26", book: "Marc", chapter: 4, verseStart: 26, verseEnd: 26 },
    ],
    createdAt: new Date("2026-09-22T10:00:00.000Z"),
    updatedAt: new Date("2026-09-25T12:00:00.000Z"),
  },
  {
    ...base,
    id: "med_mock_scheduled_001",
    slug: "aube-promise",
    title: "L'aube promise",
    publicationDate: "2026-09-28",
    scheduledAt: "2026-09-27T22:00:00.000Z",
    status: MeditationStatus.SCHEDULED,
    themes: ["espoir", "lumiere"],
    excerpt: "Programmé — une méditation pour le lever du jour.",
    body: `Demain, avant que la ville ne s'éveille, une promesse déjà tenue attend le lecteur.`,
    bibleReferences: [
      { label: "Psaume 30:5", book: "Psaume", chapter: 30, verseStart: 5, verseEnd: 5 },
    ],
    createdAt: new Date("2026-09-24T10:00:00.000Z"),
    updatedAt: new Date("2026-09-25T16:00:00.000Z"),
  },
  {
    ...base,
    id: "med_mock_scheduled_002",
    slug: "table-dressée",
    title: "La table dressée",
    publicationDate: "2026-09-30",
    scheduledAt: "2026-09-29T22:00:00.000Z",
    status: MeditationStatus.SCHEDULED,
    themes: ["fidelite"],
    excerpt: "Programmé — hospitalité et présence.",
    body: `La table est dressée avant même que les invités n'arrivent. Ainsi de la grâce.`,
    bibleReferences: [
      { label: "Psaume 23:5", book: "Psaume", chapter: 23, verseStart: 5, verseEnd: 5 },
    ],
    createdAt: new Date("2026-09-23T10:00:00.000Z"),
    updatedAt: new Date("2026-09-25T11:00:00.000Z"),
  },
];

export const MOCK_THEME_LABELS: Record<string, string> = {
  espoir: "Espoir",
  lumiere: "Lumière",
  silence: "Silence",
  priere: "Prière",
  verite: "Vérité",
  fidelite: "Fidélité",
  dependance: "Dépendance",
  renouveau: "Renouveau",
  incarnation: "Incarnation",
  perseverance: "Persévérance",
  esperance: "Espérance",
};

export function isMockDataSource(source: string | undefined): boolean {
  return source !== "prisma";
}

export {
  mockBibleTranslations,
  MOCK_DEFAULT_TRANSLATION_CODE,
  buildMockPassage,
  listMockPassagesForReferences,
  getMockTranslation,
  translationHasMockContent,
} from "./bible";
