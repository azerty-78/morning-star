import type { AnalyticsSummary } from "@/domain/analytics";

export interface AnalyticsRepository {
  getSummary(meditationId: string): Promise<AnalyticsSummary>;
}

/** Stub mock minimal — analytics métier plus tard. */
export class MockAnalyticsRepository implements AnalyticsRepository {
  async getSummary(meditationId: string): Promise<AnalyticsSummary> {
    return { meditationId, viewCount: 0 };
  }
}
