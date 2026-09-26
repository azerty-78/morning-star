/**
 * Design tokens Morning Star — référence TypeScript.
 * Source de vérité visuelle : `src/styles/globals.css`.
 */

export const colors = {
  black: "var(--ms-black)",
  white: "var(--ms-white)",
  offWhite: "var(--ms-off-white)",
  paper: "var(--ms-paper)",
  gold: "var(--ms-gold)",
  goldDark: "var(--ms-gold-dark)",
  muted: "var(--ms-muted)",
  border: "var(--ms-border)",
  fg: "var(--ms-fg)",
  bg: "var(--ms-bg)",
} as const;

export const typographyRoles = [
  "display",
  "title",
  "subtitle",
  "nav",
  "body",
  "lede",
  "date",
  "quote",
  "reference",
  "meta",
  "label",
] as const;

export type TypographyRole = (typeof typographyRoles)[number];

export const spacingScale = [
  0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11,
] as const;
