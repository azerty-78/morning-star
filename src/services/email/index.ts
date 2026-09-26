import type { EmailService } from "./email-service";
import { MockEmailService } from "./mock-email.service";

/**
 * Factory email — EMAIL_PROVIDER=mock (défaut).
 * Plus tard : resend | ses | smtp → implémentations dédiées.
 */
export function getEmailService(): EmailService {
  const provider = (process.env.EMAIL_PROVIDER ?? "mock").toLowerCase();

  switch (provider) {
    case "mock":
      return new MockEmailService();
    // case "resend":
    //   return new ResendEmailService(...)
    default:
      console.warn(
        `[email] Provider « ${provider} » non implémenté — repli MockEmailService.`,
      );
      return new MockEmailService();
  }
}

export type { EmailService, EmailMessage, EmailSendResult } from "./email-service";
export { MockEmailService, readMockEmailOutbox } from "./mock-email.service";
