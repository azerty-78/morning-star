import {
  NewsletterEventType,
  NewsletterNotificationKind,
  NewsletterNotificationStatus,
  NewsletterStatus,
  type NewsletterAdminSnapshot,
  type NewsletterPublicResult,
  type NewsletterSubscriber,
} from "@/domain/newsletter";
import type { DailyMeditation } from "@/domain/meditation";
import { APP_NAME } from "@/constants/app";
import { PUBLIC_ROUTES } from "@/constants/routes";
import {
  createOpaqueToken,
  maskEmail,
  normalizeEmail,
} from "@/lib/newsletter";
import { absoluteUrl } from "@/lib/seo";
import { isValidEmail } from "@/lib/validation";
import { getNewsletterRepository } from "@/lib/db";
import type { EmailService } from "@/services/email";
import { getEmailService } from "@/services/email";

/**
 * Service newsletter — double opt-in, désinscription, notifications publication.
 * Les réponses publiques ne contiennent jamais d’adresse email.
 */
export class NewsletterService {
  constructor(
    private readonly repo = getNewsletterRepository(),
    private readonly email: EmailService = getEmailService(),
  ) {}

  async subscribe(
    rawEmail: string,
    source = "homepage",
  ): Promise<NewsletterPublicResult> {
    if (!isValidEmail(rawEmail)) {
      return {
        ok: false,
        code: "INVALID_EMAIL",
        message: "Indiquez une adresse email valide.",
      };
    }

    const email = normalizeEmail(rawEmail);
    const existing = await this.repo.findByEmail(email);

    // Toujours le même message public — pas d’énumération d’emails.
    const genericOk: NewsletterPublicResult = {
      ok: true,
      code: "CHECK_INBOX",
      message:
        "Vérifiez votre boîte mail pour confirmer l’inscription. Pensez aux indésirables.",
    };

    if (existing?.status === NewsletterStatus.ACTIVE) {
      return genericOk;
    }

    const confirmToken = createOpaqueToken("confirm");
    const unsubscribeToken =
      existing?.unsubscribeToken ?? createOpaqueToken("unsub");

    let subscriber: NewsletterSubscriber;

    if (existing) {
      const updated = await this.repo.update(existing.id, {
        status: NewsletterStatus.PENDING,
        confirmToken,
        unsubscribeToken,
        confirmedAt: undefined,
        unsubscribedAt: undefined,
      });
      subscriber = updated ?? {
        ...existing,
        status: NewsletterStatus.PENDING,
        confirmToken,
        unsubscribeToken,
      };
    } else {
      subscriber = await this.repo.create({
        email,
        status: NewsletterStatus.PENDING,
        confirmToken,
        unsubscribeToken,
        source,
      });
    }

    await this.repo.addEvent({
      subscriberId: subscriber.id,
      type: NewsletterEventType.SUBSCRIBE,
      metadata: { source },
    });

    await this.sendConfirmationEmail({
      ...subscriber,
      confirmToken,
      unsubscribeToken,
    });

    return genericOk;
  }

  async confirm(token: string): Promise<NewsletterPublicResult> {
    if (!token?.trim()) {
      return {
        ok: false,
        code: "INVALID_TOKEN",
        message: "Lien de confirmation invalide ou expiré.",
      };
    }

    const subscriber = await this.repo.findByConfirmToken(token.trim());
    if (!subscriber) {
      return {
        ok: false,
        code: "INVALID_TOKEN",
        message: "Lien de confirmation invalide ou expiré.",
      };
    }

    if (subscriber.status === NewsletterStatus.ACTIVE) {
      return {
        ok: true,
        code: "ALREADY_ACTIVE",
        message: "Votre inscription est déjà confirmée. Merci.",
      };
    }

    await this.repo.update(subscriber.id, {
      status: NewsletterStatus.ACTIVE,
      confirmedAt: new Date(),
    });

    await this.repo.addEvent({
      subscriberId: subscriber.id,
      type: NewsletterEventType.CONFIRM,
    });

    return {
      ok: true,
      code: "CONFIRMED",
      message:
        "Inscription confirmée. Vous recevrez la méditation du jour par email.",
    };
  }

