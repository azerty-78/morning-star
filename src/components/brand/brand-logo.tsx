import Image from "next/image";
import { APP_NAME, APP_TAGLINE } from "@/constants/app";
import { cn } from "@/lib/utils";

export const BRAND_LOGO_ALT = `${APP_NAME} — ${APP_TAGLINE}`;

/**
 * Logo officiel (public/logo.png) — en-tête, pied, admin, login.
 */
export function BrandLogo({
  className,
  priority = false,
  decorative = false,
}: {
  className?: string;
  priority?: boolean;
  /** true quand le parent (lien) porte déjà le nom accessible. */
  decorative?: boolean;
}) {
  return (
    <Image
      src="/logo.png"
      alt={decorative ? "" : BRAND_LOGO_ALT}
      width={1254}
      height={1254}
      priority={priority}
      className={cn("h-auto w-auto object-contain", className)}
    />
  );
}
