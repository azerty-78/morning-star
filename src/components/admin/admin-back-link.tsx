"use client";

import { ChevronLeft } from "lucide-react";
import { useRouter } from "next/navigation";

export function AdminBackLink({
  fallbackHref,
  label,
}: {
  fallbackHref: string;
  label: string;
}) {
  const router = useRouter();

  return (
    <button
      type="button"
      onClick={() => {
        const referrer = document.referrer;
        const sameOrigin =
          referrer.length > 0 &&
          new URL(referrer).origin === window.location.origin;
        if (sameOrigin) router.back();
        else router.push(fallbackHref);
      }}
      className="inline-flex cursor-pointer items-center gap-0.5 rounded-full py-1 pr-3 text-[16px] font-medium text-ms-gold-dark transition-colors hover:text-ms-black"
    >
      <ChevronLeft size={20} strokeWidth={2.25} aria-hidden />
      {label}
    </button>
  );
}
