import type {
  ArticleView,
  PeriodCounts,
  RecordViewInput,
  RecordViewResult,
} from "@/domain/analytics";

export interface AnalyticsRepository {
  record(input: RecordViewInput): Promise<RecordViewResult>;
  findRecent(
    meditationId: string,
    sessionKey: string,
    kind: ArticleView["kind"],
    withinMs: number,
  ): Promise<ArticleView | null>;
  listSince(since: Date): Promise<ArticleView[]>;
  listAll(): Promise<ArticleView[]>;
  countPeriod(since: Date, until?: Date): Promise<PeriodCounts>;
  countByMeditation(
    since?: Date,
  ): Promise<
    Array<{
      meditationId: string;
      pageViews: number;
      uniqueSessions: number;
      downloads: number;
    }>
  >;
  dailyBuckets(since: Date, until: Date): Promise<
    Array<{
      date: string;
      pageViews: number;
      uniqueSessions: number;
      downloads: number;
    }>
  >;
}
