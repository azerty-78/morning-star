# Contribuer à Morning Star

## Prérequis

- Node.js LTS
- npm (package manager du projet)
- PostgreSQL / Docker : **pas requis** pour démarrer le frontend (mocks)

## Démarrage

```bash
npm install
npm run dev
```

Ouvrir [http://localhost:3000](http://localhost:3000).

## Scripts

| Script | Rôle |
| --- | --- |
| `npm run dev` | Serveur de développement |
| `npm run build` | Build production |
| `npm run lint` | ESLint |
| `npm run typecheck` | TypeScript strict |
| `npm run prisma:generate` | Générer le client Prisma (**après** configuration DB) |

## Règles essentielles

1. Lire `ARCHITECTURE.md` avant d'ajouter une fonctionnalité.
2. Ne pas placer de logique métier dans les composants React.
3. Passer par services + repositories.
4. Ne pas connecter Prisma / Docker tant que la phase dédiée n'est pas ouverte.
5. Ne pas modifier `setup/` sans brief infrastructure.
6. Marquer explicitement toute donnée mockée.
7. Respecter le design system (tokens CSS, style suisse, pas de décoration SaaS).
8. Accessibilité : labels, focus visible, HTML sémantique.
9. Pas de secrets dans le dépôt (utiliser `.env.example` comme modèle uniquement).
10. Préférer des changements petits et ciblés.

## Structure rapide

- Public : `src/app/(public)`
- Admin : `src/app/admin`
- Domaine : `src/domain`
- Données : `src/repositories` + `src/lib/mock`

## Pull requests

Décrire le « pourquoi », lister les routes touchées, et indiquer si des mocks ou Prisma sont concernés.
