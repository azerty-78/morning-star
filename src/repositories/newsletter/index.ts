import type { NewsletterSubscriber } from "@/domain/newsletter";

export interface NewsletterRepository {
  findByEmail(email: string): Promise<NewsletterSubscriber | null>;
}

/** Stub mock minimal — newsletter métier plus tard. */
export class MockNewsletterRepository implements NewsletterRepository {
  async findByEmail(): Promise<NewsletterSubscriber | null> {
    return null;
  }
}
