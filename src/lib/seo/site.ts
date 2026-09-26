/**
 * Identité et URLs du site — base SEO.
 */

import { APP_DESCRIPTION, APP_NAME, APP_TAGLINE } from "@/constants/app";

const FALLBACK_SITE_URL = "http://localhost:3000";

/** URL absolue du site (sans slash final). */
export function getSiteUrl(): string {
  const raw =
    process.env.NEXT_PUBLIC_APP_URL?.trim() ||
    process.env.VERCEL_PROJECT_PRODUCTION_URL?.trim() ||
    FALLBACK_SITE_URL;
  const withProtocol = raw.startsWith("http") ? raw : `https://${raw}`;
  return withProtocol.replace(/\/$/, "");
}

export function absoluteUrl(path = "/"): string {
  if (path.startsWith("http://") || path.startsWith("https://")) return path;
  const normalized = path.startsWith("/") ? path : `/${path}`;
  return `${getSiteUrl()}${normalized}`;
}

export const SITE = {
  name: APP_NAME,
  tagline: APP_TAGLINE,
  description: APP_DESCRIPTION,
  locale: "fr_FR",
  language: "fr",
} as const;
