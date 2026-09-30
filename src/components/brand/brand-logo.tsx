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
  mark = false,
}: {
  className?: string;
  priority?: boolean;
  /** true quand le parent (lien) porte déjà le nom accessible. */
  decorative?: boolean;
  /** Emblème seul (étoile + M), pour la barre d’en-tête. */
  mark?: boolean;
}) {
  return (
    <Image
      src={mark ? "/logo-mark.png" : "/logo.png"}
      alt={decorative ? "" : BRAND_LOGO_ALT}
      width={mark ? 572 : 1254}
      height={mark ? 420 : 1254}
      priority={priority}
      className={cn("object-contain", className)}
    />
  );
}
