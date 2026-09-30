import type { DailyMeditation } from "@/domain/meditation";
import { absoluteUrl, SITE } from "./site";
import { meditationCanonical, meditationPath } from "./metadata";

type JsonLd = Record<string, unknown>;

export function websiteJsonLd(): JsonLd {
  return {
    "@context": "https://schema.org",
    "@type": "WebSite",
    name: SITE.name,
    description: SITE.description,
    url: absoluteUrl("/"),
    inLanguage: SITE.language,
    image: absoluteUrl(SITE.logoPath),
    publisher: {
      "@type": "Organization",
      name: SITE.name,
      logo: logoObject(),
    },
    potentialAction: {
      "@type": "SearchAction",
      target: {
        "@type": "EntryPoint",
        urlTemplate: `${absoluteUrl("/archive")}?q={search_term_string}`,
      },
      "query-input": "required name=search_term_string",
    },
  };
}

function logoObject(): JsonLd {
  return {
    "@type": "ImageObject",
    url: absoluteUrl(SITE.logoPath),
    width: SITE.logoSize,
    height: SITE.logoSize,
    caption: SITE.name,
  };
}

export function organizationJsonLd(): JsonLd {
  return {
    "@context": "https://schema.org",
    "@type": "Organization",
    name: SITE.name,
    url: absoluteUrl("/"),
    description: SITE.description,
    logo: logoObject(),
    image: absoluteUrl(SITE.logoPath),
  };
}

/**
 * Article schema.org — adapté aux méditations quotidiennes.
 */
export function meditationArticleJsonLd(
  meditation: DailyMeditation,
  authorName: string,
): JsonLd {
  const url = meditationCanonical(meditation.slug);
  const published = `${meditation.publicationDate}T08:00:00.000Z`;

  return {
    "@context": "https://schema.org",
    "@type": "Article",
    "@id": `${url}#article`,
    headline: meditation.title,
    description: meditation.excerpt,
    alternativeHeadline: meditation.subtitle,
    inLanguage: SITE.language,
    datePublished: published,
    dateModified: meditation.updatedAt.toISOString(),
    url,
    mainEntityOfPage: {
      "@type": "WebPage",
      "@id": url,
    },
    author: {
      "@type": "Person",
      name: authorName,
    },
    publisher: {
      "@type": "Organization",
      name: SITE.name,
      url: absoluteUrl("/"),
      logo: logoObject(),
    },
    articleSection: "Méditation",
    keywords: (meditation.themes ?? []).join(", "),
    wordCount: meditation.body.split(/\s+/).filter(Boolean).length,
    isAccessibleForFree: true,
    image: absoluteUrl(`${meditationPath(meditation.slug)}/opengraph-image`),
  };
}

export function breadcrumbJsonLd(
  items: Array<{ name: string; path: string }>,
): JsonLd {
  return {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    itemListElement: items.map((item, index) => ({
      "@type": "ListItem",
      position: index + 1,
      name: item.name,
      item: absoluteUrl(item.path),
    })),
  };
}
