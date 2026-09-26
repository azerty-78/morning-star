# Sécurité — Morning Star

Document de référence pour les **décisions de sécurité**, l’état actuel et la feuille de route.

Morning Star est une publication éditoriale avec **un administrateur unique** (l’auteur). Le modèle de menace privilégie la protection de l’espace admin, des fichiers d’import, des abonnés newsletter et l’intégrité des statistiques — sans sur-ingénierie SaaS multi-tenant.

---

## 1. Principes directeurs

1. **Aucun secret dans le frontend** — seules les variables `NEXT_PUBLIC_*` non sensibles (URL canonique, nom d’app) peuvent être exposées au navigateur.
2. **Opérations sensibles côté serveur** — publication, import, notification newsletter, lecture d’emails abonnés, agrégats admin : Server Components / Route Handlers uniquement.
3. **Le frontend public n’appelle jamais des opérations admin** — uniquement des endpoints publics volontairement exposés (`/api/newsletter/*`, `/api/analytics/*`, `/api/bible/resolve`).
4. **Moindre privilege & minimisation** — pas d’IP dans `ArticleView`, emails masqués côté UI publique, tokens newsletter opaques.
5. **Défense en profondeur** — auth + autorisation + validation + rate limit + audit, même pour un seul auteur.
6. **Pas de publication automatique** — l’import s’arrête à la preview ; publish / schedule exigent une action admin explicite.

---

## 2. Modèle de menace (V1)

| Acteur | Capacité visée |
| --- | --- |
| Visiteur anonyme | Lire méditations, s’abonner, analytics légitimes |
| Abonné newsletter | Confirmer / se désinscrire via token |
| Attaquant distant | Abuser endpoints publics, saturer upload/stats, usurper l’admin |
| Auteur (admin) | Tout le back-office |

Hors périmètre V1 : multi-admin, SSO entreprise, chiffrement at-rest applicatif (délégation au disque / hébergeur).

---

## 3. Authentification & autorisation

### Décisions

- Un seul rôle : `UserRole.ADMIN` (schéma Prisma `User.passwordHash` préparé).
- Session serveur (cookie httpOnly, `Secure` en prod, `SameSite=Lax` ou `Strict` pour l’admin) — **pas** de JWT longue durée dans `localStorage`.
- Guards typés : `requireAdmin()` / `assertAdminAccess()` dans `src/lib/auth`.
- Protection des routes : `middleware` / proxy Next.js + appel `requireAdmin()` dans les layouts / handlers `/admin` et `/api/admin/*`.
- Login : credentials côté serveur uniquement ; formulaire `/admin/login` désactivé tant que l’auth n’est pas branchée.

### État actuel (audit)

| Contrôle | Statut |
| --- | --- |
| `getAdminSession()` | Stub — retourne toujours `null` |
| `requireAdmin()` | Présent, **jamais appelé** par les pages / API |
| `middleware.ts` | **Absent** |
| `/admin/*` | Accessible sans authentification |
| `/api/admin/*` | Accessible sans authentification |

**Décision** : jusqu’à la phase auth, considérer l’admin comme **non déployable en production publique**. En local / preview privée uniquement.

### Feuille de route auth

1. Brancher un provider (Auth.js / session custom) avec `AUTH_SECRET` serveur.
2. Middleware : rediriger `/admin/*` (sauf `/admin/login`) si non authentifié.
3. Wrapper `withAdmin` sur tous les Route Handlers `/api/admin/*`.
4. Verrouiller `robots.txt` (déjà `Disallow: /admin/`) + `metadata.robots: noindex` (déjà sur le layout admin).

---

## 4. Séparation public / admin

### Décisions

| Surface | Autorisé depuis le navigateur public |
| --- | --- |
| `POST /api/newsletter/subscribe` | Oui (réponse sans email) |
| `POST/GET /api/newsletter/unsubscribe` | Oui (token opaque) |
| `POST /api/analytics/view\|download` | Oui (anonyme, rate-limité) |
| `GET /api/bible/resolve` | Oui (contenu biblique licencié) |
| `POST /api/admin/import` | **Non** — admin authentifié uniquement |
| `POST /api/admin/newsletter/notify-publication` | **Non** — admin uniquement |
| Lecture emails abonnés | **Jamais** via API publique |

Les composants publics (`NewsletterSignup`, `MeditationViewTracker`, `ReaderActions`) n’importent pas de services admin et n’appellent que des `API_ROUTES` publiques.

### État actuel

