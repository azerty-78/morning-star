"use client";

import Link from "next/link";
import {
  BookOpen,
  CalendarDays,
  ChevronRight,
  Download,
  Eye,
  Mail,
  MessageCircle,
} from "lucide-react";
import {
  Area,
  AreaChart,
  ResponsiveContainer,
  Tooltip,
  XAxis,
} from "recharts";
import type { AdminDashboardSnapshot } from "@/domain/admin";
import type { DailyMeditation } from "@/domain/meditation";
import { ADMIN_ROUTES, meditationAdminHref, PUBLIC_ROUTES } from "@/constants/routes";
import { cn, formatPublicationDate } from "@/lib/utils";

function statusLabel(status: DailyMeditation["status"]): string {
  if (status === "PUBLISHED") return "Publié";
  if (status === "SCHEDULED") return "Programmé";
  if (status === "ARCHIVED") return "Archivé";
  return "Brouillon";
}

function StatusPill({ status }: { status: DailyMeditation["status"] }) {
  return (
    <span
      className={cn(
        "shrink-0 rounded-full px-2.5 py-1 text-[11px] font-semibold",
        status === "PUBLISHED" && "bg-ms-black text-ms-off-white",
        status === "SCHEDULED" && "bg-ms-gold text-ms-black",
        status !== "PUBLISHED" && status !== "SCHEDULED" && "bg-ms-gray-100 text-ms-gray-700",
      )}
    >
      {statusLabel(status)}
    </span>
  );
}

function shortDay(iso: string): string {
  const date = new Date(`${iso}T12:00:00`);
  if (Number.isNaN(date.getTime())) return iso.slice(5);
  return new Intl.DateTimeFormat("fr-FR", {
    day: "numeric",
    month: "short",
  }).format(date);
}

function MetricCard({
  href,
  label,
  value,
  hint,
  icon: Icon,
}: {
  href: string;
  label: string;
  value: string;
  hint: string;
  icon: typeof Eye;
}) {
  return (
    <Link
      href={href}
      className="group flex flex-col rounded-3xl bg-white p-4 no-underline shadow-[0_1px_2px_rgba(26,26,26,0.05)] transition-transform active:scale-[0.98]"
    >
      <span className="flex h-10 w-10 items-center justify-center rounded-2xl bg-ms-gold/20 text-ms-gold-dark transition-colors group-hover:bg-ms-gold group-hover:text-ms-black">
        <Icon size={18} strokeWidth={1.75} aria-hidden />
      </span>
      <p className="mt-4 text-[28px] font-semibold leading-none tracking-tight text-ms-black tabular-nums">
        {value}
      </p>
      <p className="mt-2 text-[15px] font-medium text-ms-black">{label}</p>
      <p className="mt-0.5 text-[13px] text-ms-gray-600">{hint}</p>
    </Link>
  );
}

function Group({
  title,
  action,
  children,
}: {
  title: string;
  action?: { href: string; label: string };
  children: React.ReactNode;
}) {
  return (
    <section className="overflow-hidden rounded-3xl bg-white shadow-[0_1px_2px_rgba(26,26,26,0.05)]">
      <div className="flex items-center justify-between px-4 py-3">
        <h2 className="text-[15px] font-semibold text-ms-black">{title}</h2>
        {action ? (
          <Link
            href={action.href}
            className="text-[14px] font-medium text-ms-gold-dark no-underline hover:text-ms-black"
          >
            {action.label}
          </Link>
        ) : null}
      </div>
      <ul className="border-t border-ms-gold/15">{children}</ul>
    </section>
  );
}

