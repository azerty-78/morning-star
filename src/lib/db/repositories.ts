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

/**
 * Composition root — sélectionne mock ou Prisma selon DATA_SOURCE.
 * Les pages et services dépendent des interfaces, jamais de Prisma directement.
 */
function useMock(): boolean {
  return isMockDataSource(process.env.DATA_SOURCE);
}

export function getMeditationRepository(): MeditationRepository {
  if (useMock()) return new MockMeditationRepository();
  return new PrismaMeditationRepository();
}

export function getUserRepository(): UserRepository {
  // Prisma user repo à ajouter lors du branchement DB
  return new MockUserRepository();
}

export function getBibleRepository(): BibleRepository {
  return new MockBibleRepository();
}
