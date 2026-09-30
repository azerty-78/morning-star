import Link from "next/link";
import { BrandLogo } from "@/components/brand";
import { PUBLIC_ROUTES } from "@/constants/routes";
import { Container, Separator } from "@/components/ui";

export function SiteFooter() {
  const year = new Date().getFullYear();

  return (
    <footer className="mt-auto" role="contentinfo">
      <Separator tone="default" />
      <Container className="flex flex-col gap-4 py-8 md:flex-row md:items-center md:justify-between">
        <div className="flex items-center gap-4">
          <BrandLogo className="h-16 w-16" />
          <p className="text-[length:var(--ms-text-sm)] text-ms-muted">
            Publication éditoriale · méditations quotidiennes · {year}
          </p>
        </div>
        <nav aria-label="Pied de page">
          <ul className="flex flex-wrap gap-x-5 gap-y-2">
            <li>
              <Link
                href={PUBLIC_ROUTES.meditations}
                className="text-[length:var(--ms-text-xs)] uppercase tracking-[var(--ms-tracking-wider)] text-ms-muted no-underline hover:text-ms-fg"
              >
                Méditations
              </Link>
            </li>
            <li>
              <Link
                href={PUBLIC_ROUTES.archive}
                className="text-[length:var(--ms-text-xs)] uppercase tracking-[var(--ms-tracking-wider)] text-ms-muted no-underline hover:text-ms-fg"
              >
                Archive
              </Link>
            </li>
          </ul>
        </nav>
      </Container>
    </footer>
  );
}
