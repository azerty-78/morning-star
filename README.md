# Morning Star

Plateforme éditoriale de méditations chrétiennes quotidiennes.

## Stack

- Next.js 16 (App Router) · React 19 · TypeScript · Tailwind CSS 4
- Prisma + PostgreSQL *(préparés, non connectés à cette étape)*
- Docker *(présent dans `setup/`, non configuré pour Postgres encore)*

## Démarrage (sans base de données)

```bash
npm install
npm run dev
```

Les données affichées sont **mockées** (`DATA_SOURCE=mock` par défaut). Voir `.env.example`.

## Documentation

- [ARCHITECTURE.md](./ARCHITECTURE.md) — architecture et conventions
- [CONTRIBUTING.md](./CONTRIBUTING.md) — règles de développement

## Espaces

| URL | Rôle |
| --- | --- |
| `/` | Méditation du jour |
| `/meditations` | Liste |
| `/archive` | Archive |
| `/recherche` | Recherche |
| `/admin/login` | Connexion (structurelle) |
| `/admin/dashboard` | Dashboard (structurel) |
| `/api/health` | Health check |

## Important

Ne pas lancer Docker / PostgreSQL pour cette phase. Le dossier `setup/` est réservé à une étape ultérieure.
