import type {
  NewsletterCounts,
  NewsletterEvent,
  NewsletterNotification,
  NewsletterSubscriber,
  NewsletterStatus,
} from "@/domain/newsletter";

export interface CreateSubscriberInput {
  email: string;
  confirmToken: string;
  unsubscribeToken: string;
  source?: string;
  status: NewsletterStatus;
}

export interface NewsletterRepository {
  findByEmail(email: string): Promise<NewsletterSubscriber | null>;
  findByConfirmToken(token: string): Promise<NewsletterSubscriber | null>;
  findByUnsubscribeToken(token: string): Promise<NewsletterSubscriber | null>;
  create(input: CreateSubscriberInput): Promise<NewsletterSubscriber>;
  update(
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
  ): Promise<NewsletterSubscriber | null>;
  listActive(): Promise<NewsletterSubscriber[]>;
  getCounts(): Promise<NewsletterCounts>;
  listRecent(limit?: number): Promise<NewsletterSubscriber[]>;
  addEvent(
    event: Omit<NewsletterEvent, "id" | "createdAt"> & { id?: string },
  ): Promise<NewsletterEvent>;
  createNotification(
    input: Omit<NewsletterNotification, "id" | "createdAt"> & {
      id?: string;
    },
  ): Promise<NewsletterNotification>;
  updateNotification(
    id: string,
    patch: Partial<NewsletterNotification>,
  ): Promise<NewsletterNotification | null>;
  listNotifications(limit?: number): Promise<NewsletterNotification[]>;
}
