/**
 * Abstraction envoi email — aucun fournisseur couplé.
 * Implémentations : MockEmailService (dev), puis Resend/SES/etc.
 */

export interface EmailAddress {
  email: string;
  name?: string;
}

export interface EmailMessage {
  to: EmailAddress | string;
  subject: string;
  text: string;
  html?: string;
  from?: EmailAddress | string;
  replyTo?: string;
  headers?: Record<string, string>;
  /** Tags libres pour le provider / logs. */
  tags?: string[];
}

export interface EmailSendResult {
  ok: boolean;
  messageId?: string;
  error?: string;
}

export interface EmailService {
  readonly provider: string;
  send(message: EmailMessage): Promise<EmailSendResult>;
  sendBatch(messages: EmailMessage[]): Promise<EmailSendResult[]>;
}

export function resolveEmailAddress(
  value: EmailAddress | string,
): EmailAddress {
  if (typeof value === "string") return { email: value };
  return value;
}
