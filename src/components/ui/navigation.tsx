import Link from "next/link";
import { cn } from "@/lib/utils";

export interface NavItem {
  href: string;
  label: string;
}

export interface NavigationProps {
  items: NavItem[];
  className?: string;
  "aria-label"?: string;
}

export function Navigation({
  items,
  className,
  "aria-label": ariaLabel = "Navigation principale",
}: NavigationProps) {
  return (
    <nav aria-label={ariaLabel} className={cn(className)}>
      <ul className="flex flex-wrap items-center gap-x-6 gap-y-2">
        {items.map((item) => (
          <li key={item.href}>
            <Link
              href={item.href}
              className="text-xs uppercase tracking-[0.14em] text-ms-fg no-underline hover:text-ms-accent-muted"
            >
              {item.label}
            </Link>
          </li>
        ))}
      </ul>
    </nav>
  );
}
