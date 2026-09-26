export const PUBLIC_ROUTES = {
  home: "/",
  meditations: "/meditations",
  archive: "/archive",
  recherche: "/recherche",
} as const;

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
} as const;
