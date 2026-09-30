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
    <nav aria-label="Navigation principale" className="ios-ui w-full md:w-auto">
      <ul className="flex gap-0.5 overflow-x-auto rounded-full bg-ms-gold/15 p-1">
        {PUBLIC_NAV.map((item) => {
          const active = isPathActive(pathname, item.href);
          const Icon = iconForHref[item.href];
          return (
            <li key={item.href} className="shrink-0">
              <Link
                href={item.href}
                aria-current={active ? "page" : undefined}
                className={cn(
                  "flex items-center gap-1.5 rounded-full px-2.5 py-1.5 text-[14px] tracking-normal no-underline sm:px-3.5 sm:text-[15px]",
                  "transition-colors duration-200",
                  active
                    ? "bg-ms-gold font-semibold text-ms-black shadow-[0_1px_2px_rgba(26,26,26,0.08)]"
                    : "font-medium text-ms-gray-700 hover:text-ms-black",
                )}
              >
                <Icon aria-hidden="true" className="size-4 shrink-0" strokeWidth={1.75} />
                {item.label}
              </Link>
            </li>
          );
        })}
      </ul>
    </nav>
  );
}
