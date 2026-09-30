"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { Archive, BookOpen, Info, Sun } from "lucide-react";
import { isPathActive, PUBLIC_NAV, PUBLIC_ROUTES } from "@/constants/routes";
import { cn } from "@/lib/utils";

const iconForHref = {
  [PUBLIC_ROUTES.home]: Sun,
  [PUBLIC_ROUTES.meditations]: BookOpen,
  [PUBLIC_ROUTES.archive]: Archive,
  [PUBLIC_ROUTES.about]: Info,
} as const;

export function PublicNav() {
  const pathname = usePathname();

  return (
    <nav
      aria-label="Navigation principale"
      className="ios-ui fixed inset-x-0 bottom-0 z-40 border-t border-ms-gold/25 bg-ms-off-white/95 pb-[env(safe-area-inset-bottom)] backdrop-blur-xl md:static md:inset-auto md:z-auto md:w-auto md:border-0 md:bg-transparent md:pb-0 md:backdrop-blur-none"
    >
      <ul className="flex justify-around gap-0.5 px-1 py-1 md:justify-start md:rounded-full md:bg-ms-gold/15 md:p-1">
        {PUBLIC_NAV.map((item) => {
          const active = isPathActive(pathname, item.href);
          const Icon = iconForHref[item.href];
          return (
            <li key={item.href} className="min-w-0 flex-1 md:flex-none">
              <Link
                href={item.href}
                aria-current={active ? "page" : undefined}
                className={cn(
                  "flex flex-col items-center gap-0.5 rounded-2xl px-1 py-1.5 text-center text-[11px] leading-tight tracking-normal no-underline",
                  "md:flex-row md:gap-1.5 md:rounded-full md:px-3.5 md:py-1.5 md:text-[15px]",
                  "transition-colors duration-200",
                  active
                    ? "bg-ms-gold font-semibold text-ms-black shadow-[0_1px_2px_rgba(26,26,26,0.08)]"
                    : "font-medium text-ms-gray-700 hover:text-ms-black",
                )}
              >
                <Icon aria-hidden="true" className="size-4 shrink-0" strokeWidth={1.75} />
                <span className="max-w-full truncate">{item.label}</span>
              </Link>
            </li>
          );
        })}
      </ul>
    </nav>
  );
}
