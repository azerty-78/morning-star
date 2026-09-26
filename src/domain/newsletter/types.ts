/**
 * Domaine newsletter — abonnés, tokens, notifications.
 * Les emails ne sortent jamais vers le frontend public.
 */

export const NewsletterStatus = {
  PENDING: "PENDING",
  ACTIVE: "ACTIVE",
  UNSUBSCRIBED: "UNSUBSCRIBED",
  BOUNCED: "BOUNCED",
  COMPLAINED: "COMPLAINED",
} as const;

export type NewsletterStatus =
  (typeof NewsletterStatus)[keyof typeof NewsletterStatus];

export const NewsletterEventType = {
  SUBSCRIBE: "SUBSCRIBE",
  CONFIRM: "CONFIRM",
  UNSUBSCRIBE: "UNSUBSCRIBE",
  SEND: "SEND",
  OPEN: "OPEN",
  CLICK: "CLICK",
  BOUNCE: "BOUNCE",
  COMPLAINT: "COMPLAINT",
} as const;

export type NewsletterEventType =
  (typeof NewsletterEventType)[keyof typeof NewsletterEventType];

export const NewsletterNotificationKind = {
  CONFIRMATION: "CONFIRMATION",
  PUBLICATION: "PUBLICATION",
  SYSTEM: "SYSTEM",
} as const;

export type NewsletterNotificationKind =
  (typeof NewsletterNotificationKind)[keyof typeof NewsletterNotificationKind];

export const NewsletterNotificationStatus = {
  QUEUED: "QUEUED",
  SENT: "SENT",
  PARTIAL: "PARTIAL",
  FAILED: "FAILED",
} as const;

export type NewsletterNotificationStatus =
  (typeof NewsletterNotificationStatus)[keyof typeof NewsletterNotificationStatus];

export interface NewsletterSubscriber {
  id: string;
  email: string;
  status: NewsletterStatus;
  confirmToken: string;
  unsubscribeToken: string;
  source?: string;
  subscribedAt: Date;
  confirmedAt?: Date;
  unsubscribedAt?: Date;
}

export interface NewsletterEvent {
  id: string;
  subscriberId: string;
  type: NewsletterEventType;
  metadata?: Record<string, unknown>;
  createdAt: Date;
}

/** Historique d’envois (vue admin) — agrégé, sans liste d’emails publique. */
export interface NewsletterNotification {
  id: string;
  kind: NewsletterNotificationKind;
  status: NewsletterNotificationStatus;
  subject: string;
  /** Identifiant méditation liée (publication). */
  meditationId?: string;
  meditationTitle?: string;
  recipientCount: number;
  sentCount: number;
  failedCount: number;
  createdAt: Date;
  completedAt?: Date;
}

export interface NewsletterCounts {
  total: number;
  active: number;
  pending: number;
  unsubscribed: number;
}

/** Réponse publique générique — jamais d’email. */
export interface NewsletterPublicResult {
  ok: boolean;
  code:
    | "CHECK_INBOX"
    | "ALREADY_ACTIVE"
    | "CONFIRMED"
    | "UNSUBSCRIBED"
    | "INVALID_TOKEN"
    | "INVALID_EMAIL"
    | "ERROR";
  message: string;
}

export interface NewsletterAdminSnapshot {
  counts: NewsletterCounts;
  notifications: NewsletterNotification[];
  /** Emails masqués (admin uniquement). */
  recentSubscribers: Array<{
    id: string;
    emailMasked: string;
    status: NewsletterStatus;
    subscribedAt: string;
  }>;
}
