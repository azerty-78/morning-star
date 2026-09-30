"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import { usePathname } from "next/navigation";
import { BRAND_LOGO_ALT, BrandLogo } from "@/components/brand";
import {
  ADMIN_NAV,
  ADMIN_ROUTES,
  isPathActive,
  PUBLIC_ROUTES,
} from "@/constants/routes";
import { cn } from "@/lib/utils";

const STORAGE_KEY = "ms-admin-sidebar";

const secondary = [
  { href: ADMIN_ROUTES.import, label: "Import" },
  { href: PUBLIC_ROUTES.home, label: "Voir le site" },
] as const;

type IconName =
  | "dashboard"
  | "meditations"
  | "calendrier"
  | "commentaires"
  | "newsletter"
  | "statistiques"
  | "parametres"
  | "import"
  | "site"
  | "collapse"
  | "expand";

const iconForHref: Record<string, IconName> = {
  [ADMIN_ROUTES.dashboard]: "dashboard",
  [ADMIN_ROUTES.meditations]: "meditations",
  [ADMIN_ROUTES.calendrier]: "calendrier",
  [ADMIN_ROUTES.commentaires]: "commentaires",
  [ADMIN_ROUTES.newsletter]: "newsletter",
  [ADMIN_ROUTES.statistiques]: "statistiques",
  [ADMIN_ROUTES.parametres]: "parametres",
  [ADMIN_ROUTES.import]: "import",
  [PUBLIC_ROUTES.home]: "site",
};

const sectionHint: Record<string, string> = {
  [ADMIN_ROUTES.dashboard]: "Publication, file et audience",
  [ADMIN_ROUTES.meditations]: "Brouillons, programmés, publiés",
  [ADMIN_ROUTES.calendrier]: "Le mois éditorial",
  [ADMIN_ROUTES.commentaires]: "Messages à traiter",
  [ADMIN_ROUTES.newsletter]: "Abonnés et envois",
  [ADMIN_ROUTES.statistiques]: "Lectures et téléchargements",
  [ADMIN_ROUTES.parametres]: "La publication",
  [ADMIN_ROUTES.import]: "Document vers méditation",
};

function sectionMeta(pathname: string): {
  title: string;
  hint: string;
  icon: IconName;
} {
  if (pathname.startsWith(ADMIN_ROUTES.import)) {
    return {
      title: "Import",
      hint: sectionHint[ADMIN_ROUTES.import] ?? "",
      icon: "import",
    };
  }
  const match = ADMIN_NAV.find((item) => isPathActive(pathname, item.href));
  if (!match) {
    return { title: "Administration", hint: "Espace auteur", icon: "dashboard" };
  }
  return {
    title: match.label,
    hint: sectionHint[match.href] ?? "Espace auteur",
    icon: iconForHref[match.href] ?? "dashboard",
  };
}

