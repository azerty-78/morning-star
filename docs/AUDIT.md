# Audit complet — Morning Star

Date : 26 septembre 2026  
Périmètre : dépôt `morning-star` (Next.js 16.3 / React 19, `DATA_SOURCE=mock`)  
Méthode : lecture seule — **aucun code modifié** lors de cet audit.

Document complémentaire : [SECURITY.md](./SECURITY.md) (décisions et feuille de route sécurité).

---

## Verdict

Fondations solides (couches, design Swiss, SEO, Bible licence-first, newsletter double opt-in, analytics privacy-minded).

**Non déployable en production publique** tant que l’auth admin et la protection des API `/api/admin/*` ne sont pas en place.

Commentaires, scheduling automatique, parsers PDF/DOCX réels et Prisma restent des stubs ou de l’architecture.

---

## Problèmes classés

### CRITICAL

| # | Problème | Zones |
| --- | --- | --- |
| C1 | Aucune authentification réelle ; `requireAdmin()` jamais appelé | `src/lib/auth/*`, `/admin/*` |
| C2 | Aucun `middleware` ; `/admin/*` et `/api/admin/*` ouverts | routes admin + API import / notify |

### HIGH

| # | Problème | Zones |
| --- | --- | --- |
| H1 | Upload / liste / publish / schedule d’import sans garde | `src/app/api/admin/import/*` |
| H2 | Notification newsletter déclenchable sans auth | `notify-publication` |
| H3 | Prisma non branché (`prisma` absent de `package.json`) ; `DATA_SOURCE=prisma` cassera | schéma vs runtime |
| H4 | Publication programmée : pas de worker/cron ; `PublicationService` ne persiste pas | `publication`, Prisma `PublicationSchedule` |
| H5 | Commentaires : UI/admin mock uniquement ; pas d’API ni de flux public | `domain/comment`, `mock/admin` |
| H6 | Stores JSON RMW (`.data/`) non adaptés multi-instance / charge | analytics, newsletter, import |

### MEDIUM

| # | Problème | Zones |
| --- | --- | --- |
| M1 | Analytics abusables (pas de rate limit ; `meditationId` non validé) | `/api/analytics/*` |
| M2 | Upload : MIME/extension OK, **pas de magic bytes** | `document-validator.ts` |
| M3 | Parsers PDF/DOCX = fallback mock | `lib/import/parsers/*` |
| M4 | Rate limiting stub toujours permissif | `lib/security` |
| M5 | `AuditLog` schéma-only, aucune écriture | Prisma |
| M6 | Validation bodies HTTP sans schéma (Zod) | route handlers |
| M7 | Un seul `error.tsx` (archive) ; pas de `not-found` global | App Router |
| M8 | Tokens newsletter sans expiration | newsletter service |
| M9 | Services admin/analytics importent des mocks directement | séparation couches |
| M10 | Tables admin : scroll horizontal forcé sur mobile | méditations, stats |
| M11 | Skip link mort sur `/admin` (pas de `#contenu-principal`) | a11y |
| M12 | Admin densifié : risque de glisser hors grammaire Müller-Brockmann | UI admin |

### LOW

| # | Problème | Zones |
| --- | --- | --- |
| L1 | `AdminShell` entièrement client (îlot trop large) | perf admin |
| L2 | Health expose `dataSource` | `/api/health` |
| L3 | `/design-system` accessible (déjà `noindex` / robots) | SEO surface |
| L4 | Modèles Comment domaine vs admin divergents | dette |
| L5 | User/Bible repos toujours mock même si `DATA_SOURCE=prisma` | composition root |
| L6 | Typo hors échelle (`text-[9px]` calendrier) | design system |
| L7 | Formulaires login/paramètres désactivés (stubs) | UX temporaire |
| L8 | Contrats d’erreur API hétérogènes | DX |

---

## Analyse par axe (1–20)

### 1. Architecture

Couches respectées dans l’ensemble (`app` → `services` → `repositories` → mock/Prisma).

Écarts :

- mocks importés dans services admin/analytics ;
- `CommentRepository` hors composition root ;
- naming Meditation vs Prisma `Article` (documenté dans `ARCHITECTURE.md`).

### 2. TypeScript

- `strict` + `noUncheckedIndexedAccess` : bon.
- Peu de `any`.
- Faiblesses : casts JSON / bodies HTTP sans validation runtime ; `exactOptionalPropertyTypes` off.

### 3. Next.js

- App Router clair `(public)` / `admin` / `api`.
- Îlots client ciblés sur le lecteur.
- Manque : middleware, error/not-found globaux, login réel.

### 4. Sécurité

Documenté dans [SECURITY.md](./SECURITY.md).

- **Critique** : admin ouvert.
- **Moyen** : analytics, upload sans magic bytes, rate limit absent.
- **Sain** : pas de secrets frontend, emails masqués, cookie analytics httpOnly, robots admin.

### 5. Prisma

