import {
  existsSync,
  mkdirSync,
  readFileSync,
  writeFileSync,
} from "node:fs";
import path from "node:path";
import type {
  NewsletterEvent,
  NewsletterNotification,
  NewsletterSubscriber,
} from "@/domain/newsletter";

/**
 * Persistance locale newsletter (mock) — remplacée par Prisma plus tard.
 */

const DIR = path.join(process.cwd(), ".data", "newsletter");
const SUBSCRIBERS_FILE = path.join(DIR, "subscribers.json");
const EVENTS_FILE = path.join(DIR, "events.json");
const NOTIFICATIONS_FILE = path.join(DIR, "notifications.json");

interface StoreShape {
  subscribers: SerializedSubscriber[];
  events: SerializedEvent[];
  notifications: SerializedNotification[];
}

interface SerializedSubscriber {
  id: string;
  email: string;
  status: NewsletterSubscriber["status"];
  confirmToken: string;
  unsubscribeToken: string;
  source?: string;
  subscribedAt: string;
  confirmedAt?: string;
  unsubscribedAt?: string;
}

interface SerializedEvent {
  id: string;
  subscriberId: string;
  type: NewsletterEvent["type"];
  metadata?: Record<string, unknown>;
  createdAt: string;
}

interface SerializedNotification {
  id: string;
  kind: NewsletterNotification["kind"];
  status: NewsletterNotification["status"];
  subject: string;
  meditationId?: string;
  meditationTitle?: string;
  recipientCount: number;
  sentCount: number;
  failedCount: number;
  createdAt: string;
  completedAt?: string;
}

function ensureDir(): void {
  if (!existsSync(DIR)) mkdirSync(DIR, { recursive: true });
}

function readJson<T>(file: string, fallback: T): T {
  ensureDir();
  if (!existsSync(file)) return fallback;
  try {
    return JSON.parse(readFileSync(file, "utf8")) as T;
  } catch {
    return fallback;
  }
}

function writeJson(file: string, data: unknown): void {
  ensureDir();
  writeFileSync(file, JSON.stringify(data, null, 2), "utf8");
}

function toSubscriber(s: SerializedSubscriber): NewsletterSubscriber {
  return {
    ...s,
    subscribedAt: new Date(s.subscribedAt),
    confirmedAt: s.confirmedAt ? new Date(s.confirmedAt) : undefined,
    unsubscribedAt: s.unsubscribedAt ? new Date(s.unsubscribedAt) : undefined,
  };
}

function fromSubscriber(s: NewsletterSubscriber): SerializedSubscriber {
  return {
    id: s.id,
    email: s.email,
    status: s.status,
    confirmToken: s.confirmToken,
    unsubscribeToken: s.unsubscribeToken,
    source: s.source,
    subscribedAt: s.subscribedAt.toISOString(),
    confirmedAt: s.confirmedAt?.toISOString(),
    unsubscribedAt: s.unsubscribedAt?.toISOString(),
  };
}

function toEvent(e: SerializedEvent): NewsletterEvent {
  return {
    ...e,
    createdAt: new Date(e.createdAt),
  };
}

function toNotification(n: SerializedNotification): NewsletterNotification {
  return {
    ...n,
    createdAt: new Date(n.createdAt),
    completedAt: n.completedAt ? new Date(n.completedAt) : undefined,
  };
}

function seedIfEmpty(): void {
  const subscribers = readJson<SerializedSubscriber[]>(SUBSCRIBERS_FILE, []);
  if (subscribers.length > 0) return;

  const now = Date.now();
  const seeded: SerializedSubscriber[] = [
    {
      id: "nls_seed_001",
      email: "lecteur.actif@example.com",
      status: "ACTIVE",
      confirmToken: "tok_confirm_seed_001",
      unsubscribeToken: "tok_unsub_seed_001",
      source: "seed",
      subscribedAt: new Date(now - 86400000 * 40).toISOString(),
      confirmedAt: new Date(now - 86400000 * 39).toISOString(),
    },
    {
      id: "nls_seed_002",
      email: "amie.fidèle@example.com",
      status: "ACTIVE",
      confirmToken: "tok_confirm_seed_002",
      unsubscribeToken: "tok_unsub_seed_002",
      source: "seed",
      subscribedAt: new Date(now - 86400000 * 20).toISOString(),
      confirmedAt: new Date(now - 86400000 * 19).toISOString(),
    },
    {
      id: "nls_seed_003",
      email: "ancien.lecteur@example.com",
      status: "UNSUBSCRIBED",
      confirmToken: "tok_confirm_seed_003",
      unsubscribeToken: "tok_unsub_seed_003",
      source: "seed",
      subscribedAt: new Date(now - 86400000 * 90).toISOString(),
      confirmedAt: new Date(now - 86400000 * 89).toISOString(),
      unsubscribedAt: new Date(now - 86400000 * 10).toISOString(),
    },
  ];

  writeJson(SUBSCRIBERS_FILE, seeded);
  writeJson(EVENTS_FILE, [
    {
      id: "nle_seed_001",
      subscriberId: "nls_seed_001",
      type: "SUBSCRIBE",
      createdAt: seeded[0]!.subscribedAt,
    },
    {
      id: "nle_seed_002",
      subscriberId: "nls_seed_001",
      type: "CONFIRM",
      createdAt: seeded[0]!.confirmedAt,
    },
  ]);
  writeJson(NOTIFICATIONS_FILE, [
    {
      id: "nln_seed_001",
      kind: "PUBLICATION",
      status: "SENT",
      subject: "Méditation du jour — L'étoile du matin",
      meditationId: "med_mock_20260926",
      meditationTitle: "L'étoile du matin",
      recipientCount: 2,
      sentCount: 2,
      failedCount: 0,
      createdAt: new Date(now - 86400000).toISOString(),
      completedAt: new Date(now - 86400000 + 5000).toISOString(),
    },
  ]);
}

export const newsletterStore = {
  listSubscribers(): NewsletterSubscriber[] {
    seedIfEmpty();
    return readJson<SerializedSubscriber[]>(SUBSCRIBERS_FILE, []).map(
      toSubscriber,
    );
  },

  saveSubscribers(items: NewsletterSubscriber[]): void {
    writeJson(SUBSCRIBERS_FILE, items.map(fromSubscriber));
  },

  listEvents(): NewsletterEvent[] {
    seedIfEmpty();
    return readJson<SerializedEvent[]>(EVENTS_FILE, []).map(toEvent);
  },

  saveEvents(items: NewsletterEvent[]): void {
    writeJson(
      EVENTS_FILE,
      items.map((e) => ({
        id: e.id,
        subscriberId: e.subscriberId,
        type: e.type,
        metadata: e.metadata,
        createdAt: e.createdAt.toISOString(),
      })),
    );
  },

  listNotifications(): NewsletterNotification[] {
    seedIfEmpty();
    return readJson<SerializedNotification[]>(NOTIFICATIONS_FILE, []).map(
      toNotification,
    );
  },

  saveNotifications(items: NewsletterNotification[]): void {
    writeJson(
      NOTIFICATIONS_FILE,
      items.map((n) => ({
        id: n.id,
        kind: n.kind,
        status: n.status,
        subject: n.subject,
        meditationId: n.meditationId,
        meditationTitle: n.meditationTitle,
        recipientCount: n.recipientCount,
        sentCount: n.sentCount,
        failedCount: n.failedCount,
        createdAt: n.createdAt.toISOString(),
        completedAt: n.completedAt?.toISOString(),
      })),
    );
  },
};

/** Exposé pour typage interne uniquement. */
export type { StoreShape };
