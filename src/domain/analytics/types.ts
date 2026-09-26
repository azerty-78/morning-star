/**
 * Domaine analytics — ArticleView et agrégats.
 * Pas de PII : session anonyme opaque uniquement.
 */

export const ArticleViewKind = {
  PAGE_VIEW: "PAGE_VIEW",
  DOWNLOAD: "DOWNLOAD",
} as const;

export type ArticleViewKind =
  (typeof ArticleViewKind)[keyof typeof ArticleViewKind];

/** Classe d’appareil grossière — pas de User-Agent brut. */
export const DeviceClass = {
  UNKNOWN: "UNKNOWN",
  DESKTOP: "DESKTOP",
  MOBILE: "MOBILE",
} as const;

export type DeviceClass = (typeof DeviceClass)[keyof typeof DeviceClass];

/**
 * Hit atomique (vue ou téléchargement).
 * Une ligne ≠ un visiteur unique : les agrégats distinguent page views / sessions.
 */
export interface ArticleView {
  id: string;
  meditationId: string;
  kind: ArticleViewKind;
  viewedAt: Date;
  /** Identifiant de session anonyme (cookie) — jamais d’email / IP. */
  sessionKey: string;
  /** Host du referrer uniquement (ex. google.com), sans query. */
  referrerHost?: string;
  deviceClass?: DeviceClass;
}

export interface RecordViewInput {
  meditationId: string;
  sessionKey: string;
  kind?: ArticleViewKind;
  referrerHost?: string;
  deviceClass?: DeviceClass;
  /** Horodatage injecté pour tests / seed. */
  viewedAt?: Date;
}

export interface RecordViewResult {
  recorded: boolean;
  reason: "recorded" | "deduped" | "invalid";
  viewId?: string;
}

export interface PeriodCounts {
  pageViews: number;
  /** Sessions approximatives = sessionKey distincts. */
  uniqueSessions: number;
  downloads: number;
}

export interface DailyBucket {
  date: string;
  pageViews: number;
  uniqueSessions: number;
  downloads: number;
}

export interface MeditationStatsRow {
  meditationId: string;
  title: string;
  slug: string;
  publicationDate: string;
  pageViews: number;
  uniqueSessions: number;
  downloads: number;
}

export interface AnalyticsDashboard {
  /** Totaux toutes périodes confondues (catalogue). */
  allTime: PeriodCounts;
  today: PeriodCounts;
  week: PeriodCounts;
  month: PeriodCounts;
  /** Série quotidienne (jours récents, ordre chrono). */
  daily: DailyBucket[];
  topMeditations: MeditationStatsRow[];
  newsletter: {
    subscriptions: number;
    unsubscriptions: number;
    active: number;
  };
  comments: {
    total: number;
    pending: number;
  };
  /** Méta stratégie (transparence éditoriale). */
  strategy: {
    pageViewDebounceSeconds: number;
    sessionCookieName: string;
    notes: string[];
  };
}

/** @deprecated Préférer MeditationStatsRow / PeriodCounts. */
export interface AnalyticsSummary {
  meditationId: string;
  viewCount: number;
  uniqueSessions?: number;
}
