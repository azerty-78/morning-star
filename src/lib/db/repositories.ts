import { isMockDataSource } from "@/lib/mock";
import {
  MockMeditationRepository,
  PrismaMeditationRepository,
  type MeditationRepository,
} from "@/repositories/meditation";
import {
  MockUserRepository,
  type UserRepository,
} from "@/repositories/user";
import {
  MockBibleRepository,
  type BibleRepository,
} from "@/repositories/bible";
import {
  MockNewsletterRepository,
  PrismaNewsletterRepository,
  type NewsletterRepository,
} from "@/repositories/newsletter";
import {
  MockAnalyticsRepository,
  PrismaAnalyticsRepository,
  type AnalyticsRepository,
} from "@/repositories/analytics";

/**
 * Composition root — sélectionne mock ou Prisma selon DATA_SOURCE.
 * Les pages et services dépendent des interfaces, jamais de Prisma directement.
 */
function isMockMode(): boolean {
  return isMockDataSource(process.env.DATA_SOURCE);
}

export function getMeditationRepository(): MeditationRepository {
  if (isMockMode()) return new MockMeditationRepository();
  return new PrismaMeditationRepository();
}

export function getUserRepository(): UserRepository {
  // Prisma user repo à ajouter lors du branchement DB
  return new MockUserRepository();
}

export function getBibleRepository(): BibleRepository {
  return new MockBibleRepository();
}

export function getNewsletterRepository(): NewsletterRepository {
  if (isMockMode()) return new MockNewsletterRepository();
  return new PrismaNewsletterRepository();
}

export function getAnalyticsRepository(): AnalyticsRepository {
  if (isMockMode()) return new MockAnalyticsRepository();
  return new PrismaAnalyticsRepository();
}
