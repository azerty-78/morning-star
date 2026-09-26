import {
  existsSync,
  mkdirSync,
  readFileSync,
  writeFileSync,
} from "node:fs";
import path from "node:path";
import {
  ArticleViewKind,
  DeviceClass,
  type ArticleView,
} from "@/domain/analytics";
import { mockArticleViews } from "@/lib/mock/admin";
import { createId } from "@/lib/newsletter/tokens";

const DIR = path.join(process.cwd(), ".data", "analytics");
const VIEWS_FILE = path.join(DIR, "article-views.json");

interface SerializedView {
  id: string;
  meditationId: string;
  kind: ArticleView["kind"];
  viewedAt: string;
  sessionKey: string;
  referrerHost?: string;
  deviceClass?: ArticleView["deviceClass"];
}

function ensureDir(): void {
  if (!existsSync(DIR)) mkdirSync(DIR, { recursive: true });
}

function toView(s: SerializedView): ArticleView {
  return {
    id: s.id,
    meditationId: s.meditationId,
    kind: s.kind,
    viewedAt: new Date(s.viewedAt),
    sessionKey: s.sessionKey,
    referrerHost: s.referrerHost,
    deviceClass: s.deviceClass,
  };
}

function fromView(v: ArticleView): SerializedView {
  return {
    id: v.id,
    meditationId: v.meditationId,
    kind: v.kind,
    viewedAt: v.viewedAt.toISOString(),
    sessionKey: v.sessionKey,
    referrerHost: v.referrerHost,
    deviceClass: v.deviceClass,
  };
}

function seedIfEmpty(): void {
  ensureDir();
  if (existsSync(VIEWS_FILE)) {
    try {
      const existing = JSON.parse(readFileSync(VIEWS_FILE, "utf8")) as unknown;
      if (Array.isArray(existing) && existing.length > 0) return;
    } catch {
      /* reseed */
    }
  }

  const now = Date.now();
  const rows: SerializedView[] = [];
  let sessionIdx = 0;

  for (const [meditationId, total] of Object.entries(mockArticleViews)) {
    // Répartir les vues sur ~28 jours, plusieurs sessions
    const days = 28;
    const perDay = Math.max(1, Math.floor(total / days));
    let remaining = total;

    for (let d = 0; d < days && remaining > 0; d++) {
      const dayCount = Math.min(
        remaining,
        perDay + (d % 3 === 0 ? 2 : 0),
      );
      remaining -= dayCount;

      for (let i = 0; i < dayCount; i++) {
        sessionIdx += 1;
        // ~70 % sessions « uniques » / jour, le reste = refreshs même session (filtrés à l’insert réel ; ici on simule déjà distinct)
        const sessionKey =
          i % 4 === 0 && i > 0
            ? `ms_seed_${meditationId.slice(-4)}_${d}`
            : `ms_seed_${sessionIdx}`;

        const hour = 6 + (i % 14);
        const viewedAt = new Date(now - d * 86400000);
        viewedAt.setUTCHours(hour, (i * 7) % 60, 0, 0);

        rows.push({
          id: createId("av"),
          meditationId,
          kind: ArticleViewKind.PAGE_VIEW,
          viewedAt: viewedAt.toISOString(),
          sessionKey,
          referrerHost: i % 5 === 0 ? "www.google.com" : undefined,
          deviceClass:
            i % 3 === 0 ? DeviceClass.MOBILE : DeviceClass.DESKTOP,
        });
      }

      // Quelques téléchargements
      if (d % 4 === 0 && dayCount > 0) {
        rows.push({
          id: createId("av"),
          meditationId,
          kind: ArticleViewKind.DOWNLOAD,
          viewedAt: new Date(now - d * 86400000 + 3600000).toISOString(),
          sessionKey: `ms_seed_dl_${meditationId.slice(-4)}_${d}`,
          deviceClass: DeviceClass.DESKTOP,
        });
      }
    }
  }

  writeFileSync(VIEWS_FILE, JSON.stringify(rows, null, 2), "utf8");
}

export const analyticsStore = {
  list(): ArticleView[] {
    seedIfEmpty();
    try {
      const raw = JSON.parse(readFileSync(VIEWS_FILE, "utf8")) as SerializedView[];
      return raw.map(toView);
    } catch {
      return [];
    }
  },

  save(views: ArticleView[]): void {
    ensureDir();
    writeFileSync(
      VIEWS_FILE,
      JSON.stringify(views.map(fromView), null, 2),
      "utf8",
    );
  },

  append(view: ArticleView): void {
    const all = this.list();
    all.push(view);
    this.save(all);
  },
};
