import {
  MeditationStatus,
  type DailyMeditation,
} from "@/domain/meditation";
import { getMeditationRepository } from "@/lib/db";
import { createNewsletterService } from "@/services/newsletter";

export interface PublishResult {
  meditation: DailyMeditation;
  newsletter?: {
    notificationId: string;
    sent: number;
    failed: number;
  };
}

/**
 * Service publication — mise en ligne + déclenchement newsletter.
 */
export class PublicationService {
  constructor(
    private readonly meditations = getMeditationRepository(),
    private readonly newsletter = createNewsletterService(),
  ) {}

  /**
   * Publie une méditation (statut PUBLISHED) et notifie les abonnés actifs.
   * En mock : la mise à jour statut est simulée si le repo le permet ;
   * la notification email passe toujours par EmailService.
   */
  async publish(
    meditationId: string,
    options: { notifySubscribers?: boolean } = {},
  ): Promise<PublishResult> {
    const notify = options.notifySubscribers !== false;
    const meditation = await this.meditations.findById(meditationId);
    if (!meditation) {
      throw new Error(`Méditation introuvable : ${meditationId}`);
    }

    // Statut logique de publication (persistance Prisma plus tard).
    const published: DailyMeditation = {
      ...meditation,
      status: MeditationStatus.PUBLISHED,
      updatedAt: new Date(),
    };

    let newsletter: PublishResult["newsletter"];
    if (notify) {
      newsletter = await this.newsletter.notifyPublication(published);
    }

    return { meditation: published, newsletter };
  }

  /** Notifie sans republier — utile pour un envoi manuel depuis l’admin. */
  async notifyMeditationPublished(
    meditation: DailyMeditation,
  ): Promise<PublishResult["newsletter"]> {
    return this.newsletter.notifyPublication(meditation);
  }
}

export function createPublicationService(): PublicationService {
  return new PublicationService();
}
