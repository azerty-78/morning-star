import { UserRole, type User } from "@/domain/user";

/**
 * Session future — placeholder typé pour l'auth réelle.
 * Ne constitue PAS une authentification fonctionnelle.
 */
export interface AuthSession {
  user: User;
  expiresAt: Date;
}

export function isAdmin(user: User | null | undefined): boolean {
  return user?.role === UserRole.ADMIN;
}

/**
 * Guard structurel — à brancher sur la vraie session plus tard.
 * Retourne false tant qu'aucune session réelle n'existe.
 */
export function assertAdminAccess(session: AuthSession | null): boolean {
  return Boolean(session && isAdmin(session.user));
}
