"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { BRAND_LOGO_ALT, BrandLogo } from "@/components/brand";
import { ADMIN_NAV, ADMIN_ROUTES, PUBLIC_ROUTES } from "@/constants/routes";
import { cn } from "@/lib/utils";

const secondary = [
  { href: ADMIN_ROUTES.import, label: "Import" },
  { href: PUBLIC_ROUTES.home, label: "Voir le site" },
] as const;

function sectionTitle(pathname: string): string {
  if (pathname.startsWith(ADMIN_ROUTES.import)) return "Import";
  const match = ADMIN_NAV.find(
    (item) => pathname === item.href || pathname.startsWith(`${item.href}/`),
  );
  return match?.label ?? "Administration";
}

function isCurrent(pathname: string, href: string): boolean {
  return pathname === href || pathname.startsWith(`${href}/`);
}

function NavLink({
  href,
  label,
  active,
}: {
  href: string;
  label: string;
  active: boolean;
}) {
  return (
    <Link
      href={href}
      aria-current={active ? "page" : undefined}
      className={cn(
        "block rounded-[10px] px-3 py-2 text-[15px] no-underline transition-colors",
        active
          ? "bg-ms-gold font-semibold text-ms-black"
          : "font-medium text-ms-black hover:bg-ms-gold/15",
      )}
    >
      {label}
    </Link>
  );
}

/**
 * Coque admin — barre de titre et barre latérale façon iOS.
 */
export function AdminShell({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const isLogin = pathname === ADMIN_ROUTES.login;

  if (isLogin) {
    return <>{children}</>;
  }

  const title = sectionTitle(pathname);

  return (
    <div className="ios-ui flex min-h-full flex-col bg-ms-cream-deep md:flex-row">
      <aside className="shrink-0 border-b border-black/10 md:sticky md:top-0 md:h-screen md:w-[260px] md:overflow-y-auto md:border-b-0 md:border-r md:px-3 md:py-4">
        <div className="flex items-center gap-3 px-4 py-3 md:px-2 md:pb-4">
          <Link
            href={ADMIN_ROUTES.dashboard}
            aria-label={BRAND_LOGO_ALT}
            className="brand-mark no-underline"
          >
            <BrandLogo decorative />
          </Link>
          <div className="min-w-0">
            <p className="truncate text-[17px] font-semibold tracking-tight text-ms-black">
              Morning Star
            </p>
            <p className="text-[13px] text-ms-gold-dark">Espace auteur</p>
          </div>
        </div>

        <nav aria-label="Administration" className="px-3 pb-3 md:px-0">
          <ul className="flex gap-1 overflow-x-auto md:flex-col md:gap-0.5 md:overflow-visible md:rounded-2xl md:bg-white md:p-1.5 md:shadow-[0_1px_2px_rgba(0,0,0,0.04)]">
            {ADMIN_NAV.map((item) => (
              <li key={item.href} className="shrink-0 md:shrink">
                <NavLink
                  href={item.href}
                  label={item.label}
                  active={isCurrent(pathname, item.href)}
                />
              </li>
            ))}
          </ul>
        </nav>

        <nav aria-label="Liens secondaires" className="px-3 pb-4 md:mt-3 md:px-0">
          <ul className="flex gap-1 md:flex-col md:gap-0.5 md:rounded-2xl md:bg-white md:p-1.5">
            {secondary.map((item) => (
              <li key={item.href}>
                <NavLink
                  href={item.href}
                  label={item.label}
                  active={isCurrent(pathname, item.href)}
                />
              </li>
            ))}
          </ul>
        </nav>
      </aside>

      <div className="flex min-w-0 flex-1 flex-col">
        <header className="sticky top-0 z-30 flex h-14 items-center border-b border-ms-gold/25 bg-ms-cream-deep/80 px-5 backdrop-blur-xl">
          <h1 className="text-[17px] font-semibold tracking-tight text-ms-black">
            {title}
          </h1>
        </header>
        <div className="min-w-0 flex-1">{children}</div>
      </div>
    </div>
  );
}