Les handlers sous `/api/admin/*` **n’enforcement pas** encore l’auth — un client public *peut* les appeler techniquement. C’est un écart **critique** à corriger avant prod (voir §3).

---

## 5. Validation des inputs

### Décisions

- Validation serveur obligatoire (ne jamais faire confiance au client).
- Helpers dans `src/lib/validation` ; montée en puissance avec un schéma (Zod) pour les bodies API.
- Emails : normalisation + format ; réponses publiques **génériques** (pas d’énumération d’abonnés).
- IDs / tokens : longueur max, alphabet opaque ; rejeter `@` et espaces dans `sessionKey`.
- Contenu éditorial : rendu React (échappement XSS) ; HTML email construit côté serveur avec échappement des champs utilisateur.

### État actuel

- Email newsletter validé (`isValidEmail`).
- Analytics : `sessionKey` validé ; **`meditationId` non vérifié** contre le catalogue publié.
- Import job actions : `action` en string libre (whitelist partielle dans le handler).

---

## 6. Fichiers uploadés (import)

### Décisions

| Contrôle | Règle |
| --- | --- |
| Formats | PDF, DOC, DOCX uniquement |
| Taille max | **15 Mo** (`DocumentValidator`) |
| MIME | Liste blanche par format |
| Extension | Détection par nom + MIME déclaré |
| Malware / polyglots | Vérifier **magic bytes** (signatures) avant parsing ; quarantaine `.data/` hors webroot |
| Exécution | Jamais exécuter le fichier ; parsers PDF/Word en bac contrôlé |
| Stockage | Hors `public/` ; `.data/` gitignoré |
| Publication | Jamais auto après upload |

### État actuel

- Taille + MIME + extension : **implémentés**.
- Magic bytes / antivirus / sandbox : **non implémentés** (écart medium).
- Route upload : **sans auth** (écart critique — §3).

### Feuille de route upload

1. Auth admin obligatoire.
2. Vérifier signatures binaires (PDF `%PDF-`, ZIP/DOCX `PK\x03\x04`, etc.) et rejeter les mismatches extension/MIME/contenu.
3. Rate limit strict (ex. 5 uploads / heure / admin).
4. Ne jamais renvoyer le binaire brut au client public.

---

## 7. XSS, injection, CSRF

### XSS

- **Décision** : JSX React par défaut ; pas de `innerHTML` utilisateur.
- JSON-LD : `JSON.stringify` + escape `<` → `\u003c` (`JsonLd`).
- Contenu méditation : texte / segments ; références bibliques via boutons contrôlés.

### Injection

- **Décision** : accès DB uniquement via Prisma paramétré (quand branché) — pas de SQL concaténé.
- Mock stores = JSON local, pas d’interpréteur de requête.

### CSRF

- **Décision** (après auth cookie) :
  - Mutations admin : token CSRF synchronizer **ou** `SameSite=Strict` + Origin/Referer check.
  - Endpoints publics `POST` same-site : `SameSite=Lax` + rate limit ; analytics déjà `credentials: "same-origin"`.
- État : pas de CSRF token (auth absente).

---

## 8. Rate limiting & endpoints

### Décisions

| Endpoint | Limite indicative |
| --- | --- |
| `/api/newsletter/subscribe` | Faible (anti-spam / énumération) |
| `/api/analytics/*` | Moyen (anti-inflation stats) |
| `/api/bible/resolve` | Moyen |
| `/api/admin/import` | Strict |
| `/api/admin/newsletter/notify-*` | Très strict |

Implémentation cible : edge / Redis via `src/lib/security` (remplacer `checkRateLimitStub`).

### État actuel

- Stub toujours `allowed: true`.
- Analytics abusables par rotation de `sessionKey` / absence de cookie (inflation + saturation `.data/analytics`).

---

## 9. Exposition de données

### Décisions

- Emails abonnés : **jamais** dans le HTML/JSON public ; admin = masqués (`maskEmail`) jusqu’à besoin métier explicite.
- Tokens confirm / unsub : dans les liens email uniquement ; pages `noindex`.
- Stats admin : non indexées ; derrière auth.
- Health : minimal (`ok`, `dataSource`, timestamp) — pas de secrets.
- Erreurs API : messages utilisateur ; pas de stack traces en production.

### État actuel

- Masquage email admin : OK.
- Jobs d’import (GET liste / détail) : exposés sans auth → risque de fuite de contenu preview.
- Dashboard stats enrichi accessible sans auth → fuite métriques éditoriales / newsletter agrégée.

---

