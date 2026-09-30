import Link from "next/link";
import { BrandLogo } from "@/components/brand";
import { APP_NAME } from "@/constants/app";
import { PUBLIC_ROUTES } from "@/constants/routes";

const links = [
  { href: PUBLIC_ROUTES.meditations, label: "Méditations" },
  { href: PUBLIC_ROUTES.archive, label: "Archive" },
  { href: PUBLIC_ROUTES.about, label: "À propos" },
] as const;

export function SiteFooter() {
  const year = new Date().getFullYear();

  return (
    <footer role="contentinfo" className="ios-ui mt-auto bg-ms-cream-deep">
      <div className="mx-auto flex max-w-[var(--ms-container)] flex-col gap-5 px-[var(--ms-gutter)] py-8 sm:flex-row sm:items-center sm:justify-between">
        <div className="flex items-center gap-3">
          <span className="brand-mark brand-mark--lg">
            <BrandLogo />
          </span>
          <div>
            <p className="text-[15px] font-semibold tracking-tight text-ms-black">
              {APP_NAME}
            </p>
            <p className="text-[13px] text-ms-gray-600">
              Méditations quotidiennes · {year}
            </p>
          </div>
        </div>
        <nav aria-label="Pied de page">
          <ul className="flex flex-wrap gap-x-5 gap-y-2">
            {links.map((link) => (
              <li key={link.href}>
                <Link
                  href={link.href}
                  className="text-[15px] font-medium text-ms-gold-dark no-underline hover:text-ms-black"
                >
                  {link.label}
                </Link>
              </li>
            ))}
          </ul>
        </nav>
      </div>
    </footer>
  );
}
