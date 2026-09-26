import {
  ArticleViewKind,
  type ArticleView,
  type PeriodCounts,
  type RecordViewInput,
  type RecordViewResult,
} from "@/domain/analytics";
import {
  DOWNLOAD_DEBOUNCE_MS,
  PAGE_VIEW_DEBOUNCE_MS,
  analyticsStore,
  isValidSessionKey,
} from "@/lib/analytics";
import { createId } from "@/lib/newsletter/tokens";
import type { AnalyticsRepository } from "./analytics.repository";

function periodCounts(views: ArticleView[]): PeriodCounts {
  const pageViews = views.filter((v) => v.kind === ArticleViewKind.PAGE_VIEW);
  const downloads = views.filter((v) => v.kind === ArticleViewKind.DOWNLOAD);
  const sessions = new Set(pageViews.map((v) => v.sessionKey));
  return {
    pageViews: pageViews.length,
    uniqueSessions: sessions.size,
    downloads: downloads.length,
  };
}

export class MockAnalyticsRepository implements AnalyticsRepository {
  async findRecent(
    meditationId: string,
    sessionKey: string,
    kind: ArticleView["kind"],
    withinMs: number,
  ): Promise<ArticleView | null> {
    const cutoff = Date.now() - withinMs;
    const matches = analyticsStore
      .list()
      .filter(
        (v) =>
          v.meditationId === meditationId &&
          v.sessionKey === sessionKey &&
          v.kind === kind &&
          v.viewedAt.getTime() >= cutoff,
      )
      .sort((a, b) => b.viewedAt.getTime() - a.viewedAt.getTime());
    return matches[0] ?? null;
  }

  async record(input: RecordViewInput): Promise<RecordViewResult> {
    if (!isValidSessionKey(input.sessionKey) || !input.meditationId) {
      return { recorded: false, reason: "invalid" };
    }

    const kind = input.kind ?? ArticleViewKind.PAGE_VIEW;
    const debounce =
      kind === ArticleViewKind.DOWNLOAD
        ? DOWNLOAD_DEBOUNCE_MS
        : PAGE_VIEW_DEBOUNCE_MS;

    const recent = await this.findRecent(
      input.meditationId,
      input.sessionKey,
      kind,
      debounce,
    );
    if (recent) {
      return { recorded: false, reason: "deduped" };
    }

    const view: ArticleView = {
      id: createId("av"),
      meditationId: input.meditationId,
      kind,
      viewedAt: input.viewedAt ?? new Date(),
      sessionKey: input.sessionKey,
      referrerHost: input.referrerHost,
      deviceClass: input.deviceClass,
    };

    analyticsStore.append(view);
    return { recorded: true, reason: "recorded", viewId: view.id };
  }

  async listSince(since: Date): Promise<ArticleView[]> {
    return analyticsStore
      .list()
      .filter((v) => v.viewedAt.getTime() >= since.getTime());
  }

  async listAll(): Promise<ArticleView[]> {
    return analyticsStore.list();
  }

  async countPeriod(since: Date, until?: Date): Promise<PeriodCounts> {
    const end = until?.getTime() ?? Number.POSITIVE_INFINITY;
    const views = analyticsStore
      .list()
      .filter(
        (v) =>
          v.viewedAt.getTime() >= since.getTime() &&
          v.viewedAt.getTime() < end,
      );
    return periodCounts(views);
  }

  async countByMeditation(since?: Date) {
    const views = analyticsStore
      .list()
      .filter((v) => !since || v.viewedAt.getTime() >= since.getTime());

    const map = new Map<
      string,
      { pageViews: number; sessions: Set<string>; downloads: number }
    >();

    for (const v of views) {
      const row = map.get(v.meditationId) ?? {
        pageViews: 0,
        sessions: new Set<string>(),
        downloads: 0,
      };
      if (v.kind === ArticleViewKind.PAGE_VIEW) {
        row.pageViews += 1;
        row.sessions.add(v.sessionKey);
      } else if (v.kind === ArticleViewKind.DOWNLOAD) {
        row.downloads += 1;
      }
      map.set(v.meditationId, row);
    }

    return [...map.entries()].map(([meditationId, row]) => ({
      meditationId,
      pageViews: row.pageViews,
      uniqueSessions: row.sessions.size,
      downloads: row.downloads,
    }));
  }

  async dailyBuckets(since: Date, until: Date) {
    const views = analyticsStore
      .list()
      .filter(
        (v) =>
          v.viewedAt.getTime() >= since.getTime() &&
          v.viewedAt.getTime() < until.getTime(),
      );

    const byDate = new Map<
      string,
      { pageViews: number; sessions: Set<string>; downloads: number }
    >();

    for (const v of views) {
      const date = v.viewedAt.toISOString().slice(0, 10);
      const row = byDate.get(date) ?? {
        pageViews: 0,
        sessions: new Set<string>(),
        downloads: 0,
      };
      if (v.kind === ArticleViewKind.PAGE_VIEW) {
        row.pageViews += 1;
        row.sessions.add(v.sessionKey);
      } else {
        row.downloads += 1;
      }
      byDate.set(date, row);
    }

    // Remplir les jours vides
    const buckets: Array<{
      date: string;
      pageViews: number;
      uniqueSessions: number;
      downloads: number;
    }> = [];
    const cursor = new Date(since);
    cursor.setUTCHours(0, 0, 0, 0);
    const end = until.getTime();

    while (cursor.getTime() < end) {
      const date = cursor.toISOString().slice(0, 10);
      const row = byDate.get(date);
      buckets.push({
        date,
        pageViews: row?.pageViews ?? 0,
        uniqueSessions: row?.sessions.size ?? 0,
        downloads: row?.downloads ?? 0,
      });
      cursor.setUTCDate(cursor.getUTCDate() + 1);
    }

    return buckets;
  }
}
