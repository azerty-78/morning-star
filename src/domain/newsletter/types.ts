export const NewsletterStatus = {
  ACTIVE: "ACTIVE",
  UNSUBSCRIBED: "UNSUBSCRIBED",
} as const;

export type NewsletterStatus =
  (typeof NewsletterStatus)[keyof typeof NewsletterStatus];

export interface NewsletterSubscriber {
  id: string;
  email: string;
  status: NewsletterStatus;
  subscribedAt: Date;
  unsubscribedAt?: Date;
}