- Schéma riche et cohérent (Article, Comment, ArticleView, Newsletter, Bible, PublicationSchedule, AuditLog).
- Runtime mock-only ; packages Prisma non installés ; stubs qui throw.

### 6. Séparation frontend / backend

- Conceptuellement bonne (clients publics → APIs publiques).
- **Enforcement serveur absent** : un navigateur peut appeler `/api/admin/*`.

### 7. Responsive

- Public et calendrier (liste mobile) corrects.
- Tables admin = scroll horizontal ; densités à surveiller.

### 8. Accessibilité

- Skip link, `lang="fr"`, focus-visible, aria sur newsletter/dialog.
- Gap : skip link admin ; formulaires stubs.

### 9. SEO

- Solide : metadata dynamique, canonical, OG/Twitter, JSON-LD, sitemap, robots, URLs `/meditations/[slug]`.
- Gaps mineurs : 404 dédiée ; confirm/unsub déjà `noindex`.

### 10. Performance

- RSC + îlots raisonnables côté public.
- Points faibles : RMW fichiers `.data/`, `AdminShell` client.

### 11. Gestion des erreurs

- Archive seule a `error` / `loading`.
- APIs : formes `{ ok }`, `{ error }`, `{ data }` mélangées ; parfois `Error.message` brut.

### 12. Import PDF/DOCX

- Pipeline jusqu’à preview, plafond 15 Mo, MIME/extension, pas de publish auto : OK.
- Parsers mock ; pas de magic bytes ; API sans auth.

### 13. Références bibliques

- Parser / resolver / service / UI / API ; gates licence (LSG1910 démo, autres bloqués) : conforme.
- Rate limit API manquant.

### 14. Newsletter

- Double opt-in, confirm/unsub, EmailService abstrait + mock, admin masqué : solide.
- Manque : TTL tokens, rate limit, provider réel.

### 15. Commentaires

- Page admin + mocks dashboard seulement.
- Pas de dépôt public, pas de service, Prisma orphelin côté app.

### 16. Statistiques

- ArticleView + debounce + dashboard éditorial : en place.
- Abusable sans rate limit ; compteurs commentaires encore mock.

### 17. Publication programmée

- Statuts `SCHEDULED` + UI calendrier + import `schedule` stub.
- **Aucun exécuteur** ; `publish()` mémoire + notify.

### 18. Design system

- Tokens CSS, grille, composants `rounded-none`, styleguide : cohérent.
- Risque de drift micro-typo admin.

### 19. Cohérence Müller-Brockmann

- Public : fort (filets, asymétrie, or rare).
- Admin : densifié mais encore sobre ; surveiller badges/stats pour éviter le look SaaS.

### 20. Dette technique

Auth → Prisma → scheduling → commentaires → parsers → rate limit / audit → hardening validation / stores → polish a11y / UI.

---

## Maturité par domaine

| Domaine | Maturité |
| --- | --- |
| Architecture / design / SEO / Bible / newsletter | Élevée (fondations) |
| Lecteur / archives / admin UI structurelle | Moyenne–élevée |
| Sécurité prod / Prisma / scheduling / commentaires / import réel | Faible (bloquants) |

---

## Corrections proposées (ordre logique)

Ne rien appliquer automatiquement — ordre recommandé si validation ultérieure.

1. **Auth admin + middleware** — session cookie, `requireAdmin()` sur pages et `/api/admin/*` (ferme C1, C2, H1, H2).
2. **Rate limiting** — newsletter, analytics, bible, import (M1, M4, partie H2).
3. **Hardening analytics** — valider méditation `PUBLISHED` ; limiter longueur d’ID (M1).
4. **Upload** — magic bytes (+ auth déjà en 1) (M2).
5. **Contrats erreurs + `error.tsx` / `not-found`** (M7, L8).
6. **Validation Zod** des bodies API (M6).
7. **Commentaires** — aligner domaine / repo / service ; modération admin réelle ; UI publique optionnelle (H5, L4).
8. **Publication programmée** — persister statut + worker/cron `PublicationSchedule` (H4).
9. **Prisma** — installer client, migrations, brancher repos progressivement ; bloquer `DATA_SOURCE=prisma` tant que non prêt (H3, L5).
10. **Remplacer stores `.data/`** par DB (ou append-only) pour analytics / newsletter / jobs (H6).
11. **Parsers PDF/DOCX réels** + quarantine (M3).
12. **AuditLog** sur actions sensibles (M5).
13. **Newsletter** — TTL tokens ; provider email réel (M8).
14. **Polish** — skip link admin, tables responsive, réduire `AdminShell` client, micro-typo design system (M10–M12, L1, L6).

---

## Notes techniques de session (historique)

Ces points concernent des tâches terminal antérieures, déjà traitées dans le fil de travail :

- Suppression d’un reexport cassé : OK.
- Build admin initial : échec TypeScript sur le calendrier — corrigé ensuite ; builds suivants OK.

---

## Prochaine étape recommandée

Valider et implémenter la phase **1 (auth + middleware)** avant toute autre correction.
