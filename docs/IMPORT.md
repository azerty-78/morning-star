# Pipeline d'import Morning Star

## Objectif

Transformer un document brut (PDF / DOC / DOCX) en **preview éditoriale structurée**, sans publication automatique.

## Pipeline

```
UPLOAD
→ VALIDATION
→ EXTRACTION
→ NORMALISATION
→ ANALYSE
→ STRUCTURATION
→ DÉTECTION RÉFÉRENCES BIBLIQUES
→ NETTOYAGE (Blogspot)
→ PREVIEW
→ VALIDATION ADMIN
→ PUBLICATION | PROGRAMMATION
```

Les deux dernières étapes sont **explicites** (actions admin). Le pipeline s'arrête à `PREVIEW` / `AWAITING_REVIEW`.

## Abstractions

| Classe | Rôle |
| --- | --- |
| `DocumentParser` | Contrat d'extraction |
| `PdfParser` | PDF (fallback mock tant que lib absente) |
| `WordParser` | DOC / DOCX (idem) |
| `ContentNormalizer` | Espaces, césures, fins de ligne |
| `ContentAnalyzer` | Heuristiques titre / corps |
| `MeditationStructurer` | Preview structurée |
| `BibleReferenceDetector` | Refs bibliques (formats souples) |
| `BlogspotLinkCleaner` | Suppression des liens Blogspot |
| `DocumentValidator` | Type / taille fichier |
| `ImportPipeline` | Orchestration jusqu'à PREVIEW |
| `ImportService` | Approve / reject / publish / schedule |

## Emplacements

- Domaine : `src/domain/import`
- Pipeline : `src/lib/import`
- Service : `src/services/import`
- UI : `src/components/editor`, `/admin/import`
- API : `/api/admin/import`

## Amélioration progressive

Les parsers exposent `extractWithLibrary()` (retourne `null` → mock). Brancher pdf.js / mammoth sans changer le pipeline.

## Blogspot

Tout URL `*.blogspot.*` (brut ou markdown) est retiré du contenu final et listé dans la preview (`removedBlogspotLinks`).
