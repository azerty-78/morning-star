/**
 * Fondations sécurité — conventions et emplacements.
 * Implémentations métier à venir (upload, rate limit, audit).
 */

/** Caractères / motifs à surveiller lors d'une sanitation HTML future. */
export const UNSAFE_HTML_PATTERN = /<script|javascript:|on\w+=/i;

export function containsUnsafeHtml(value: string): boolean {
  return UNSAFE_HTML_PATTERN.test(value);
}

/**
 * Rate limiting — stub. Brancher Redis / edge plus tard.
 */
export interface RateLimitResult {
  allowed: boolean;
  remaining: number;
}

export function checkRateLimitStub(): RateLimitResult {
  return { allowed: true, remaining: Infinity };
}