  async unsubscribe(token: string): Promise<NewsletterPublicResult> {
    if (!token?.trim()) {
      return {
        ok: false,
        code: "INVALID_TOKEN",
        message: "Lien de désinscription invalide.",
      };
    }

    const subscriber = await this.repo.findByUnsubscribeToken(token.trim());
    if (!subscriber) {
      return {
        ok: false,
        code: "INVALID_TOKEN",
        message: "Lien de désinscription invalide.",
      };
    }

    if (subscriber.status === NewsletterStatus.UNSUBSCRIBED) {
      return {
        ok: true,
        code: "UNSUBSCRIBED",
        message: "Vous êtes déjà désinscrit(e).",
      };
    }

    await this.repo.update(subscriber.id, {
      status: NewsletterStatus.UNSUBSCRIBED,
      unsubscribedAt: new Date(),
    });

    await this.repo.addEvent({
      subscriberId: subscriber.id,
      type: NewsletterEventType.UNSUBSCRIBE,
    });

    return {
      ok: true,
      code: "UNSUBSCRIBED",
      message:
        "Désinscription enregistrée. Vous ne recevrez plus nos emails.",
    };
  }

  /**
   * Déclenché à la publication d’une méditation.
   * Envoie via EmailService abstrait (mock en local).
   */
  async notifyPublication(
    meditation: DailyMeditation,
  ): Promise<{ notificationId: string; sent: number; failed: number }> {
    const active = await this.repo.listActive();
    const subject = `${APP_NAME} — ${meditation.title}`;
    const readUrl = absoluteUrl(
      `${PUBLIC_ROUTES.meditations}/${meditation.slug}`,
    );

    const notification = await this.repo.createNotification({
      kind: NewsletterNotificationKind.PUBLICATION,
      status: NewsletterNotificationStatus.QUEUED,
      subject,
      meditationId: meditation.id,
      meditationTitle: meditation.title,
      recipientCount: active.length,
      sentCount: 0,
      failedCount: 0,
    });

    let sent = 0;
    let failed = 0;

    for (const subscriber of active) {
      const unsubUrl = absoluteUrl(
        `${PUBLIC_ROUTES.newsletterUnsubscribe}?token=${encodeURIComponent(subscriber.unsubscribeToken)}`,
      );

      const result = await this.email.send({
        to: subscriber.email,
        subject,
        text: [
          meditation.title,
          "",
          meditation.excerpt,
          "",
          `Lire : ${readUrl}`,
          "",
          `Se désinscrire : ${unsubUrl}`,
        ].join("\n"),
        html: buildPublicationHtml({
          title: meditation.title,
          excerpt: meditation.excerpt,
          readUrl,
          unsubUrl,
        }),
        tags: ["publication", meditation.slug],
        headers: {
          "List-Unsubscribe": `<${unsubUrl}>`,
          "List-Unsubscribe-Post": "List-Unsubscribe=One-Click",
        },
      });

      if (result.ok) {
        sent += 1;
        await this.repo.addEvent({
          subscriberId: subscriber.id,
          type: NewsletterEventType.SEND,
          metadata: {
            notificationId: notification.id,
            messageId: result.messageId,
            meditationId: meditation.id,
          },
        });
      } else {
        failed += 1;
      }
    }

    const status =
      failed === 0
        ? NewsletterNotificationStatus.SENT
        : sent === 0
          ? NewsletterNotificationStatus.FAILED
          : NewsletterNotificationStatus.PARTIAL;

    await this.repo.updateNotification(notification.id, {
      status,
      sentCount: sent,
      failedCount: failed,
      completedAt: new Date(),
    });

    return { notificationId: notification.id, sent, failed };
  }

