import type { NewsletterRepository } from "./newsletter.repository";

const NOT_WIRED =
  "PrismaNewsletterRepository n'est pas encore branché. Utilisez DATA_SOURCE=mock.";

export class PrismaNewsletterRepository implements NewsletterRepository {
  async findByEmail(): Promise<null> {
    throw new Error(NOT_WIRED);
  }
  async findByConfirmToken(): Promise<null> {
    throw new Error(NOT_WIRED);
  }
  async findByUnsubscribeToken(): Promise<null> {
    throw new Error(NOT_WIRED);
  }
  async create(): Promise<never> {
    throw new Error(NOT_WIRED);
  }
  async update(): Promise<null> {
    throw new Error(NOT_WIRED);
  }
  async listActive(): Promise<never[]> {
    throw new Error(NOT_WIRED);
  }
  async getCounts(): Promise<never> {
    throw new Error(NOT_WIRED);
  }
  async listRecent(): Promise<never[]> {
    throw new Error(NOT_WIRED);
  }
  async addEvent(): Promise<never> {
    throw new Error(NOT_WIRED);
  }
  async createNotification(): Promise<never> {
    throw new Error(NOT_WIRED);
  }
  async updateNotification(): Promise<null> {
    throw new Error(NOT_WIRED);
  }
  async listNotifications(): Promise<never[]> {
    throw new Error(NOT_WIRED);
  }
}
