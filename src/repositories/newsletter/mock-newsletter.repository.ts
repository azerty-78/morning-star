import {
  type NewsletterCounts,
  type NewsletterEvent,
  type NewsletterNotification,
  type NewsletterSubscriber,
  NewsletterStatus,
} from "@/domain/newsletter";
import {
  createId,
  newsletterStore,
  normalizeEmail,
} from "@/lib/newsletter";
import type {
  CreateSubscriberInput,
  NewsletterRepository,
} from "./newsletter.repository";

export class MockNewsletterRepository implements NewsletterRepository {
  async findByEmail(email: string): Promise<NewsletterSubscriber | null> {
    const normalized = normalizeEmail(email);
    return (
      newsletterStore
        .listSubscribers()
        .find((s) => s.email === normalized) ?? null
    );
  }

  async findByConfirmToken(
    token: string,
  ): Promise<NewsletterSubscriber | null> {
    return (
      newsletterStore
        .listSubscribers()
        .find((s) => s.confirmToken === token) ?? null
    );
  }

  async findByUnsubscribeToken(
    token: string,
  ): Promise<NewsletterSubscriber | null> {
    return (
      newsletterStore
        .listSubscribers()
        .find((s) => s.unsubscribeToken === token) ?? null
    );
  }

  async create(input: CreateSubscriberInput): Promise<NewsletterSubscriber> {
    const subscriber: NewsletterSubscriber = {
      id: createId("nls"),
      email: normalizeEmail(input.email),
      status: input.status,
      confirmToken: input.confirmToken,
      unsubscribeToken: input.unsubscribeToken,
      source: input.source,
      subscribedAt: new Date(),
    };
    const all = newsletterStore.listSubscribers();
    all.push(subscriber);
    newsletterStore.saveSubscribers(all);
    return subscriber;
  }

  async update(
    id: string,
    patch: Partial<
      Pick<
        NewsletterSubscriber,
        | "status"
        | "confirmedAt"
        | "unsubscribedAt"
        | "confirmToken"
        | "unsubscribeToken"
      >
    >,
  ): Promise<NewsletterSubscriber | null> {
    const all = newsletterStore.listSubscribers();
    const index = all.findIndex((s) => s.id === id);
    if (index < 0) return null;
    const current = all[index]!;
    const next: NewsletterSubscriber = { ...current, ...patch };
    // Permettre l’effacement explicite des dates optionnelles
    if ("confirmedAt" in patch && patch.confirmedAt === undefined) {
      delete next.confirmedAt;
    }
    if ("unsubscribedAt" in patch && patch.unsubscribedAt === undefined) {
      delete next.unsubscribedAt;
    }
    all[index] = next;
    newsletterStore.saveSubscribers(all);
    return next;
  }

  async listActive(): Promise<NewsletterSubscriber[]> {
    return newsletterStore
      .listSubscribers()
      .filter((s) => s.status === NewsletterStatus.ACTIVE);
  }

  async getCounts(): Promise<NewsletterCounts> {
    const all = newsletterStore.listSubscribers();
    return {
      total: all.length,
      active: all.filter((s) => s.status === NewsletterStatus.ACTIVE).length,
      pending: all.filter((s) => s.status === NewsletterStatus.PENDING).length,
      unsubscribed: all.filter(
        (s) => s.status === NewsletterStatus.UNSUBSCRIBED,
      ).length,
    };
  }

  async listRecent(limit = 20): Promise<NewsletterSubscriber[]> {
    return [...newsletterStore.listSubscribers()]
      .sort((a, b) => b.subscribedAt.getTime() - a.subscribedAt.getTime())
      .slice(0, limit);
  }

  async addEvent(
    event: Omit<NewsletterEvent, "id" | "createdAt"> & { id?: string },
  ): Promise<NewsletterEvent> {
    const row: NewsletterEvent = {
      id: event.id ?? createId("nle"),
      subscriberId: event.subscriberId,
      type: event.type,
      metadata: event.metadata,
      createdAt: new Date(),
    };
    const all = newsletterStore.listEvents();
    all.push(row);
    newsletterStore.saveEvents(all);
    return row;
  }

  async createNotification(
    input: Omit<NewsletterNotification, "id" | "createdAt"> & { id?: string },
  ): Promise<NewsletterNotification> {
    const row: NewsletterNotification = {
      id: input.id ?? createId("nln"),
      kind: input.kind,
      status: input.status,
      subject: input.subject,
      meditationId: input.meditationId,
      meditationTitle: input.meditationTitle,
      recipientCount: input.recipientCount,
      sentCount: input.sentCount,
      failedCount: input.failedCount,
      createdAt: new Date(),
      completedAt: input.completedAt,
    };
    const all = newsletterStore.listNotifications();
    all.unshift(row);
    newsletterStore.saveNotifications(all);
    return row;
  }

  async updateNotification(
    id: string,
    patch: Partial<NewsletterNotification>,
  ): Promise<NewsletterNotification | null> {
    const all = newsletterStore.listNotifications();
    const index = all.findIndex((n) => n.id === id);
    if (index < 0) return null;
    const next = { ...all[index]!, ...patch, id };
    all[index] = next;
    newsletterStore.saveNotifications(all);
    return next;
  }

  async listNotifications(limit = 50): Promise<NewsletterNotification[]> {
    return newsletterStore.listNotifications().slice(0, limit);
  }
}
