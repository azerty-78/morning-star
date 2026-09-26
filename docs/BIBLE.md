# Module Bible — Morning Star

## Principes

1. **Indépendance de la traduction** — livres canoniques (`canonicalId`), versets liés à une `BibleTranslation`.
2. **Lecture interne uniquement** — aucune redirection vers une Bible en ligne.
3. **Licence d'abord** — aucun texte protégé embarqué sans vérification.

## Couches

| Couche | Rôle |
| --- | --- |
| `domain/bible` | `BibleTranslation`, `BibleBook`, `BibleVerse`, résolution |
| `BibleReferenceParser` | Parse / détecte « Jean 3:16 », « Psaume 23 », etc. |
| `BibleReferenceResolver` | → translation + book + chapter + verses + statut |
| `BibleService` | Façade métier |
| `BibleTranslationImporter` | Import de packs **autorisés** uniquement |
| UI | `BibleReference`, `BiblePassageDialog` |

## Traductions d'exemple (métadonnées)

| Code | Statut |
| --- | --- |
| `LSG1910` | Domaine public — extraits démo minimaux |
| `LSG1990` | Restreint — **pas de texte** tant que licence non vérifiée |
| `BDS` | Restreint — **pas de texte** tant que licence non vérifiée |

## Résolution

```ts
const result = await bibleService.resolve("Jean 3:16", "LSG1910");
// result.status: OK | INVALID_REFERENCE | LICENSE_BLOCKED | IMPORT_REQUIRED | PASSAGE_NOT_FOUND | …
```

API : `GET /api/bible/resolve?q=Jean+3:16&translation=LSG1910`

## Import autorisé

Utiliser `assertImportAllowed(manifest)` avant tout chargement de versets.
Refus automatique si `licenseVerified === false` ou `licenseKind` restricted/unknown.
