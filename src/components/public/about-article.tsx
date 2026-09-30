"use client";

import Image from "next/image";
import { useCallback, useState } from "react";
import { BiblePassageDialog } from "@/components/bible/bible-passage-dialog";
import { Container, Typography } from "@/components/ui";
import type {
  BiblePassage,
  BibleTranslation,
  ResolvedBibleReference,
} from "@/domain/bible";
import { APP_NAME } from "@/constants/app";
import { parseBibleReference, segmentParagraph } from "@/lib/bible";
import { cn } from "@/lib/utils";

const ORIGIN = `Le nom Morning Star vient de là. Dans Apocalypse 22:16, Jésus se désigne lui-même : « Je suis la racine et la postérité de David, l'étoile brillante du matin. » L'étoile du matin est la dernière lumière de la nuit. Elle ne remplace pas le jour : elle l'annonce. Cette publication tient son rythme de cette image — un texte, avant que la journée ne soit levée.`;

const LAMP = `Pierre reprend la même image. Dans 2 Pierre 1:19, la parole prophétique est une lampe dans un lieu obscur, jusqu'à ce que le jour paraisse et que l'étoile du matin se lève dans les cœurs. Lire, ici, c'est prêter attention à cette lampe.`;

const PROMISE = `La promesse va plus loin. À celui qui garde jusqu'à la fin ce que le Seigneur a donné, Apocalypse 2:28 dit : « je lui donnerai l'étoile du matin. » Le nom n'est pas une décoration. C'est une promesse reçue, pas un titre que l'on s'attribue.`;

const STAR_OF_JACOB = `Bien avant l'Apocalypse, Balaam voit déjà un astre. Nombres 24:17 : « Un astre sort de Jacob, un sceptre s'élève d'Israël. » L'attente d'un roi est dite avec la même lumière — celle qui précède le jour.`;

const DISTINCTION = `Un passage emploie une image voisine, et il ne faut pas les confondre. Ésaïe 14:12 parle d'un « astre brillant, fils de l'aurore » qui tombe : c'est le roi de Babylone, abattu, non le Christ. Morning Star se tient du côté de l'annonce, pas de la chute.`;

const PRACTICE = [
  `${APP_NAME} publie une méditation chrétienne chaque jour. Chaque texte est écrit pour être lu lentement : un titre, quelques paragraphes, une référence biblique que l'on ouvre sans quitter la page.`,
  `Il n'y a pas de fil d'actualité, pas de commentaires publics bruyants, pas de redirection vers un site extérieur pour lire la Bible. La lecture reste ici.`,
  `L'auteur prépare, programme et publie seul. La newsletter envoie la méditation du jour à celles et ceux qui l'ont confirmée — un message, puis le silence.`,
];

const INDEX = [
  {
    label: "Apocalypse 22:16",
    note: "Jésus se nomme l'étoile brillante du matin.",
  },
  {
    label: "2 Pierre 1:19",
    note: "L'étoile du matin se lève dans les cœurs.",
  },
  {
    label: "Apocalypse 2:28",
    note: "La promesse faite à celui qui demeure fidèle.",
  },
  {
    label: "Nombres 24:17",
    note: "Un astre sort de Jacob.",
  },
] as const;

export interface AboutArticleProps {
  passages: Record<string, BiblePassage>;
  translations: BibleTranslation[];
  defaultTranslationCode: string;
}

