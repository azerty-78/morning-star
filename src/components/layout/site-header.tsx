import Link from "next/link";
import { APP_NAME, APP_TAGLINE } from "@/constants/app";
import { PUBLIC_ROUTES } from "@/constants/routes";
import { Container, Navigation, Separator } from "@/components/ui";

const navItems = [
  { href: PUBLIC_ROUTES.home, label: "Aujourd'hui" },
  { href: PUBLIC_ROUTES.meditations, label: "Méditations" },
  { href: PUBLIC_ROUTES.archive, label: "Archive" },
  { href: PUBLIC_ROUTES.recherche, label: "Recherche" },
];

export function SiteHeader() {
  return (
    <header className="bg-ms-bg">
      <Container className="flex flex-col gap-6 py-5 md:flex-row md:items-end md:justify-between md:py-6">
        <div className="min-w-0">
          <Link href={PUBLIC_ROUTES.home} className="no-underline block">
            <span className="block text-[length:var(--ms-text-2xl)] font-bold tracking-[var(--ms-tracking-tight)] text-ms-fg md:text-[length:var(--ms-text-3xl)]">
              {APP_NAME}
            </span>
          </Link>
          <p className="mt-1 text-[length:var(--ms-text-2xs)] uppercase tracking-[var(--ms-tracking-widest)] text-ms-muted">
            {APP_TAGLINE}
          </p>
        </div>
        <Navigation items={navItems} />
      </Container>
      <Separator tone="strong" />
    </header>
  );
}