function Row({
  href,
  title,
  meta,
  status,
}: {
  href: string;
  title: string;
  meta: string;
  status?: DailyMeditation["status"];
}) {
  return (
    <li className="border-b border-black/5 last:border-b-0">
      <Link
        href={href}
        className="flex items-center gap-3 px-4 py-3 no-underline transition-colors hover:bg-ms-gold/10"
      >
        <span className="min-w-0 flex-1">
          <span className="block truncate text-[16px] font-medium text-ms-black">
            {title}
          </span>
          <span className="mt-0.5 block truncate text-[13px] text-ms-gray-600">
            {meta}
          </span>
        </span>
        {status ? <StatusPill status={status} /> : null}
        <ChevronRight size={16} className="shrink-0 text-ms-gray-400" aria-hidden />
      </Link>
    </li>
  );
}

export function AdminDashboardView({
  snapshot,
}: {
  snapshot: AdminDashboardSnapshot;
}) {
  const { current, recentPublished, scheduled, pendingComments } = snapshot;
  const chart = snapshot.daily.map((day) => ({
    label: shortDay(day.date),
    vues: day.pageViews,
    sessions: day.uniqueSessions,
  }));

  return (
    <div className="ios-ui space-y-4">
      {current ? (
        <Link
          href={`${PUBLIC_ROUTES.meditations}/${current.slug}`}
          className="flex items-center gap-4 rounded-3xl bg-white p-4 no-underline shadow-[0_1px_2px_rgba(26,26,26,0.05)] transition-transform active:scale-[0.99]"
        >
          <span className="flex h-12 w-12 shrink-0 items-center justify-center rounded-2xl bg-ms-gold text-ms-black">
            <BookOpen size={22} strokeWidth={1.75} aria-hidden />
          </span>
          <span className="min-w-0 flex-1">
            <span className="block text-[13px] font-medium text-ms-gold-dark">
              Méditation du jour · {formatPublicationDate(current.publicationDate)}
            </span>
            <span className="mt-0.5 block truncate text-[18px] font-semibold tracking-tight text-ms-black">
              {current.title}
            </span>
            <span className="mt-0.5 block line-clamp-1 text-[14px] text-ms-gray-600">
              {current.excerpt}
            </span>
          </span>
          <ChevronRight className="shrink-0 text-ms-gray-400" aria-hidden />
        </Link>
      ) : (
        <p className="rounded-3xl bg-white px-4 py-6 text-[15px] text-ms-gray-600">
          Aucune méditation pour aujourd&apos;hui.
        </p>
      )}

      <div className="grid gap-3 sm:grid-cols-3">
        <MetricCard
          href={ADMIN_ROUTES.statistiques}
          label="Lectures"
          value={snapshot.totalViews.toLocaleString("fr-FR")}
          hint={`${snapshot.viewsThisWeek.toLocaleString("fr-FR")} cette semaine`}
          icon={Eye}
        />
        <MetricCard
          href={ADMIN_ROUTES.newsletter}
          label="Abonnés"
          value={snapshot.newsletterActive.toLocaleString("fr-FR")}
          hint={`${snapshot.newsletterTotal.toLocaleString("fr-FR")} au total`}
          icon={Mail}
        />
        <MetricCard
          href={ADMIN_ROUTES.commentaires}
          label="À traiter"
          value={String(pendingComments.length)}
          hint="Commentaires en attente"
          icon={MessageCircle}
        />
      </div>

      <section className="rounded-3xl bg-white p-4 shadow-[0_1px_2px_rgba(26,26,26,0.05)]">
        <div className="mb-2 flex items-center justify-between gap-3">
          <div className="flex items-center gap-2">
            <span className="flex h-8 w-8 items-center justify-center rounded-xl bg-ms-gold/20 text-ms-gold-dark">
              <Eye size={16} aria-hidden />
            </span>
            <h2 className="text-[15px] font-semibold text-ms-black">
              Lectures récentes
            </h2>
          </div>
          <p className="flex items-center gap-1 text-[13px] text-ms-gray-600">
            <Download size={14} aria-hidden />
            {snapshot.downloadsAllTime.toLocaleString("fr-FR")}
          </p>
        </div>
        <div className="h-44 w-full">
          <ResponsiveContainer width="100%" height="100%">
            <AreaChart data={chart} margin={{ top: 8, right: 4, left: 0, bottom: 0 }}>
              <defs>
                <linearGradient id="msViews" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="0%" stopColor="#cf9d48" stopOpacity={0.45} />
                  <stop offset="100%" stopColor="#cf9d48" stopOpacity={0.02} />
                </linearGradient>
              </defs>
              <XAxis
                dataKey="label"
                tickLine={false}
                axisLine={false}
                tick={{ fill: "#6f6d67", fontSize: 11 }}
                interval="preserveStartEnd"
              />
              <Tooltip
                cursor={{ stroke: "#cf9d48", strokeOpacity: 0.35 }}
                content={({ active, payload, label }) => {
                  if (!active || !payload?.length) return null;
                  const views = payload[0]?.value ?? 0;
                  return (
                    <div className="rounded-xl bg-ms-black px-3 py-2 text-[12px] text-ms-off-white">
                      <p>{label}</p>
                      <p className="font-semibold">{views} vues</p>
                    </div>
                  );
                }}
              />
              <Area
                type="monotone"
                dataKey="vues"
                stroke="#cf9d48"
                strokeWidth={2.5}
                fill="url(#msViews)"
                activeDot={{ r: 4, fill: "#1a1a1a", stroke: "#cf9d48" }}
              />
            </AreaChart>
          </ResponsiveContainer>
        </div>
      </section>

      <div className="grid gap-4 lg:grid-cols-2">
        <Group
          title="Publications récentes"
          action={{ href: ADMIN_ROUTES.meditations, label: "Tout voir" }}
        >
          {recentPublished.map((item) => (
            <Row
              key={item.id}
              href={`${PUBLIC_ROUTES.meditations}/${item.slug}`}
              title={item.title}
              meta={formatPublicationDate(item.publicationDate)}
              status={item.status}
            />
          ))}
        </Group>

        <Group
          title="Programmées"
          action={{ href: ADMIN_ROUTES.calendrier, label: "Calendrier" }}
        >
          {scheduled.length === 0 ? (
            <li className="flex items-center gap-3 px-4 py-4 text-[15px] text-ms-gray-600">
              <CalendarDays size={18} aria-hidden />
              Rien de programmé.
            </li>
          ) : (
            scheduled.map((item) => (
              <Row
                key={item.id}
                href={meditationAdminHref(item.status, item.slug)}
                title={item.title}
                meta={formatPublicationDate(item.publicationDate)}
                status={item.status}
              />
            ))
          )}
        </Group>
      </div>

      <Group
        title="Commentaires à traiter"
        action={{ href: ADMIN_ROUTES.commentaires, label: "Modérer" }}
      >
        {pendingComments.length === 0 ? (
          <li className="px-4 py-4 text-[15px] text-ms-gray-600">
            File d&apos;attente vide.
          </li>
        ) : (
          pendingComments.map((comment) => (
            <li key={comment.id} className="border-b border-black/5 last:border-b-0">
              <Link
                href={ADMIN_ROUTES.commentaires}
                className="flex items-start gap-3 px-4 py-3 no-underline hover:bg-ms-gold/10"
              >
                <span className="mt-0.5 flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-ms-gold/20 text-ms-gold-dark">
                  <MessageCircle size={16} aria-hidden />
                </span>
                <span className="min-w-0 flex-1">
                  <span className="block text-[15px] font-medium text-ms-black">
                    {comment.authorName}
                  </span>
                  <span className="mt-0.5 block text-[14px] text-ms-gray-700">
                    {comment.excerpt}
                  </span>
                  <span className="mt-0.5 block text-[13px] text-ms-gray-500">
                    sur « {comment.meditationTitle} »
                  </span>
                </span>
                <ChevronRight size={16} className="mt-1 shrink-0 text-ms-gray-400" aria-hidden />
              </Link>
            </li>
          ))
        )}
      </Group>
    </div>
  );
}
