/**
 * Point d'entrée DB futur.
 * Prisma Client ne doit PAS être instancié tant que DATABASE_URL
 * n'est pas configurée et PostgreSQL disponible.
 *
 * Voir ARCHITECTURE.md — stratégie Prisma / PostgreSQL.
 */

export { getMeditationRepository, getUserRepository, getBibleRepository } from "./repositories";
