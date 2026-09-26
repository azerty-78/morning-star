import { redirect } from "next/navigation";
import { archiveHref } from "@/lib/archive";
import { parseArchiveSearchParams } from "@/lib/archive";

export const metadata = {
  title: "Recherche",
};

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
