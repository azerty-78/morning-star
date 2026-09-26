import Link from "next/link";
import { cn } from "@/lib/utils";

export interface NavItem {
  href: string;
  label: string;
}

export interface NavigationProps {
  items: NavItem[];
  className?: string;
  activeHref?: string;
  "aria-label"?: string;
}

export function Navigation({
  items,
  className,
  activeHref,
  "aria-label": ariaLabel = "Navigation principale",
}: NavigationProps) {
  return (
    <nav aria-label={ariaLabel} className={cn(className)}>
      <ul className="flex flex-wrap items-center gap-x-6 gap-y-2">
        {items.map((item) => {
          const isActive = activeHref === item.href;
          return (
            <li key={item.href}>
              <Link
                href={item.href}
                aria-current={isActive ? "page" : undefined}
                className={cn(
                  "text-[length:var(--ms-text-xs)] font-medium uppercase tracking-[var(--ms-tracking-wider)] no-underline",
                  "border-b border-transparent pb-0.5",
                  "transition-colors duration-[var(--ms-duration)]",
                  isActive
                    ? "border-ms-gold text-ms-fg"
                    : "text-ms-gray-700 hover:text-ms-fg hover:border-ms-black",
                )}
              >
                {item.label}
              </Link>
            </li>
          );
        })}
      </ul>
    </nav>
  );
}
