import Link from "next/link";
import { BRAND_LOGO_ALT, BrandLogo } from "@/components/brand";
import { PUBLIC_ROUTES } from "@/constants/routes";
import { Container } from "@/components/ui";
import { PublicNav } from "./public-nav";

export function SiteHeader() {
  return (
    <header
      role="banner"
      className="ios-ui sticky top-0 z-40 border-b border-ms-gold/25 bg-ms-off-white/80 pt-[env(safe-area-inset-top)] backdrop-blur-xl"
    >
      <Container className="flex items-center justify-between gap-3 py-2.5">
        <Link
          href={PUBLIC_ROUTES.home}
          aria-label={BRAND_LOGO_ALT}
          className="brand-mark brand-mark--header no-underline"
        >
          <BrandLogo priority decorative mark />
        </Link>
        <PublicNav />
      </Container>
    </header>
  );
}
