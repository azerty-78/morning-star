/**
 * Livres bibliques (noms français) — ordre canonique protestant courant.
 * Les alias permettent la détection dans le texte (Psaume / Psaumes, etc.).
 */

export interface BibleBookDefinition {
  /** Identifiant stable (anglais court) */
  id: string;
  /** Nom d'affichage principal */
  name: string;
  /** Alias de détection (minuscules, accents normalisés côté parseur) */
  aliases: string[];
}

export const BIBLE_BOOKS: BibleBookDefinition[] = [
  { id: "gen", name: "Genèse", aliases: ["genese", "gn"] },
  { id: "exo", name: "Exode", aliases: ["exode", "ex"] },
  { id: "lev", name: "Lévitique", aliases: ["levitique", "lv"] },
  { id: "num", name: "Nombres", aliases: ["nombres", "nb"] },
  { id: "deu", name: "Deutéronome", aliases: ["deuteronome", "dt"] },
  { id: "jos", name: "Josué", aliases: ["josue", "jos"] },
  { id: "jdg", name: "Juges", aliases: ["juges", "jg"] },
  { id: "rut", name: "Ruth", aliases: ["ruth", "rt"] },
  { id: "1sa", name: "1 Samuel", aliases: ["1 samuel", "1 sa", "1s"] },
  { id: "2sa", name: "2 Samuel", aliases: ["2 samuel", "2 sa", "2s"] },
  { id: "1ki", name: "1 Rois", aliases: ["1 rois", "1 r"] },
  { id: "2ki", name: "2 Rois", aliases: ["2 rois", "2 r"] },
  { id: "1ch", name: "1 Chroniques", aliases: ["1 chroniques", "1 ch"] },
  { id: "2ch", name: "2 Chroniques", aliases: ["2 chroniques", "2 ch"] },
  { id: "ezr", name: "Esdras", aliases: ["esdras", "esd"] },
  { id: "neh", name: "Néhémie", aliases: ["nehemie", "ne"] },
  { id: "est", name: "Esther", aliases: ["esther", "est"] },
  { id: "job", name: "Job", aliases: ["job"] },
  {
    id: "psa",
    name: "Psaumes",
    aliases: ["psaume", "psaumes", "ps"],
  },
  { id: "pro", name: "Proverbes", aliases: ["proverbes", "pr"] },
  { id: "ecc", name: "Ecclésiaste", aliases: ["ecclesiaste", "ec"] },
  {
    id: "sng",
    name: "Cantique des Cantiques",
    aliases: ["cantique", "cantique des cantiques", "ct"],
  },
  { id: "isa", name: "Ésaïe", aliases: ["esaie", "esaïe", "is"] },
  { id: "jer", name: "Jérémie", aliases: ["jeremie", "jr"] },
  {
    id: "lam",
    name: "Lamentations",
    aliases: ["lamentations", "lm"],
  },
  { id: "ezk", name: "Ézéchiel", aliases: ["ezechiel", "ez"] },
  { id: "dan", name: "Daniel", aliases: ["daniel", "dn"] },
  { id: "hos", name: "Osée", aliases: ["osee", "os"] },
  { id: "jol", name: "Joël", aliases: ["joel", "jl"] },
  { id: "amo", name: "Amos", aliases: ["amos", "am"] },
  { id: "oba", name: "Abdias", aliases: ["abdias", "ab"] },
  { id: "jon", name: "Jonas", aliases: ["jonas", "jon"] },
  { id: "mic", name: "Michée", aliases: ["michee", "mi"] },
  { id: "nam", name: "Nahum", aliases: ["nahum", "na"] },
  { id: "hab", name: "Habacuc", aliases: ["habacuc", "ha"] },
  { id: "zep", name: "Sophonie", aliases: ["sophonie", "so"] },
  { id: "hag", name: "Aggée", aliases: ["aggee", "ag"] },
  { id: "zec", name: "Zacharie", aliases: ["zacharie", "za"] },
  { id: "mal", name: "Malachie", aliases: ["malachie", "ml"] },
  { id: "mat", name: "Matthieu", aliases: ["matthieu", "mt"] },
  { id: "mrk", name: "Marc", aliases: ["marc", "mc"] },
  { id: "luk", name: "Luc", aliases: ["luc", "lc"] },
  { id: "jhn", name: "Jean", aliases: ["jean", "jn"] },
  { id: "act", name: "Actes", aliases: ["actes", "ac"] },
  { id: "rom", name: "Romains", aliases: ["romains", "rm"] },
  {
    id: "1co",
    name: "1 Corinthiens",
    aliases: ["1 corinthiens", "1 co"],
  },
  {
    id: "2co",
    name: "2 Corinthiens",
    aliases: ["2 corinthiens", "2 co"],
  },
  { id: "gal", name: "Galates", aliases: ["galates", "ga"] },
  { id: "eph", name: "Éphésiens", aliases: ["ephesiens", "ep"] },
  { id: "php", name: "Philippiens", aliases: ["philippiens", "ph"] },
  { id: "col", name: "Colossiens", aliases: ["colossiens", "col"] },
  {
    id: "1th",
    name: "1 Thessaloniciens",
    aliases: ["1 thessaloniciens", "1 th"],
  },
  {
    id: "2th",
    name: "2 Thessaloniciens",
    aliases: ["2 thessaloniciens", "2 th"],
  },
  { id: "1ti", name: "1 Timothée", aliases: ["1 timothee", "1 tm"] },
  { id: "2ti", name: "2 Timothée", aliases: ["2 timothee", "2 tm"] },
  { id: "tit", name: "Tite", aliases: ["tite", "tt"] },
  { id: "phm", name: "Philémon", aliases: ["philemon", "phm"] },
  { id: "heb", name: "Hébreux", aliases: ["hebreux", "he"] },
  { id: "jas", name: "Jacques", aliases: ["jacques", "jc"] },
  { id: "1pe", name: "1 Pierre", aliases: ["1 pierre", "1 p"] },
  { id: "2pe", name: "2 Pierre", aliases: ["2 pierre", "2 p"] },
  { id: "1jn", name: "1 Jean", aliases: ["1 jean", "1 jn"] },
  { id: "2jn", name: "2 Jean", aliases: ["2 jean", "2 jn"] },
  { id: "3jn", name: "3 Jean", aliases: ["3 jean", "3 jn"] },
  { id: "jud", name: "Jude", aliases: ["jude"] },
  {
    id: "rev",
    name: "Apocalypse",
    aliases: ["apocalypse", "ap"],
  },
];
