# Design System — Morning Star

Direction artistique inspirée du **Swiss International Typographic Style** (Josef Müller-Brockmann), adaptée à une publication éditoriale contemporaine.

Morning Star n’est **pas** un produit SaaS. C’est une publication.

## Principes

1. **Fonction avant décoration** — chaque élément sert la lecture.
2. **Grille** — 12 colonnes, gutters constants, alignements explicites.
3. **Typographie forte** — la hiérarchie porte l’identité.
4. **Espaces blancs** — le vide structure autant que le plein.
5. **Contraste** — noir profond / blanc cassé ; accent doré rare.
6. **Géométrie** — filets, angles droits, asymétrie contrôlée.
7. **Sobriété** — aucun gradient, glassmorphism, blob, ombre lourde, carte arrondie.

## Identité chromatique

| Token | Valeur | Usage |
| --- | --- | --- |
| `--ms-black` | `#0a0a0a` | Texte, filets forts, boutons primaires |
| `--ms-off-white` | `#f3f2ee` | Fond de page |
| `--ms-paper` | `#faf9f6` | Surfaces / dialogs |
| `--ms-gray-*` | neutres | Hiérarchie secondaire |
| `--ms-gold` | `#a8872f` | Accent « Étoile du matin » — parcimonieux |

L’or n’est jamais un fond de section massif. Il marque : filet de citation, référence biblique, état actif, badge éditorial.

## Typographie

| Rôle | Usage |
| --- | --- |
| `display` | Titre de méditation / une |
| `title` | Titre de page |
| `subtitle` | Chapô / sous-titre |
| `lede` | Amorce longue |
| `body` | Corps de texte (mesure ~36rem) |
| `quote` | Citation (serif italique) |
| `reference` | Réf. biblique (serif, or sombre) |
| `nav` / `date` / `label` / `meta` | Métadonnées uppercase tracking large |

**Familles**

- Sans : Helvetica Neue / Helvetica (lignée Akzidenz) — UI + titres + corps.
- Serif : Georgia — citations et Bible uniquement.

## Spacing

Échelle **8px** : `--ms-space-1` … `--ms-space-11`.

Sémantique :

- `--ms-section-y` — respiration verticale de section
- `--ms-block-gap` — paragraphes
- `--ms-gutter` — marges latérales fluides

## Grille

- Conteneur : `--ms-container` (72rem)
- Mesure lecture : `--ms-measure` (36rem)
- Composants : `Container`, `Grid` / `GridItem` (12 cols)
- Utilitaire CSS : `.ms-grid-12`

Asymétrie typique (liste) : métadonnées colonnes 1–3, contenu 5–12.

## Composants

### UI (`src/components/ui`)

Button, Input (souligné), Textarea, Dialog, Badge, Separator, Container, Grid, Typography, PageHeader.

### Éditorial (`src/components/editorial`)

- `ArticleHeader` / `ArticleMeta` / `ArticleBody`
- `PullQuote` — filet or 3px
- `EditorialCard` / `EditorialCardList` — **pas** des cards SaaS (filets, grille, zero shadow)

### Bible (`src/components/bible`)

- `BibleReference` / `BibleReferenceList`

## Anti-patterns (interdits)

- Gradients décoratifs, glass, blobs
- `border-radius` > 0
- Ombres multi-couches
- Boutons « pill » géants
- Stats strips / icon rows marketing
- Illustrations religieuses décoratives

## Fichiers sources

- Tokens CSS : `src/styles/globals.css`
- Tokens TS (référence) : `src/styles/tokens.ts`
- Styleguide vivant : `/design-system`

## Évolution

Affiner palette et échelle typo dans une phase visuelle dédiée si besoin. Ne pas ajouter de tokens « pour le plaisir » — chaque variable doit servir un rôle éditorial clair.
