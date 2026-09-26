import type { Metadata } from "next";
import type { DailyMeditation } from "@/domain/meditation";
import { PUBLIC_ROUTES } from "@/constants/routes";
import { absoluteUrl, getSiteUrl, SITE } from "./site";

export function meditationPath(slug: string): string {
  return `${PUBLIC_ROUTES.meditations}/${slug}`;
}

export function meditationCanonical(slug: string): string {
  return absoluteUrl(meditationPath(slug));
}

function truncateDescription(text: string, max = 160): string {
  const clean = text.replace(/\s+/g, " ").trim();
  if (clean.length <= max) return clean;
  return `${clean.slice(0, max - 1).trimEnd()}…`;
}

function toIsoDateTime(publicationDate: string, fallback?: Date): string {
  const base = new Date(`${publicationDate}T08:00:00.000Z`);
  if (!Number.isNaN(base.getTime())) return base.toISOString();
  return (fallback ?? new Date()).toISOString();
}

/**
 * Metadata complète pour une méditation publiée.
 */
export function buildMeditationMetadata(
  meditation: DailyMeditation,
  authorName: string,
): Metadata {
  const title = meditation.title;
  const description = truncateDescription(
    meditation.excerpt || meditation.subtitle || SITE.description,
  );
  const canonical = meditationCanonical(meditation.slug);
  const publishedTime = toIsoDateTime(
    meditation.publicationDate,
    meditation.createdAt,
  );
  const modifiedTime = meditation.updatedAt.toISOString();
  const ogImage = absoluteUrl(
    `${meditationPath(meditation.slug)}/opengraph-image`,
  );

  return {
    title,
    description,
    authors: [{ name: authorName }],
    creator: authorName,
    publisher: SITE.name,
    category: "Religion",
    keywords: [
      "méditation",
      "chrétien",
      "Bible",
      SITE.name,
      ...(meditation.themes ?? []),
    ],
    alternates: {
      canonical,
    },
    openGraph: {
      type: "article",
      locale: SITE.locale,
      url: canonical,
      siteName: SITE.name,
      title,
      description,
      publishedTime,
      modifiedTime,
      authors: [authorName],
      tags: meditation.themes,
      images: [
        {
          url: ogImage,
          width: 1200,
          height: 630,
          alt: title,
        },
      ],
    },
    twitter: {
      card: "summary_large_image",
      title,
      description,
      images: [ogImage],
    },
    robots: {
      index: true,
      follow: true,
    },
    other: {
      "article:published_time": publishedTime,
      "article:modified_time": modifiedTime,
      "article:author": authorName,
    },
  };
}

export function buildPublicPageMetadata(input: {
  title: string;
  description: string;
  path: string;
  noIndex?: boolean;
}): Metadata {
  const url = absoluteUrl(input.path);
  return {
    title: input.title,
    description: input.description,
    alternates: { canonical: url },
    openGraph: {
      type: "website",
      locale: SITE.locale,
      url,
      siteName: SITE.name,
      title: `${input.title} · ${SITE.name}`,
      description: input.description,
    },
    twitter: {
      card: "summary_large_image",
      title: `${input.title} · ${SITE.name}`,
      description: input.description,
    },
    robots: input.noIndex
      ? { index: false, follow: false }
      : { index: true, follow: true },
  };
}

export function buildRootMetadata(): Metadata {
  const url = getSiteUrl();
  return {
    metadataBase: new URL(url),
    title: {
      default: `${SITE.name} · ${SITE.tagline}`,
      template: `%s · ${SITE.name}`,
    },
    description: SITE.description,
    applicationName: SITE.name,
    authors: [{ name: SITE.name }],
    creator: SITE.name,
    publisher: SITE.name,
    formatDetection: {
      email: false,
      address: false,
      telephone: false,
    },
    alternates: {
      canonical: url,
    },
    openGraph: {
      type: "website",
      locale: SITE.locale,
      url,
      siteName: SITE.name,
      title: `${SITE.name} · ${SITE.tagline}`,
      description: SITE.description,
    },
    twitter: {
      card: "summary_large_image",
      title: `${SITE.name} · ${SITE.tagline}`,
      description: SITE.description,
    },
    robots: {
      index: true,
      follow: true,
      googleBot: {
        index: true,
        follow: true,
        "max-image-preview": "large",
        "max-snippet": -1,
        "max-video-preview": -1,
      },
    },
  };
}
