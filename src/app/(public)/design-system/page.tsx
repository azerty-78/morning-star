import {
  ArticleBody,
  ArticleHeader,
  EditorialCard,
  EditorialCardList,
  PullQuote,
} from "@/components/editorial";
import { BibleReferenceList } from "@/components/bible";
import {
  Badge,
  Button,
  Container,
  Grid,
  GridItem,
  Input,
  PageHeader,
  Separator,
  Textarea,
  Typography,
} from "@/components/ui";

export const metadata = {
  title: "Design System",
};

/**
 * Styleguide minimal — fondations visuelles uniquement.
 * Pas une page produit.
 */
export default function DesignSystemPage() {
  return (
    <Container className="pb-[var(--ms-space-10)]">
      <PageHeader
        eyebrow="Fondations"
        title="Design System"
        description="Publication éditoriale suisse — tokens, typographie, composants réutilisables."
      />

      <section className="mt-[var(--ms-space-8)]">
        <Typography variant="label" className="mb-4 text-ms-gold-dark">
          Couleurs
        </Typography>
        <Grid cols={4} gap="sm">
          {[
            ["Black", "bg-ms-black"],
            ["Off-white", "bg-ms-off-white border border-ms-border"],
            ["Gray 500", "bg-ms-gray-500"],
            ["Gold", "bg-ms-gold"],
          ].map(([label, cls]) => (
            <div key={label}>
              <div className={`h-16 ${cls}`} />
              <Typography variant="meta" className="mt-2">
                {label}
              </Typography>
            </div>
          ))}
        </Grid>
      </section>

      <Separator className="my-[var(--ms-space-8)]" />

      <section>
        <Typography variant="label" className="mb-6 text-ms-gold-dark">
          Typographie
        </Typography>
        <div className="flex flex-col gap-6">
          <Typography variant="display">Display</Typography>
          <Typography variant="title" as="h2">
            Title
          </Typography>
          <Typography variant="subtitle">Subtitle — chapô éditorial</Typography>
          <Typography variant="lede">
            Lede — amorce qui introduit la méditation du jour.
          </Typography>
          <Typography variant="body" className="ms-measure">
            Body — le texte courant privilégie une mesure lisible, un interlignage
            généreux et une absence totale de décoration parasite.
          </Typography>
          <Typography variant="quote">
            « Je suis l&apos;étoile brillante du matin. »
          </Typography>
          <Typography variant="reference">Apocalypse 22:16</Typography>
          <Typography variant="date">Samedi 26 septembre 2026</Typography>
          <Typography variant="nav">Navigation</Typography>
          <Typography variant="meta">Métadonnée secondaire</Typography>
        </div>
      </section>

      <Separator className="my-[var(--ms-space-8)]" />

      <section>
        <Typography variant="label" className="mb-6 text-ms-gold-dark">
          Boutons & badges
        </Typography>
        <div className="flex flex-wrap items-center gap-3">
          <Button variant="primary">Primaire</Button>
          <Button variant="secondary">Secondaire</Button>
          <Button variant="ghost">Ghost</Button>
          <Button variant="accent">Accent</Button>
          <Button variant="link">Lien</Button>
          <Badge>Neutre</Badge>
          <Badge tone="accent">Accent</Badge>
          <Badge tone="inverted">Inversé</Badge>
        </div>
      </section>

      <Separator className="my-[var(--ms-space-8)]" />

      <section className="max-w-md">
        <Typography variant="label" className="mb-6 text-ms-gold-dark">
          Formulaires
        </Typography>
        <div className="flex flex-col gap-6">
          <Input label="Email" name="demo-email" placeholder="vous@exemple.com" />
          <Textarea label="Message" name="demo-message" placeholder="Votre texte…" />
        </div>
      </section>

      <Separator className="my-[var(--ms-space-8)]" />

      <section>
        <Typography variant="label" className="mb-6 text-ms-gold-dark">
          Grille 12 — asymétrie
        </Typography>
        <Grid cols={12} className="border border-ms-border">
          <GridItem span={3} className="bg-ms-gray-100 p-4">
            <Typography variant="meta">3 cols</Typography>
          </GridItem>
          <GridItem span={1} className="hidden md:block" />
          <GridItem span={8} className="bg-ms-paper p-4 border-l border-ms-border">
            <Typography variant="meta">8 cols (décalage)</Typography>
          </GridItem>
        </Grid>
      </section>

      <Separator className="my-[var(--ms-space-8)]" />

      <section>
        <Typography variant="label" className="mb-6 text-ms-gold-dark">
          Article
        </Typography>
        <ArticleHeader
          title="L'étoile du matin"
          subtitle="Une lumière qui précède le jour"
          date="2026-09-26"
          badge="Exemple"
        />
        <PullQuote cite="Apocalypse 22:16" className="mt-8">
          Je suis la racine et la postérité de David, l&apos;étoile brillante du
          matin.
        </PullQuote>
        <BibleReferenceList
          className="mt-6"
          compact
          references={[
            { label: "Apocalypse 22:16" },
            { label: "2 Pierre 1:19" },
          ]}
        />
        <ArticleBody
          className="mt-8"
          content={`Il y a des matins où l'horizon paraît encore fermé. Pourtant, une étoile brille déjà — discrète, précise, certaine.

Cette lumière n'impose pas. Elle indique.`}
        />
      </section>

      <Separator className="my-[var(--ms-space-8)]" />

      <section>
        <Typography variant="label" className="mb-6 text-ms-gold-dark">
          Cartes éditoriales
        </Typography>
        <EditorialCardList>
          <EditorialCard
            href="/meditations/letoile-du-matin"
            title="L'étoile du matin"
            excerpt="Avant que le jour ne se lève, une lumière discrète annonce déjà la promesse."
            date="2026-09-26"
            index="01"
          />
          <EditorialCard
            href="/meditations/le-silence-qui-forme"
            title="Le silence qui forme"
            excerpt="Le silence n'est pas un vide : c'est un espace où la Parole peut prendre racine."
            date="2026-09-25"
            index="02"
          />
        </EditorialCardList>
      </section>
    </Container>
  );
}
