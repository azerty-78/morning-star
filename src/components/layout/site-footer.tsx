import Link from "next/link";
import { BrandLogo } from "@/components/brand";
import { APP_NAME } from "@/constants/app";
import { PUBLIC_NAV, PUBLIC_ROUTES } from "@/constants/routes";

export function SiteFooter() {
  const year = new Date().getFullYear();

  return (
    <footer role="contentinfo" className="ios-ui mt-auto bg-ms-cream-deep">
      <div className="mx-auto flex max-w-[var(--ms-container)] flex-col gap-5 px-[var(--ms-gutter)] py-8 sm:flex-row sm:items-center sm:justify-between">
        <Link
          href={PUBLIC_ROUTES.home}
          className="flex items-center gap-3 no-underline"
          aria-label={`${APP_NAME} — accueil`}
        >
          <span className="brand-mark brand-mark--lg">
            <BrandLogo decorative />
          </span>
          <div>
            <p className="text-[15px] font-semibold tracking-tight text-ms-black">
              {APP_NAME}
            </p>
            <p className="text-[13px] text-ms-gray-600">
              Méditations quotidiennes · {year}
            </p>
          </div>
        </Link>
        <nav aria-label="Pied de page">
          <ul className="flex flex-wrap gap-x-5 gap-y-2">
            {PUBLIC_NAV.map((link) => (
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
