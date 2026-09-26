import type { Metadata } from "next";
import { redirect } from "next/navigation";
import { archiveHref, parseArchiveSearchParams } from "@/lib/archive";
import { PUBLIC_ROUTES } from "@/constants/routes";
import { buildPublicPageMetadata } from "@/lib/seo";

export const metadata: Metadata = buildPublicPageMetadata({
  title: "Recherche",
  description: "Rechercher une méditation Morning Star.",
  path: PUBLIC_ROUTES.recherche,
});

interface PageProps {
  searchParams: Promise<Record<string, string | string[] | undefined>>;
}

/**
 * La recherche publique est unifiée dans /archive.
 * On conserve /recherche comme point d'entrée (redirection).
 */
export default async function RecherchePage({ searchParams }: PageProps) {
  const params = await searchParams;
  const query = parseArchiveSearchParams(params);
  redirect(archiveHref(query));
}
