# Morning Star

Document de référence pour l'étape fondations. À tenir à jour au fur et à mesure des phases.

Voir aussi [DESIGN_SYSTEM.md](./DESIGN_SYSTEM.md) pour les décisions visuelles et [SECURITY.md](./SECURITY.md) pour l’audit et les décisions de sécurité.

## 1. Architecture générale

Morning Star est une plateforme éditoriale Next.js (App Router) séparée en couches :

| Couche | Emplacement | Responsabilité |
| --- | --- | --- |
| Présentation | `src/app`, `src/components` | Routes, UI, accessibilité |
| Domaine | `src/domain` | Types et règles métier purs |
| Services | `src/services` | Orchestration métier |
| Repositories | `src/repositories` | Accès données (interfaces + implémentations) |
| Infrastructure | `src/lib` | Auth, DB, sécurité, validation, storage, parser |
| Données | `prisma/`, `src/lib/mock` | Schéma futur + mocks actuels |

Flux typique :

```
Page (app) → Service → Repository (interface) → Mock | Prisma
```

Les composants React ne parlent jamais directement à Prisma.

## 2. Rôle de chaque dossier

- `src/app/(public)` — espace public (méditation du jour, liste, archive, recherche)
- `src/app/admin` — espace administrateur unique
- `src/app/api` — route handlers HTTP
- `src/components/ui` — design system de base
- `src/components/layout` — en-tête / pied de page
- `src/components/meditation` — UI liée aux méditations
- `src/components/bible|editor|admin|public` — emplacements pour phases ultérieures
- `src/domain/*` — modèles métier typés
- `src/repositories/*` — contrats + mocks (+ stubs Prisma)
- `src/services/*` — services métier
- `src/lib/auth` — session / guards (auth réelle plus tard)
- `src/lib/db` — composition root des repositories
- `src/lib/mock` — **données explicitement mockées**
- `src/lib/security|validation|storage|parser` — fondations infrastructure
- `src/styles` — tokens CSS / globals
- `prisma/` — schéma PostgreSQL préparé, non connecté
- `setup/` — Docker généré via `docker init` (**zone réservée, ne pas modifier dans cette phase**)

## 3. Séparation UI / domaine / infrastructure

- **UI** : rendu, navigation, formulaires, accessibilité.
- **Domaine** : structures (`DailyMeditation`, `User`, …) sans dépendance Next/Prisma.
- **Infrastructure** : env, auth future, storage, parsers, client DB.

Si une règle métier apparaît dans un composant, la remonter dans `domain` ou `services`.

## 4. Stratégie Repository

1. Définir une interface (`MeditationRepository`).
2. Implémenter `MockMeditationRepository` pour le développement sans Postgres.
3. Préparer `PrismaMeditationRepository` (lève une erreur tant que non branché).
4. Résoudre l'implémentation via `src/lib/db/repositories.ts` selon `DATA_SOURCE`.

## 5. Rôle des mocks

Tant que `DATA_SOURCE` ≠ `prisma` (défaut), l'application utilise `src/lib/mock`.

Les mocks sont :

- clairement nommés (`mock*`, badge UI « Données de démonstration ») ;
- isolés dans `src/lib/mock` ;
- jamais mélangés silencieusement avec des données réelles.

## 6. Stratégie Prisma

- Fichier : `prisma/schema.prisma` (+ `prisma/README.md`)
- Provider : PostgreSQL
- Entités : `User`, `Article`, `ArticleContent`, `Media`, `Comment`, `ArticleView`, `NewsletterSubscriber`, `NewsletterEvent`, `BibleTranslation`, `BibleBook`, `BibleVerse`, `PublicationSchedule`, `SiteSetting`, `AuditLog`
- Enums : `UserRole`, `ArticleStatus`, `CommentStatus`, `PublicationType`, `NewsletterStatus`, (+ `NewsletterEventType`, `MediaKind`, `ContentFormat`)

Le domaine applicatif V1 parle encore de « méditation » (mocks) ; Prisma utilise **Article** pour rester évolutif. Mapping documenté dans `prisma/README.md`.

Les packages `prisma` / `@prisma/client` seront installés lors de la phase DB. Cette étape = spécification du schéma uniquement — **aucune connexion, migration ou génération de client**.

**À ne pas faire maintenant** : migrations, seed, connexion réelle, containers.

## 7. Stratégie future PostgreSQL

1. Configurer `DATABASE_URL` (via Docker Compose dans `setup/` — phase dédiée).
2. Installer / générer le client (`prisma generate`).
3. Créer et appliquer les migrations.
4. Implémenter les `Prisma*Repository`.
5. Passer `DATA_SOURCE=prisma`.

## 8. Stratégie future Docker

Le dossier `setup/` contient déjà Dockerfile / compose issus de `docker init`.

Cette phase **ne touche pas** Docker. Une étape ultérieure branchera PostgreSQL et l'application.

## 9. Stratégie d'authentification

- Un seul administrateur (`UserRole.ADMIN`).
- Types / guards / helpers dans `src/lib/auth`.
- Pages `/admin/login` et `/admin/dashboard` structurelles uniquement.
- Auth réelle (session, cookies, secret) dans une phase dédiée.
- Protection des routes admin via guards + futur `proxy` Next.js.

## 10. Conventions de nommage

- Fichiers : `kebab-case` pour les modules UI, `*.repository.ts` pour les repos.
- Types domaine : `PascalCase`.
- Constantes : `SCREAMING_SNAKE` ou `as const`.
- Alias : `@/*` → `src/*`.
- Langue UI : français.

## 11. Où placer une nouvelle fonctionnalité

1. Modèle dans `src/domain/<domaine>`.
2. Contrat repository + mock.
3. Service dans `src/services/<domaine>`.
4. UI dans `src/components/<domaine>` + page dans `src/app/...`.
5. Route API seulement si un client ou un webhook en a besoin.
6. Sécurité / validation dans `src/lib/security` et `src/lib/validation`.

## 12. Remplacer progressivement les mocks

1. Compléter le schéma Prisma et migrer.
2. Implémenter `PrismaXRepository` sans changer les interfaces.
3. Brancher dans `getXRepository()`.
4. Basculer `DATA_SOURCE=prisma`.
5. Retirer le badge mock de l'UI une fois la bascule validée.
6. Conserver les mocks pour tests / storybook si utile.

### Archives (`findArchive`)

Contrat prêt pour PostgreSQL :

- `q` + `scope` → `ILIKE` / full-text `to_tsvector`
- `date` / `year` → filtre sur `publicationDate`
- `theme` → `themes` (`String[]`)
- `sort` + `page` / `pageSize` → `orderBy` + `skip`/`take`

Voir `src/domain/meditation/archive.ts` et `MeditationRepository.findArchive`.

### Import documents

Voir [docs/IMPORT.md](./docs/IMPORT.md). Pipeline jusqu'à preview ; publication manuelle uniquement.

### Module Bible

Voir [docs/BIBLE.md](./docs/BIBLE.md). Parser / Resolver / Service ; traductions licenciées uniquement ; pas de redirection externe.

## Design system

Tokens dans `src/styles/globals.css` (palette sobre, accent doré, typographie IBM Plex, grille 8px, radius quasi nul). Inspiration Swiss International Typographic Style.
