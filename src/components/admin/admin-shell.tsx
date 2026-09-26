"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { APP_NAME } from "@/constants/app";
import { ADMIN_NAV, ADMIN_ROUTES, PUBLIC_ROUTES } from "@/constants/routes";
import { cn } from "@/lib/utils";

/**
 * Coque admin — navigation verticale dense, style Swiss.
 * Pas de cartes colorées ; filets, typo uppercase, asymétrie.
 */
export function AdminShell({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const isLogin = pathname === ADMIN_ROUTES.login;

  if (isLogin) {
    return <>{children}</>;
  }

  return (
    <div className="flex min-h-full flex-col bg-ms-off-white md:flex-row">
      <aside className="shrink-0 border-b border-ms-black md:w-56 md:border-b-0 md:border-r">
        <div className="sticky top-0 flex flex-col gap-8 px-5 py-6 md:min-h-screen">
          <div>
            <p className="text-[length:var(--ms-text-2xs)] font-medium uppercase tracking-[var(--ms-tracking-widest)] text-ms-muted">
              Espace auteur
            </p>
            <Link
              href={ADMIN_ROUTES.dashboard}
              className="mt-1 block text-lg font-semibold tracking-tight text-ms-fg no-underline"
            >
              {APP_NAME}
            </Link>
          </div>

          <nav aria-label="Administration">
            <ul className="flex flex-row flex-wrap gap-x-5 gap-y-2 md:flex-col md:gap-y-3">
              {ADMIN_NAV.map((item) => {
                const active =
                  pathname === item.href ||
                  pathname.startsWith(`${item.href}/`);
                return (
                  <li key={item.href}>
                    <Link
                      href={item.href}
                      aria-current={active ? "page" : undefined}
                      className={cn(
                        "block text-[length:var(--ms-text-xs)] font-medium uppercase tracking-[var(--ms-tracking-wider)] no-underline",
                        "border-b border-transparent pb-0.5",
                        active
                          ? "border-ms-gold text-ms-fg"
                          : "text-ms-gray-700 hover:border-ms-black hover:text-ms-fg",
                      )}
                    >
                      {item.label}
                    </Link>
                  </li>
                );
              })}
            </ul>
          </nav>

          <div className="mt-auto flex flex-row flex-wrap gap-x-5 gap-y-2 border-t border-ms-border pt-5 md:flex-col">
            <Link
              href={ADMIN_ROUTES.import}
              className={cn(
                "text-[length:var(--ms-text-xs)] uppercase tracking-[var(--ms-tracking-wider)] no-underline",
                pathname.startsWith(ADMIN_ROUTES.import)
                  ? "text-ms-fg"
                  : "text-ms-muted hover:text-ms-fg",
              )}
            >
              Import
            </Link>
            <Link
              href={PUBLIC_ROUTES.home}
              className="text-[length:var(--ms-text-xs)] uppercase tracking-[var(--ms-tracking-wider)] text-ms-muted no-underline hover:text-ms-fg"
            >
              Voir le site
            </Link>
          </div>
        </div>
      </aside>

      <div className="min-w-0 flex-1">{children}</div>
    </div>
  );
}
