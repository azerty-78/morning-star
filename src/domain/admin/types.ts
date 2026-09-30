/**
 * Snapshot dashboard admin — agrégats pour auteur unique.
 */

import type { DailyBucket } from "@/domain/analytics";
import type { DailyMeditation } from "@/domain/meditation";

export interface AdminCommentItem {
  id: string;
  meditationId: string;
  meditationTitle: string;
  authorName: string;
  excerpt: string;
  createdAt: string;
  status: "PENDING" | "APPROVED" | "REJECTED";
}

export interface AdminDashboardSnapshot {
  current: DailyMeditation | null;
  recentPublished: DailyMeditation[];
  scheduled: DailyMeditation[];
  drafts: DailyMeditation[];
  totalViews: number;
  viewsThisWeek: number;
  viewsToday: number;
  downloadsAllTime: number;
  /** Série récente pour le graphique du dashboard. */
  daily: DailyBucket[];
  newsletterActive: number;
  newsletterTotal: number;
  pendingComments: AdminCommentItem[];
}

export interface AdminCalendarDay {
  date: string;
  items: Array<{
    id: string;
    title: string;
    slug: string;
    status: DailyMeditation["status"];
  }>;
}
