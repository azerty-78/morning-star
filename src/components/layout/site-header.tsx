import Link from "next/link";
import { BRAND_LOGO_ALT, BrandLogo } from "@/components/brand";
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
    <header className="bg-ms-bg" role="banner">
      <Container className="flex flex-col gap-6 py-4 md:flex-row md:items-center md:justify-between md:py-5">
        <Link
          href={PUBLIC_ROUTES.home}
          aria-label={BRAND_LOGO_ALT}
          className="block w-fit shrink-0 no-underline"
        >
          <BrandLogo priority decorative className="h-32 w-32 sm:h-40 sm:w-40" />
        </Link>
        <Navigation items={navItems} />
      </Container>
      <Separator tone="strong" />
    </header>
  );
}
