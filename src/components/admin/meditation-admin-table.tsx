"use client";

import Link from "next/link";
import { useEffect, useMemo, useState } from "react";
import {
  BookOpen,
  CalendarDays,
  ChevronRight,
  FilePenLine,
  Upload,
} from "lucide-react";
import type { DailyMeditation, MeditationStatus } from "@/domain/meditation";
import { ADMIN_ROUTES, PUBLIC_ROUTES } from "@/constants/routes";
import { cn } from "@/lib/utils";
import { formatPublicationDate } from "@/lib/utils";

function statusLabel(status: MeditationStatus): string {
  if (status === "PUBLISHED") return "Publié";
  if (status === "SCHEDULED") return "Programmé";
  if (status === "ARCHIVED") return "Archivé";
  return "Brouillon";
}

type Filter = "ALL" | MeditationStatus;

const FILTERS: Filter[] = ["DRAFT", "SCHEDULED", "PUBLISHED"];

function readFilter(search: string): Filter {
  const value = new URLSearchParams(search).get("filtre");
  return FILTERS.includes(value as Filter) ? (value as Filter) : "ALL";
}

const filters: Array<{
  id: Filter;
  label: string;
  icon: typeof BookOpen;
}> = [
  { id: "DRAFT", label: "Brouillons", icon: FilePenLine },
  { id: "SCHEDULED", label: "Programmés", icon: CalendarDays },
  { id: "PUBLISHED", label: "Publiés", icon: BookOpen },
];

export function MeditationAdminTable({
  items,
  initialFilter = "ALL",
}: {
  items: DailyMeditation[];
  initialFilter?: Filter;
}) {
  const [filter, setFilter] = useState<Filter>(initialFilter);

  useEffect(() => {
    const sync = () => setFilter(readFilter(window.location.search));
    window.addEventListener("popstate", sync);
    return () => window.removeEventListener("popstate", sync);
  }, []);

  function selectFilter(next: Filter) {
    const url = new URL(window.location.href);
    if (next === "ALL") url.searchParams.delete("filtre");
    else url.searchParams.set("filtre", next);
    window.history.pushState(null, "", `${url.pathname}${url.search}`);
    setFilter(next);
  }

  const counts = useMemo(
    () => ({
      DRAFT: items.filter((item) => item.status === "DRAFT").length,
      SCHEDULED: items.filter((item) => item.status === "SCHEDULED").length,
      PUBLISHED: items.filter((item) => item.status === "PUBLISHED").length,
    }),
    [items],
  );

  const visible = items.filter((item) => filter === "ALL" || item.status === filter);

  return (
    <div className="ios-ui space-y-4">
      <div className="flex items-center justify-between gap-3">
        <p className="text-[15px] text-ms-gray-600">
          {visible.length} texte{visible.length > 1 ? "s" : ""}
          {filter === "ALL" ? "" : " dans ce filtre"}
        </p>
        <Link
          href={ADMIN_ROUTES.import}
          className="inline-flex h-10 items-center gap-2 rounded-full bg-ms-gold px-4 text-[15px] font-semibold text-ms-black no-underline transition-colors hover:bg-ms-gold-dark hover:text-white"
        >
          <Upload size={16} aria-hidden />
          Importer
        </Link>
      </div>

      <div className="grid grid-cols-3 gap-3">
        {filters.map((item) => {
          const active = filter === item.id;
          const Icon = item.icon;
          return (
            <button
              key={item.id}
              type="button"
              aria-pressed={active}
              onClick={() => selectFilter(active ? "ALL" : item.id)}
              className={cn(
                "rounded-3xl p-4 text-left transition-transform active:scale-[0.98]",
                active
                  ? "bg-ms-gold text-ms-black"
                  : "bg-white text-ms-black shadow-[0_1px_2px_rgba(26,26,26,0.05)] hover:bg-ms-gold/10",
              )}
            >
              <Icon size={18} strokeWidth={1.75} aria-hidden />
              <span className="mt-3 block text-[26px] font-semibold leading-none tabular-nums">
                {counts[item.id]}
              </span>
              <span className="mt-1 block text-[13px] font-medium">{item.label}</span>
            </button>
          );
        })}
      </div>

      <ul className="overflow-hidden rounded-3xl bg-white shadow-[0_1px_2px_rgba(26,26,26,0.05)]">
        {visible.length === 0 ? (
          <li className="px-4 py-6 text-[15px] text-ms-gray-600">
            Aucun texte dans ce filtre.
          </li>
        ) : (
          visible.map((item) => {
            const href =
              item.status === "PUBLISHED"
                ? `${PUBLIC_ROUTES.meditations}/${item.slug}`
                : ADMIN_ROUTES.import;
            const ActionIcon = item.status === "PUBLISHED" ? BookOpen : FilePenLine;
            return (
              <li key={item.id} className="border-b border-black/5 last:border-b-0">
                <Link
                  href={href}
                  className="flex items-center gap-3 px-4 py-3 no-underline transition-colors hover:bg-ms-gold/10"
                >
                  <span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-2xl bg-ms-gold/15 text-ms-gold-dark">
                    <ActionIcon size={18} aria-hidden />
                  </span>
                  <span className="min-w-0 flex-1">
                    <span className="block truncate text-[16px] font-medium text-ms-black">
                      {item.title}
                    </span>
                    <span className="mt-0.5 block truncate text-[13px] text-ms-gray-600">
                      {formatPublicationDate(item.publicationDate)} · {item.excerpt}
                    </span>
                  </span>
                  <span
                    className={cn(
                      "shrink-0 rounded-full px-2.5 py-1 text-[11px] font-semibold",
                      item.status === "PUBLISHED" && "bg-ms-black text-ms-off-white",
                      item.status === "SCHEDULED" && "bg-ms-gold text-ms-black",
                      item.status !== "PUBLISHED" &&
                        item.status !== "SCHEDULED" &&
                        "bg-ms-gray-100 text-ms-gray-700",
                    )}
                  >
                    {statusLabel(item.status)}
                  </span>
                  <ChevronRight size={16} className="shrink-0 text-ms-gray-400" aria-hidden />
                </Link>
              </li>
            );
          })
        )}
      </ul>
    </div>
  );
}
