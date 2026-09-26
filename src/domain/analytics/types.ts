export interface ArticleView {
  id: string;
  meditationId: string;
  viewedAt: Date;
  /** Identifiant anonyme de session — jamais de PII ici */
  sessionKey?: string;
}

export interface AnalyticsSummary {
  meditationId: string;
  viewCount: number;
}
