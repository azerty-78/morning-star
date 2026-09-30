import Link from "next/link";
import { ChevronLeft } from "lucide-react";

export function AdminBackLink({
  fallbackHref,
  label,
}: {
  fallbackHref: string;
  label: string;
}) {
  return (
    <Link
      href={fallbackHref}
      className="inline-flex cursor-pointer items-center gap-0.5 rounded-full py-1 pr-3 text-[16px] font-medium text-ms-gold-dark no-underline transition-colors hover:text-ms-black"
    >
      <ChevronLeft size={20} strokeWidth={2.25} aria-hidden />
      {label}
    </Link>
  );
}
