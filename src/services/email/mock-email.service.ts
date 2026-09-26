import { mkdirSync, appendFileSync, existsSync, readFileSync } from "node:fs";
import path from "node:path";
import type {
  EmailMessage,
  EmailSendResult,
  EmailService,
} from "./email-service";
import { resolveEmailAddress } from "./email-service";

const LOG_DIR = path.join(process.cwd(), ".data", "email");
const LOG_FILE = path.join(LOG_DIR, "mock-outbox.jsonl");

function ensureLog(): void {
  if (!existsSync(LOG_DIR)) {
    mkdirSync(LOG_DIR, { recursive: true });
  }
}

/**
 * MockEmailService — enregistre les envois localement, aucun réseau.
 * Remplaçable par un provider réel via getEmailService().
 */
export class MockEmailService implements EmailService {
  readonly provider = "mock";

  async send(message: EmailMessage): Promise<EmailSendResult> {
    const messageId = `mock_${Date.now()}_${Math.random().toString(36).slice(2, 9)}`;
    const to = resolveEmailAddress(message.to);

    const record = {
      messageId,
      provider: this.provider,
      at: new Date().toISOString(),
      to: to.email,
      subject: message.subject,
      text: message.text,
      html: message.html ?? null,
      tags: message.tags ?? [],
      headers: message.headers ?? {},
    };

    try {
      ensureLog();
      appendFileSync(LOG_FILE, `${JSON.stringify(record)}\n`, "utf8");
    } catch {
      // Persistance optionnelle — l’envoi mock reste OK.
    }

    if (process.env.NODE_ENV !== "production") {
      console.info(
        `[MockEmailService] → ${to.email} | ${message.subject} (${messageId})`,
      );
    }

    return { ok: true, messageId };
  }

  async sendBatch(messages: EmailMessage[]): Promise<EmailSendResult[]> {
    const results: EmailSendResult[] = [];
    for (const message of messages) {
      results.push(await this.send(message));
    }
    return results;
  }
}

/** Lecture debug de la outbox mock (admin / scripts). */
export function readMockEmailOutbox(limit = 50): unknown[] {
  if (!existsSync(LOG_FILE)) return [];
  try {
    const lines = readFileSync(LOG_FILE, "utf8")
      .split("\n")
      .filter(Boolean);
    return lines
      .slice(-limit)
      .map((line) => {
        try {
          return JSON.parse(line);
        } catch {
          return null;
        }
      })
      .filter(Boolean)
      .reverse();
  } catch {
    return [];
  }
}
