export const PUBLIC_ROUTES = {
  home: "/",
  meditations: "/meditations",
  archive: "/archive",
  recherche: "/recherche",
} as const;

export const ADMIN_ROUTES = {
  login: "/admin/login",
  dashboard: "/admin/dashboard",
  import: "/admin/import",
} as const;

export const API_ROUTES = {
  health: "/api/health",
  import: "/api/admin/import",
  bibleResolve: "/api/bible/resolve",
} as const;
