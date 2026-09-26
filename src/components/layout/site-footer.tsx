import Link from "next/link";
import { APP_NAME } from "@/constants/app";
import { PUBLIC_ROUTES } from "@/constants/routes";
import { Container, Separator } from "@/components/ui";

export function SiteFooter() {
  const year = new Date().getFullYear();

  return (
    <footer className="mt-auto" role="contentinfo">
      <Separator tone="default" />
      <Container className="flex flex-col gap-4 py-8 md:flex-row md:items-center md:justify-between">
        <div>
          <p className="text-[length:var(--ms-text-2xs)] uppercase tracking-[var(--ms-tracking-widest)] text-ms-muted">
            {APP_NAME}
          </p>
          <p className="mt-1 text-[length:var(--ms-text-sm)] text-ms-muted">
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