  async getAdminSnapshot(): Promise<NewsletterAdminSnapshot> {
    const [counts, notifications, recent] = await Promise.all([
      this.repo.getCounts(),
      this.repo.listNotifications(30),
      this.repo.listRecent(15),
    ]);

    return {
      counts,
      notifications,
      recentSubscribers: recent.map((s) => ({
        id: s.id,
        emailMasked: maskEmail(s.email),
        status: s.status,
        subscribedAt: s.subscribedAt.toISOString(),
      })),
    };
  }

  private async sendConfirmationEmail(
    subscriber: NewsletterSubscriber,
  ): Promise<void> {
    const confirmUrl = absoluteUrl(
      `${PUBLIC_ROUTES.newsletterConfirm}?token=${encodeURIComponent(subscriber.confirmToken)}`,
    );
    const unsubUrl = absoluteUrl(
      `${PUBLIC_ROUTES.newsletterUnsubscribe}?token=${encodeURIComponent(subscriber.unsubscribeToken)}`,
    );

    await this.email.send({
      to: subscriber.email,
      subject: `${APP_NAME} — Confirmez votre inscription`,
      text: [
        `Bienvenue sur ${APP_NAME}.`,
        "",
        "Confirmez votre inscription en ouvrant ce lien :",
        confirmUrl,
        "",
        `Si vous n’êtes pas à l’origine de cette demande : ${unsubUrl}`,
      ].join("\n"),
      html: buildConfirmHtml({ confirmUrl, unsubUrl }),
      tags: ["confirmation"],
    });

    await this.repo.createNotification({
      kind: NewsletterNotificationKind.CONFIRMATION,
      status: NewsletterNotificationStatus.SENT,
      subject: `${APP_NAME} — Confirmez votre inscription`,
      recipientCount: 1,
      sentCount: 1,
      failedCount: 0,
      completedAt: new Date(),
    });
  }
}

function buildConfirmHtml(input: {
  confirmUrl: string;
  unsubUrl: string;
}): string {
  return `<!DOCTYPE html><html lang="fr"><body style="font-family:Helvetica,Arial,sans-serif;color:#0a0a0a;background:#f3f2ee;padding:32px;">
  <p style="letter-spacing:0.14em;text-transform:uppercase;font-size:12px;color:#7d6523;">${APP_NAME}</p>
  <h1 style="font-size:28px;letter-spacing:-0.02em;">Confirmez votre inscription</h1>
  <p>Un clic suffit pour recevoir la méditation du jour.</p>
  <p><a href="${input.confirmUrl}" style="color:#0a0a0a;font-weight:600;">Confirmer mon email</a></p>
  <p style="font-size:12px;color:#6f6d67;margin-top:32px;"><a href="${input.unsubUrl}" style="color:#6f6d67;">Se désinscrire</a></p>
</body></html>`;
}

function buildPublicationHtml(input: {
  title: string;
  excerpt: string;
  readUrl: string;
  unsubUrl: string;
}): string {
  return `<!DOCTYPE html><html lang="fr"><body style="font-family:Helvetica,Arial,sans-serif;color:#0a0a0a;background:#f3f2ee;padding:32px;">
  <p style="letter-spacing:0.14em;text-transform:uppercase;font-size:12px;color:#7d6523;">Méditation du jour</p>
  <h1 style="font-size:28px;letter-spacing:-0.02em;">${escapeHtml(input.title)}</h1>
  <p style="font-size:18px;line-height:1.5;color:#3a3834;">${escapeHtml(input.excerpt)}</p>
  <p><a href="${input.readUrl}" style="color:#0a0a0a;font-weight:600;">Lire la méditation</a></p>
  <p style="font-size:12px;color:#6f6d67;margin-top:32px;"><a href="${input.unsubUrl}" style="color:#6f6d67;">Se désinscrire</a></p>
</body></html>`;
}

function escapeHtml(value: string): string {
  return value
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;");
}

export function createNewsletterService(): NewsletterService {
  return new NewsletterService();
}
