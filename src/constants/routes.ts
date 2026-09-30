export const PUBLIC_ROUTES = {
  home: "/",
  meditations: "/meditations",
  archive: "/archive",
  about: "/a-propos",
  recherche: "/recherche",
  newsletterConfirm: "/newsletter/confirm",
  newsletterUnsubscribe: "/newsletter/unsubscribe",
} as const;

/** Navigation publique — en-tête et pied de page, dans cet ordre. */
export const PUBLIC_NAV = [
  { href: PUBLIC_ROUTES.home, label: "Aujourd'hui" },
  { href: PUBLIC_ROUTES.meditations, label: "Méditations" },
  { href: PUBLIC_ROUTES.archive, label: "Archive" },
  { href: PUBLIC_ROUTES.about, label: "À propos" },
] as const;

/** Page courante : l’accueil ne s’active que sur `/`. */
export function isPathActive(pathname: string, href: string): boolean {
  if (href === PUBLIC_ROUTES.home) return pathname === PUBLIC_ROUTES.home;
  return pathname === href || pathname.startsWith(`${href}/`);
}

export const ADMIN_ROUTES = {
  login: "/admin/login",
  dashboard: "/admin/dashboard",
  meditations: "/admin/meditations",
  calendrier: "/admin/calendrier",
  commentaires: "/admin/commentaires",
  newsletter: "/admin/newsletter",
  statistiques: "/admin/statistiques",
  parametres: "/admin/parametres",
  import: "/admin/import",
} as const;

/** Navigation principale espace auteur (ordre d’affichage). */
export const ADMIN_NAV = [
  { href: ADMIN_ROUTES.dashboard, label: "Dashboard" },
  { href: ADMIN_ROUTES.meditations, label: "Méditations" },
  { href: ADMIN_ROUTES.calendrier, label: "Calendrier" },
  { href: ADMIN_ROUTES.commentaires, label: "Commentaires" },
  { href: ADMIN_ROUTES.newsletter, label: "Newsletter" },
  { href: ADMIN_ROUTES.statistiques, label: "Statistiques" },
  { href: ADMIN_ROUTES.parametres, label: "Paramètres" },
] as const;

export const API_ROUTES = {
  health: "/api/health",
  import: "/api/admin/import",
  bibleResolve: "/api/bible/resolve",
  newsletterSubscribe: "/api/newsletter/subscribe",
  newsletterUnsubscribe: "/api/newsletter/unsubscribe",
  newsletterNotifyPublication: "/api/admin/newsletter/notify-publication",
  analyticsView: "/api/analytics/view",
  analyticsDownload: "/api/analytics/download",
} as const;