function NavIcon({ name }: { name: IconName }) {
  const common = {
    width: 20,
    height: 20,
    viewBox: "0 0 24 24",
    fill: "none",
    stroke: "currentColor",
    strokeWidth: 1.75,
    strokeLinecap: "round" as const,
    strokeLinejoin: "round" as const,
    "aria-hidden": true,
    className: "shrink-0",
  };

  return (
    <svg {...common}>
      {name === "dashboard" ? (
        <>
          <rect x="3" y="3" width="7" height="9" rx="1.5" />
          <rect x="14" y="3" width="7" height="5" rx="1.5" />
          <rect x="14" y="12" width="7" height="9" rx="1.5" />
          <rect x="3" y="16" width="7" height="5" rx="1.5" />
        </>
      ) : null}
      {name === "meditations" ? (
        <>
          <path d="M4 5.5A2.5 2.5 0 0 1 6.5 3H20v16H6.5A2.5 2.5 0 0 0 4 21.5z" />
          <path d="M4 5.5A2.5 2.5 0 0 1 6.5 8H20" />
        </>
      ) : null}
      {name === "calendrier" ? (
        <>
          <rect x="3" y="5" width="18" height="16" rx="2" />
          <path d="M3 10h18M8 3v4M16 3v4" />
        </>
      ) : null}
      {name === "commentaires" ? (
        <path d="M5 6h14a2 2 0 0 1 2 2v7a2 2 0 0 1-2 2H9l-4 3v-3H5a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2z" />
      ) : null}
      {name === "newsletter" ? (
        <>
          <rect x="3" y="5" width="18" height="14" rx="2" />
          <path d="m4 7 8 6 8-6" />
        </>
      ) : null}
      {name === "statistiques" ? (
        <path d="M4 19V10M12 19V5M20 19v-7M3 19h18" />
      ) : null}
      {name === "parametres" ? (
        <>
          <path d="M4 7h16M4 12h16M4 17h16" />
          <circle cx="8" cy="7" r="2.25" fill="currentColor" stroke="none" />
          <circle cx="15" cy="12" r="2.25" fill="currentColor" stroke="none" />
          <circle cx="10" cy="17" r="2.25" fill="currentColor" stroke="none" />
        </>
      ) : null}
      {name === "import" ? (
        <>
          <path d="M12 4v10" />
          <path d="m8 10 4 4 4-4" />
          <path d="M5 19h14" />
        </>
      ) : null}
      {name === "site" ? (
        <>
          <path d="M14 5h5v5" />
          <path d="M19 5 10 14" />
          <path d="M17 13v5a1 1 0 0 1-1 1H6a1 1 0 0 1-1-1V8a1 1 0 0 1 1-1h5" />
        </>
      ) : null}
      {name === "collapse" ? <path d="M15 6 9 12l6 6" /> : null}
      {name === "expand" ? <path d="M9 6l6 6-6 6" /> : null}
    </svg>
  );
}

function NavLink({
  href,
  label,
  active,
  collapsed,
}: {
  href: string;
  label: string;
  active: boolean;
  collapsed: boolean;
}) {
  const icon = iconForHref[href] ?? "dashboard";

  return (
    <Link
      href={href}
      aria-current={active ? "page" : undefined}
      aria-label={label}
      title={label}
      className={cn(
        "flex items-center gap-3 rounded-[10px] px-3 py-2 text-[15px] no-underline transition-colors",
        collapsed && "md:justify-center md:px-2",
        active
          ? "bg-ms-gold font-semibold text-ms-black"
          : "font-medium text-ms-black hover:bg-ms-gold/15",
      )}
    >
      <NavIcon name={icon} />
      <span className={cn("truncate", collapsed && "md:hidden")}>{label}</span>
    </Link>
  );
}

/**
 * Coque admin — barre latérale rétractable, icônes, couleurs du logo.
 */
