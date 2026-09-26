import type { AuthSession } from "./session";
import { assertAdminAccess } from "./session";

/**
 * Helpers d'autorisation admin.
 * L'auth réelle (cookies, credentials) sera ajoutée ultérieurement.
 */
export async function getAdminSession(): Promise<AuthSession | null> {
  // Placeholder : aucune session réelle à cette étape.
  return null;
}

export async function requireAdmin(): Promise<
  { ok: true; session: AuthSession } | { ok: false; reason: "unauthenticated" }
> {
  const session = await getAdminSession();
  if (!assertAdminAccess(session)) {
    return { ok: false, reason: "unauthenticated" };
  }
  return { ok: true, session };
}
