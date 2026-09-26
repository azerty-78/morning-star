import type {
  AdminCalendarDay,
  AdminCommentItem,
  AdminDashboardSnapshot,
} from "@/domain/admin";
import {
  MeditationStatus,
  type DailyMeditation,
  type MeditationStatus as MeditationStatusType,
} from "@/domain/meditation";
import {
  mockArticleViews,
  mockNewsletterStats,
  mockPendingComments,
  sumMockViews,
} from "@/lib/mock";
import { createMeditationService } from "@/services/meditation";

/**
 * Service admin — agrégats pour auteur unique.
 * Branché sur mocks / MeditationService ; Prisma plus tard.
 */
export class AdminService {
  constructor(
    private readonly meditations = createMeditationService(),
  ) {}

  async getDashboard(): Promise<AdminDashboardSnapshot> {
    const all = await this.meditations.listAll();
    const published = all.filter((m) => m.status === MeditationStatus.PUBLISHED);
    const scheduled = all
      .filter((m) => m.status === MeditationStatus.SCHEDULED)
      .sort((a, b) => a.publicationDate.localeCompare(b.publicationDate));
    const drafts = all.filter((m) => m.status === MeditationStatus.DRAFT);

    const current = await this.meditations.getToday();
    const recentPublished = published
      .sort((a, b) => b.publicationDate.localeCompare(a.publicationDate))
      .slice(0, 5);

    return {
      current,
      recentPublished,
      scheduled,
      drafts,
      totalViews: sumMockViews(),
      viewsThisWeek: Math.round(sumMockViews() * 0.12),
      newsletterActive: mockNewsletterStats.active,
      newsletterTotal: mockNewsletterStats.total,
      pendingComments: mockPendingComments,
    };
  }

  async listMeditations(): Promise<DailyMeditation[]> {
    return this.meditations.listAll();
  }

  async listComments(): Promise<AdminCommentItem[]> {
    return mockPendingComments;
  }

  async getNewsletterSnapshot() {
    return {
      ...mockNewsletterStats,
      recentSignups: 18,
      openRateHint: "—",
    };
  }

  async getStatsSnapshot() {
    const all = await this.meditations.listAll();
    const published = all.filter((m) => m.status === MeditationStatus.PUBLISHED);
    const byId = published.map((m) => ({
      id: m.id,
      title: m.title,
      slug: m.slug,
      publicationDate: m.publicationDate,
      views: mockArticleViews[m.id] ?? 0,
    }));
    byId.sort((a, b) => b.views - a.views);

    return {
      totalViews: sumMockViews(),
      publishedCount: published.length,
      draftCount: all.filter((m) => m.status === MeditationStatus.DRAFT).length,
      scheduledCount: all.filter((m) => m.status === MeditationStatus.SCHEDULED)
        .length,
      newsletterActive: mockNewsletterStats.active,
      topArticles: byId.slice(0, 8),
    };
  }

  /**
   * Calendrier éditorial du mois (YYYY-MM).
   * Une case = date de publication éditoriale.
   */
  async getCalendarMonth(yearMonth: string): Promise<{
    yearMonth: string;
    days: AdminCalendarDay[];
    legend: Array<{ status: MeditationStatusType; label: string }>;
  }> {
    const all = await this.meditations.listAll();
    const prefix = yearMonth.slice(0, 7);
    const inMonth = all.filter((m) => m.publicationDate.startsWith(prefix));

    const byDate = new Map<string, AdminCalendarDay["items"]>();
    for (const m of inMonth) {
      const list = byDate.get(m.publicationDate) ?? [];
      list.push({
        id: m.id,
        title: m.title,
        slug: m.slug,
        status: m.status,
      });
      byDate.set(m.publicationDate, list);
    }

    const days: AdminCalendarDay[] = [...byDate.entries()]
      .sort(([a], [b]) => a.localeCompare(b))
      .map(([date, items]) => ({ date, items }));

    return {
      yearMonth: prefix,
      days,
      legend: [
        { status: MeditationStatus.DRAFT, label: "BROUILLON" },
        { status: MeditationStatus.SCHEDULED, label: "PROGRAMMÉ" },
        { status: MeditationStatus.PUBLISHED, label: "PUBLIÉ" },
      ],
    };
  }
}

export function createAdminService(): AdminService {
  return new AdminService();
}

export function statusLabel(status: MeditationStatusType): string {
  switch (status) {
    case MeditationStatus.DRAFT:
      return "BROUILLON";
    case MeditationStatus.SCHEDULED:
      return "PROGRAMMÉ";
    case MeditationStatus.PUBLISHED:
      return "PUBLIÉ";
    case MeditationStatus.ARCHIVED:
      return "ARCHIVÉ";
    default:
      return status;
  }
}