export function AdminShell({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const isLogin = pathname === ADMIN_ROUTES.login;
  const [collapsed, setCollapsed] = useState(false);
  const [ready, setReady] = useState(false);
  const [todayLabel, setTodayLabel] = useState<string | null>(null);

  useEffect(() => {
    setCollapsed(window.localStorage.getItem(STORAGE_KEY) === "collapsed");
    const label = new Intl.DateTimeFormat("fr-FR", {
      weekday: "long",
      day: "numeric",
      month: "long",
    }).format(new Date());
    setTodayLabel(label.charAt(0).toUpperCase() + label.slice(1));
    setReady(true);
  }, []);

  function toggleSidebar() {
    setCollapsed((current) => {
      const next = !current;
      window.localStorage.setItem(STORAGE_KEY, next ? "collapsed" : "expanded");
      return next;
    });
  }

  if (isLogin) {
    return <>{children}</>;
  }

  const section = sectionMeta(pathname);

  return (
    <div className="ios-ui flex min-h-full flex-col bg-ms-cream-deep md:flex-row">
      <aside
        className={cn(
          "shrink-0 border-b border-ms-gold/25 md:sticky md:top-0 md:flex md:h-screen md:flex-col md:overflow-y-auto md:border-b-0 md:border-r md:px-3 md:py-4",
          ready && "md:transition-[width] md:duration-200",
          collapsed ? "md:w-[4.75rem]" : "md:w-[260px]",
        )}
      >
        <div
          className={cn(
            "flex items-center gap-3 px-4 py-3 md:px-2 md:pb-4",
            collapsed && "md:flex-col md:gap-2",
          )}
        >
          <Link
            href={ADMIN_ROUTES.dashboard}
            aria-label={BRAND_LOGO_ALT}
            className="brand-mark brand-mark--sidebar no-underline"
          >
            <BrandLogo decorative mark />
          </Link>
          <div className={cn("min-w-0 flex-1", collapsed && "md:hidden")}>
            <p className="truncate text-[15px] font-semibold leading-tight tracking-tight text-ms-black">
              Morning Star
            </p>
            <p className="mt-0.5 truncate text-[12px] leading-tight text-ms-gold-dark">
              Espace auteur
            </p>
          </div>
          <button
            type="button"
            onClick={toggleSidebar}
            aria-expanded={!collapsed}
            aria-controls="admin-sidebar-nav"
            aria-label={collapsed ? "Étendre le menu" : "Réduire le menu"}
            title={collapsed ? "Étendre le menu" : "Réduire le menu"}
            className="flex h-9 w-9 shrink-0 items-center justify-center rounded-[10px] bg-white text-ms-black shadow-[0_1px_2px_rgba(26,26,26,0.04)] transition-colors hover:bg-ms-gold/15"
          >
            <NavIcon name={collapsed ? "expand" : "collapse"} />
          </button>
        </div>

        <nav id="admin-sidebar-nav" aria-label="Administration" className="px-3 pb-3 md:px-0">
          <ul className="flex gap-1 overflow-x-auto md:flex-col md:gap-0.5 md:overflow-visible md:rounded-2xl md:bg-white md:p-1.5 md:shadow-[0_1px_2px_rgba(26,26,26,0.04)]">
            {ADMIN_NAV.map((item) => (
              <li key={item.href} className="shrink-0 md:shrink">
                <NavLink
                  href={item.href}
                  label={item.label}
                  active={isPathActive(pathname, item.href)}
                  collapsed={collapsed}
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
                  active={isPathActive(pathname, item.href)}
                  collapsed={collapsed}
                />
              </li>
            ))}
          </ul>
        </nav>

      </aside>

      <div className="flex min-w-0 flex-1 flex-col">
        <header className="sticky top-0 z-30 border-b border-ms-gold/30 bg-ms-off-white/90 backdrop-blur-xl">
          <div className="flex h-[4.25rem] items-center justify-between gap-4 px-4 sm:px-6">
            <div className="flex min-w-0 items-center gap-3">
              <span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-2xl bg-ms-gold text-ms-black shadow-[0_1px_2px_rgba(26,26,26,0.08)]">
                <NavIcon name={section.icon} />
              </span>
              <div className="min-w-0">
                <p className="truncate text-[12px] font-medium text-ms-gold-dark">
                  {section.hint}
                </p>
                <h1 className="truncate text-[20px] font-semibold leading-tight tracking-tight text-ms-black">
                  {section.title}
                </h1>
              </div>
            </div>
            <div className="flex shrink-0 items-center gap-3">
              {todayLabel ? (
                <p className="hidden text-[13px] text-ms-gray-600 md:block">
                  {todayLabel}
                </p>
              ) : null}
              <Link
                href={PUBLIC_ROUTES.home}
                className="inline-flex h-9 items-center gap-2 rounded-full bg-ms-black px-3.5 text-[13px] font-medium text-ms-off-white no-underline transition-colors hover:bg-ms-gold hover:text-ms-black"
              >
                <NavIcon name="site" />
                <span className="hidden sm:inline">Voir le site</span>
              </Link>
            </div>
          </div>
        </header>
        <div className="min-w-0 flex-1">{children}</div>
      </div>
    </div>
  );
}
