/**
 * Politique analytics — dédoublonnage et privacy.
 * Pas de collecte d’IP, email, nom, User-Agent brut.
 */

/** Ignore les refreshs rapides (même session + même article). */
export const PAGE_VIEW_DEBOUNCE_MS = 30_000;

/** Debounce téléchargements (double-clic). */
export const DOWNLOAD_DEBOUNCE_MS = 5_000;

/** Cookie session anonyme (1ère partie). */
export const SESSION_COOKIE_NAME = "ms_aid";

/** Durée cookie session (400 jours max navigateurs modernes ~). */
export const SESSION_COOKIE_MAX_AGE = 60 * 60 * 24 * 365;

export const ANALYTICS_NOTES = [
  "Page view : un hit après debounce (30 s) par session et méditation.",
  "Session / visiteur approximatif : nombre de sessionKey distincts — pas d’identité réelle.",
  "Aucun stockage d’adresse IP ni d’email dans ArticleView.",
  "Referrer : hostname uniquement, sans paramètres d’URL.",
] as const;

export function isValidSessionKey(value: string): boolean {
  if (!value || value.length < 8 || value.length > 128) return false;
  // Opaque alphanum / tirets — refuse emails et espaces.
  if (value.includes("@") || /\s/.test(value)) return false;
  return /^[a-zA-Z0-9_-]+$/.test(value);
}

export function createSessionKey(): string {
  const rand =
    typeof crypto !== "undefined" && "randomUUID" in crypto
      ? crypto.randomUUID().replace(/-/g, "")
      : `${Date.now().toString(36)}${Math.random().toString(36).slice(2)}${Math.random().toString(36).slice(2)}`;
  return `ms_${rand.slice(0, 32)}`;
}

/** Extrait le host d’un referrer éventuel — jamais la query. */
export function extractReferrerHost(referrer: string | null | undefined): string | undefined {
  if (!referrer?.trim()) return undefined;
  try {
    const url = new URL(referrer);
    return url.hostname.slice(0, 120) || undefined;
  } catch {
    return undefined;
  }
}

export function inferDeviceClass(
  userAgent: string | null | undefined,
): "UNKNOWN" | "DESKTOP" | "MOBILE" {
  if (!userAgent) return "UNKNOWN";
  const ua = userAgent.toLowerCase();
  if (/mobile|android|iphone|ipad|ipod/.test(ua)) return "MOBILE";
  if (/mozilla|chrome|safari|firefox|edge/.test(ua)) return "DESKTOP";
  return "UNKNOWN";
}
