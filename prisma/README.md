# Prisma — Morning Star

## État actuel

Le fichier `schema.prisma` décrit le **modèle de données cible** PostgreSQL.

À ce stade :

- **aucune** connexion réelle à PostgreSQL ;
- **aucune** migration exécutée ;
- **aucun** `prisma generate` requis pour faire tourner l’app (mocks) ;
- **aucun** container Docker lancé.

## Quand brancher

1. Installer `prisma` + `@prisma/client` si absents.
2. Renseigner `DATABASE_URL` (phase Docker / Postgres).
3. `npx prisma migrate dev` (première migration).
4. Ajouter la colonne / index FTS documentés dans les commentaires du schéma.
5. Implémenter les `Prisma*Repository` et passer `DATA_SOURCE=prisma`.

## Mapping domaine actuel → schéma

| Domaine app (mocks) | Prisma |
| --- | --- |
| `DailyMeditation` | `Article` (`PublicationType.DAILY_MEDITATION`) |
| `body` | `ArticleContent.plainText` (+ `structured`) |
| `bibleReferences` | `Article.bibleReferences` (Json) |
| `themes` | `Article.themes` |

Le domaine TypeScript peut rester nommé « meditation » en V1 ; le repository Prisma fera le mapping.
