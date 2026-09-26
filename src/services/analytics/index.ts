import {
  ArticleViewKind,
  DeviceClass,
  type AnalyticsDashboard,
  type AnalyticsSummary,
  type RecordViewResult,
} from "@/domain/analytics";
import { NewsletterEventType } from "@/domain/newsletter";
import { mockPendingComments } from "@/lib/mock";
import {
  ANALYTICS_NOTES,
  PAGE_VIEW_DEBOUNCE_MS,
  SESSION_COOKIE_NAME,
  extractReferrerHost,
  inferDeviceClass,
  isValidSessionKey,
  createSessionKey,
} from "@/lib/analytics";
import { getAnalyticsRepository, getMeditationRepository } from "@/lib/db";
import { newsletterStore } from "@/lib/newsletter";
import { createNewsletterService } from "@/services/newsletter";

function startOfUtcDay(d = new Date()): Date {
  const x = new Date(d);
  x.setUTCHours(0, 0, 0, 0);
  return x;
}

function daysAgo(n: number): Date {
  const x = startOfUtcDay();
  x.setUTCDate(x.getUTCDate() - n);
  return x;
}

/**
 * Service analytics — enregistrement dédoublonné + dashboard éditorial.
 */
export class AnalyticsService {
  constructor(
    private readonly repo = getAnalyticsRepository(),
    private readonly meditations = getMeditationRepository(),
  ) {}

  async recordPageView(input: {
    meditationId: string;
    sessionKey: string;
    referrer?: string | null;
    userAgent?: string | null;
  }): Promise<RecordViewResult> {
    return this.repo.record({
      meditationId: input.meditationId,
      sessionKey: input.sessionKey,
      kind: ArticleViewKind.PAGE_VIEW,
      referrerHost: extractReferrerHost(input.referrer ?? undefined),
      deviceClass: mapDevice(inferDeviceClass(input.userAgent)),
    });
  }

  async recordDownload(input: {
    meditationId: string;
    sessionKey: string;
  }): Promise<RecordViewResult> {
    return this.repo.record({
      meditationId: input.meditationId,
      sessionKey: input.sessionKey,
      kind: ArticleViewKind.DOWNLOAD,
    });
  }

  async getSummary(meditationId: string): Promise<AnalyticsSummary> {
    const rows = await this.repo.countByMeditation();
    const row = rows.find((r) => r.meditationId === meditationId);
    return {
      meditationId,
      viewCount: row?.pageViews ?? 0,
      uniqueSessions: row?.uniqueSessions ?? 0,
    };
  }

  async getDashboard(): Promise<AnalyticsDashboard> {
    const now = new Date();
    const todayStart = startOfUtcDay(now);
    const weekStart = daysAgo(7);
    const monthStart = daysAgo(30);
    const seriesStart = daysAgo(14);

    const [allTime, today, week, month, daily, byMeditation, nlSnap] =
      await Promise.all([
        this.repo.countPeriod(new Date(0)),
        this.repo.countPeriod(todayStart),
        this.repo.countPeriod(weekStart),
        this.repo.countPeriod(monthStart),
        this.repo.dailyBuckets(seriesStart, now),
        this.repo.countByMeditation(),
        createNewsletterService().getAdminSnapshot(),
      ]);

    const published = await this.meditations.findPublished(200);
    const meta = new Map(
      published.map((m) => [
        m.id,
        {
          title: m.title,
          slug: m.slug,
          publicationDate: m.publicationDate,
        },
      ]),
    );

    const topMeditations = byMeditation
      .map((row) => {
        const m = meta.get(row.meditationId);
        return {
          meditationId: row.meditationId,
          title: m?.title ?? row.meditationId,
          slug: m?.slug ?? "",
          publicationDate: m?.publicationDate ?? "",
          pageViews: row.pageViews,
          uniqueSessions: row.uniqueSessions,
          downloads: row.downloads,
        };
      })
      .sort((a, b) => b.pageViews - a.pageViews)
      .slice(0, 10);

    const newsletterEvents = newsletterStore.listEvents();
    const subscriptions = newsletterEvents.filter(
      (e) => e.type === NewsletterEventType.SUBSCRIBE,
    ).length;
    const unsubscriptions = newsletterEvents.filter(
      (e) => e.type === NewsletterEventType.UNSUBSCRIBE,
    ).length;

    return {
      allTime,
      today,
      week,
      month,
      daily,
      topMeditations,
      newsletter: {
        subscriptions,
        unsubscriptions,
        active: nlSnap.counts.active,
      },
      comments: {
        total: mockPendingComments.length,
        pending: mockPendingComments.filter((c) => c.status === "PENDING")
          .length,
      },
      strategy: {
        pageViewDebounceSeconds: PAGE_VIEW_DEBOUNCE_MS / 1000,
        sessionCookieName: SESSION_COOKIE_NAME,
        notes: [...ANALYTICS_NOTES],
      },
    };
  }

  /** Assure une clé de session valide (génère si absente / invalide). */
  ensureSessionKey(candidate: string | undefined | null): string {
    if (candidate && isValidSessionKey(candidate)) return candidate;
    return createSessionKey();
  }
}

function mapDevice(
  value: "UNKNOWN" | "DESKTOP" | "MOBILE",
): (typeof DeviceClass)[keyof typeof DeviceClass] {
  return DeviceClass[value];
}

export function createAnalyticsService(): AnalyticsService {
  return new AnalyticsService();
}
