import type { MeditationRepository } from "./meditation.repository";

/**
 * Implémentation Prisma — à brancher lorsque PostgreSQL sera disponible.
 * Ne pas importer Prisma Client ici tant que la base n'est pas connectée.
 */
export class PrismaMeditationRepository implements MeditationRepository {
  async findById(): Promise<null> {
    throw new Error(
      "PrismaMeditationRepository n'est pas encore branché. Utilisez DATA_SOURCE=mock.",
    );
  }

  async findBySlug(): Promise<null> {
    throw new Error(
      "PrismaMeditationRepository n'est pas encore branché. Utilisez DATA_SOURCE=mock.",
    );
  }

  async findByPublicationDate(): Promise<null> {
    throw new Error(
      "PrismaMeditationRepository n'est pas encore branché. Utilisez DATA_SOURCE=mock.",
    );
  }

  async findPublished(): Promise<never[]> {
    throw new Error(
      "PrismaMeditationRepository n'est pas encore branché. Utilisez DATA_SOURCE=mock.",
    );
  }

  async search(): Promise<never[]> {
    throw new Error(
      "PrismaMeditationRepository n'est pas encore branché. Utilisez DATA_SOURCE=mock.",
    );
  }
}
