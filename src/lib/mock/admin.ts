/**
 * MOCK admin — commentaires, newsletter, vues.
 * Identifié comme mock ; à remplacer par Prisma.
 */

import type { AdminCommentItem } from "@/domain/admin";

export const mockPendingComments: AdminCommentItem[] = [
  {
    id: "cmt_mock_001",
    meditationId: "med_mock_20260926",
    meditationTitle: "L'étoile du matin",
    authorName: "Claire M.",
    excerpt: "Merci pour cette méditation, elle m'a accompagnée ce matin…",
    createdAt: "2026-09-26T08:12:00.000Z",
    status: "PENDING",
  },
  {
    id: "cmt_mock_002",
    meditationId: "med_mock_20260925",
    meditationTitle: "Le silence qui forme",
    authorName: "Paul D.",
    excerpt: "Le rappel du Psaume 46:10 était exactement ce dont j'avais besoin.",
    createdAt: "2026-09-25T19:40:00.000Z",
    status: "PENDING",
  },
  {
    id: "cmt_mock_003",
    meditationId: "med_mock_20260924",
    meditationTitle: "Marcher dans la lumière",
    authorName: "Anonymous",
    excerpt: "Pouvez-vous préciser la traduction utilisée pour 1 Jean 1:7 ?",
    createdAt: "2026-09-24T21:05:00.000Z",
    status: "PENDING",
  },
];

export const mockNewsletterStats = {
  active: 1284,
  total: 1410,
  unsubscribed: 126,
};

/** Vues cumulées mock (id → count). */
export const mockArticleViews: Record<string, number> = {
  med_mock_20260926: 412,
  med_mock_20260925: 388,
  med_mock_20260924: 356,
  med_mock_20260920: 290,
  med_mock_20260915: 265,
  med_mock_20260901: 240,
  med_mock_20251224: 890,
  med_mock_20250615: 310,
  med_mock_20250301: 275,
};

export function sumMockViews(): number {
  return Object.values(mockArticleViews).reduce((a, b) => a + b, 0);
}