export function AboutArticle({
  passages,
  translations,
  defaultTranslationCode,
}: AboutArticleProps) {
  const [activeRef, setActiveRef] = useState<ResolvedBibleReference | null>(
    null,
  );
  const [open, setOpen] = useState(false);

  const openReference = useCallback((reference: ResolvedBibleReference) => {
    setActiveRef(reference);
    setOpen(true);
  }, []);

  const openFromLabel = useCallback(
    (label: string) => {
      const parsed = parseBibleReference(label);
      if (parsed) openReference(parsed);
    },
    [openReference],
  );

  return (
    <article>
      <figure>
        <div className="relative">
          <Image
            src="/about/dawn.jpg"
            alt="Un ciel pâle avant le jour, une étoile encore visible au-dessus des collines."
            width={1280}
            height={720}
            priority
            className="about-hero"
          />
          <header className="absolute inset-x-0 bottom-0 bg-gradient-to-t from-ms-black/80 via-ms-black/35 to-transparent px-[var(--ms-gutter)] pb-8 pt-28">
            <div className="mx-auto w-full max-w-[var(--ms-container-narrow)]">
              <p className="mb-2 text-[13px] font-medium text-ms-gold-light">
                La publication
              </p>
              <h1 className="font-sans text-[length:var(--ms-text-3xl)] font-semibold leading-[var(--ms-leading-tight)] tracking-[var(--ms-tracking-tight)] text-white">
                À propos
              </h1>
              <p className="mt-3 max-w-[var(--ms-measure)] font-sans text-[length:var(--ms-text-lg)] leading-[var(--ms-leading-snug)] text-white/90">
                Une méditation par jour, pour commencer la journée dans la Parole.
              </p>
            </div>
          </header>
        </div>
        <figcaption className="mx-auto max-w-[var(--ms-container-narrow)] px-[var(--ms-gutter)] pt-3">
          <Typography variant="meta">
            Avant le jour. L&apos;étoile reste ; le soleil n&apos;est pas encore
            levé.
          </Typography>
        </figcaption>
      </figure>

      <Container narrow className="flex flex-col gap-4 pb-6 pt-6">

        <div className="flex flex-col gap-6 rounded-[22px] bg-white px-5 py-6 shadow-[0_1px_2px_rgba(26,26,26,0.05)] sm:px-7">
          <LinkedProse text={ORIGIN} onOpen={openReference} />
          <LinkedProse text={LAMP} onOpen={openReference} />
        </div>

        <figure className="overflow-hidden rounded-[22px] bg-white shadow-[0_1px_2px_rgba(26,26,26,0.05)]">
          <Image
            src="/about/reading.jpg"
            alt="Un livre ouvert près d'une fenêtre, à la première lumière du matin."
            width={1152}
            height={864}
            className="w-full"
          />
          <figcaption className="px-5 py-3">
            <Typography variant="meta">
              La lecture du matin : une lampe, puis le jour.
            </Typography>
          </figcaption>
        </figure>

        <section
          aria-labelledby="origine-ecriture"
          className="rounded-[22px] bg-white px-5 py-6 shadow-[0_1px_2px_rgba(26,26,26,0.05)] sm:px-7"
        >
          <Typography
            variant="label"
            as="h2"
            id="origine-ecriture"
            className="mb-4 text-ms-gold-dark"
          >
            Dans l&apos;Écriture
          </Typography>
          <ol className="overflow-hidden rounded-2xl bg-ms-cream-deep">
            {INDEX.map((item, index) => (
              <li
                key={item.label}
                className="grid grid-cols-[2.5rem_1fr] gap-4 border-b border-black/5 px-4 py-4 last:border-b-0"
              >
                <Typography variant="meta" as="span" className="pt-1">
                  0{index + 1}
                </Typography>
                <div>
                  <ReferenceButton
                    label={item.label}
                    onClick={() => openFromLabel(item.label)}
                  />
                  <Typography variant="body" className="mt-2">
                    {item.note}
                  </Typography>
                </div>
              </li>
            ))}
          </ol>
          <div className="mt-8 flex flex-col gap-6">
            <LinkedProse text={PROMISE} onOpen={openReference} />
            <LinkedProse text={STAR_OF_JACOB} onOpen={openReference} />
            <LinkedProse text={DISTINCTION} onOpen={openReference} />
          </div>
        </section>

        <section
          aria-labelledby="la-publication"
          className="rounded-[22px] bg-white px-5 py-6 shadow-[0_1px_2px_rgba(26,26,26,0.05)] sm:px-7"
        >
          <Typography
            variant="label"
            as="h2"
            id="la-publication"
            className="mb-4 text-ms-gold-dark"
          >
            Comment cela se lit
          </Typography>
          <div className="flex flex-col gap-6">
            {PRACTICE.map((paragraph) => (
              <Typography key={paragraph.slice(0, 24)} variant="body">
                {paragraph}
              </Typography>
            ))}
          </div>
        </section>
      </Container>

      <BiblePassageDialog
        open={open}
        onClose={() => setOpen(false)}
        reference={activeRef}
        translations={translations}
        defaultTranslationCode={defaultTranslationCode}
        passages={passages}
      />
    </article>
  );
}

function LinkedProse({
  text,
  onOpen,
}: {
  text: string;
  onOpen: (reference: ResolvedBibleReference) => void;
}) {
  const segments = segmentParagraph(text);

  return (
    <Typography variant="body">
      {segments.map((segment, index) => {
        if (segment.type === "text") {
          return (
            <span key={`t-${index}`}>{segment.value}</span>
          );
        }

        return (
          <ReferenceButton
            key={`r-${segment.key}-${index}`}
            label={segment.label}
            onClick={() => onOpen(segment.reference)}
          />
        );
      })}
    </Typography>
  );
}

function ReferenceButton({
  label,
  onClick,
}: {
  label: string;
  onClick: () => void;
}) {
  return (
    <button
      type="button"
      onClick={onClick}
      className={cn(
        "inline cursor-pointer border-0 border-b border-ms-gold bg-transparent p-0",
        "font-serif text-[length:inherit] text-ms-gold-dark",
        "hover:text-ms-black",
        "focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-ms-gold",
      )}
      aria-haspopup="dialog"
      aria-label={`Lire le passage ${label}`}
    >
      {label}
    </button>
  );
}