## 10. Secrets & variables d’environnement

### Décisions

| Variable | Visibilité | Usage |
| --- | --- | --- |
| `AUTH_SECRET` | Serveur uniquement | Signature session |
| `DATABASE_URL` | Serveur | Postgres |
| `EMAIL_*` / clés provider | Serveur | Envoi |
| `NEXT_PUBLIC_APP_URL` | Public | SEO / liens canoniques |
| `NEXT_PUBLIC_APP_NAME` | Public | Branding |

- `.env*` gitignoré ; seul `.env.example` versionné (placeholders).
- Jamais committer de clés ; jamais `NEXT_PUBLIC_` pour un secret.
- `.data/` gitignoré (jobs, outbox email, analytics, newsletter).

### État actuel

- Convention respectée dans le code applicatif.
- `EMAIL_PROVIDER` vide → repli mock (pas de secret fuité).

---

## 11. Logs & audit log

### Décisions

- **Logs applicatifs** : pas d’email en clair en production ; MockEmailService loggue en dev uniquement.
- **AuditLog** (Prisma) : actions admin sensibles — login, import approve/publish, notify newsletter, modération commentaires, changement paramètres.
- Métadonnées d’audit : ids, action, entity — **pas** de mot de passe, pas de corps de fichier entier.
- Conservation : politique à définir à l’hébergement (durée légitime / RGPD).

### État actuel

- Modèle `AuditLog` prêt dans `prisma/schema.prisma`.
- **Aucun écriture d’audit** dans les services (écart).
- Outbox mock : `.data/email/mock-outbox.jsonl` (dev).

---

## 12. Analytics (ArticleView) — privacy

### Décisions

- Cookie anonyme `ms_aid` : httpOnly, SameSite=Lax, Secure en prod.
- Debounce 30 s (vues) / 5 s (téléchargements) par `(session, article, kind)`.
- Sessions ≈ `sessionKey` distincts — **pas** d’identité réelle.
- Pas d’IP stockée ; UA → `DeviceClass` grossier ; referrer → hostname seul.
- Valider que `meditationId` est une méditation **PUBLISHED** avant enregistrement.

---

## 13. Synthèse de l’audit (instantané)

| Sévérité | Finding |
| --- | --- |
| **Critique** | Pas d’auth réelle ; `/admin/*` et `/api/admin/*` ouverts (import, publish, notify). |
| **Élevée** | Upload admin sans garde ; listing jobs import sans auth. |
| **Moyenne** | Analytics publics sans rate limit ; debounce contournable ; pas de magic bytes upload. |
| **Moyenne** | Rate limiting & AuditLog non branchés. |
| **Basse** | Health divulgue `dataSource` ; design-system public (déjà `noindex` / robots). |

### Points sains déjà en place

- Séparation conceptuelle public / admin dans les routes et composants.
- Pas de secrets hardcodés ; `.env` / `.data` ignorés.
- Newsletter : double opt-in, réponses sans email, masquage admin.
- Import : plafond 15 Mo, MIME/extension, pas de publish auto.
- XSS : React + escape JSON-LD.
- Analytics : cookie httpOnly, minimisation PII.
- Admin layout : `robots: noindex` ; `robots.txt` disallow `/admin`, `/api`.

---

## 14. Checklist avant production publique

- [ ] Auth admin réelle + middleware
- [ ] `requireAdmin()` sur toutes les API `/api/admin/*`
- [ ] Rate limiting actif (newsletter, analytics, import)
- [ ] Magic bytes + auth sur upload
- [ ] Validation `meditationId` publié (analytics)
- [ ] Écriture `AuditLog` sur actions sensibles
- [ ] `AUTH_SECRET` / secrets provider configurés hors dépôt
- [ ] Revue que aucun `NEXT_PUBLIC_*` ne contient de secret
- [ ] Désactiver ou protéger `/design-system` hors staging

---

## 15. Emplacements code

| Domaine | Chemin |
| --- | --- |
| Auth (stubs) | `src/lib/auth/` |
| Sécurité / rate limit stub | `src/lib/security/` |
| Validation | `src/lib/validation/` |
| Upload validation | `src/lib/import/validation/document-validator.ts` |
| Analytics privacy | `src/lib/analytics/policy.ts` |
| Newsletter masking | `src/lib/newsletter/tokens.ts` |
| Schéma AuditLog | `prisma/schema.prisma` → `AuditLog` |

Ce document doit être mis à jour à chaque phase qui change le modèle de confiance (auth, DB, email provider, hébergement).
