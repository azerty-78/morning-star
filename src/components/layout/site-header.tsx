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
    <header className="border-b border-ms-border bg-ms-bg">
      <Container className="flex flex-col gap-6 py-5 md:flex-row md:items-end md:justify-between md:py-6">
        <div>
          <Link
            href={PUBLIC_ROUTES.home}
            className="no-underline"
          >
            <span className="block text-2xl font-semibold tracking-tight text-ms-fg md:text-3xl">
              {APP_NAME}
            </span>
          </Link>
          <p className="mt-1 text-xs uppercase tracking-[0.14em] text-ms-muted">
            {APP_TAGLINE}
          </p>
        </div>
        <Navigation items={navItems} />
      </Container>
      <Separator className="border-ms-black" />
    </header>
  );
}
