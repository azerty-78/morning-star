"use client";

import Image from "next/image";
import { useCallback, useState } from "react";
import { BiblePassageDialog } from "@/components/bible/bible-passage-dialog";
import { Typography } from "@/components/ui";
import type {
  BiblePassage,
  BibleTranslation,
  ResolvedBibleReference,
} from "@/domain/bible";
import { APP_NAME } from "@/constants/app";
import { parseBibleReference, segmentParagraph } from "@/lib/bible";
import { cn } from "@/lib/utils";

const NAME = `Morning Star est le nom de l'étoile du matin. En français, cette page s'appelle À propos : elle dit d'où vient le nom, puis comment la publication se lit. Le nom anglais reste sur la porte. Le texte, lui, est en français.`;

const ORIGIN = `Le nom vient de l'Écriture. Dans Apocalypse 22:16, Jésus se désigne lui-même : « Je suis la racine et la postérité de David, l'étoile brillante du matin. » L'étoile du matin est la dernière lumière de la nuit. Elle ne remplace pas le jour : elle l'annonce. Cette publication tient son rythme de cette image — un texte, avant que la journée ne soit levée.`;

const LAMP = `Pierre reprend la même image. Dans 2 Pierre 1:19, la parole prophétique est une lampe dans un lieu obscur, jusqu'à ce que le jour paraisse et que l'étoile du matin se lève dans les cœurs. Lire, ici, c'est prêter attention à cette lampe.`;

const PROMISE = `La promesse va plus loin. À celui qui garde jusqu'à la fin ce que le Seigneur a donné, Apocalypse 2:28 dit : « je lui donnerai l'étoile du matin. » Le nom n'est pas une décoration. C'est une promesse reçue, pas un titre que l'on s'attribue.`;

const STAR_OF_JACOB = `Bien avant l'Apocalypse, Balaam voit déjà un astre. Nombres 24:17 : « Un astre sort de Jacob, un sceptre s'élève d'Israël. » L'attente d'un roi est dite avec la même lumière — celle qui précède le jour.`;

const DISTINCTION = `Un passage emploie une image voisine, et il ne faut pas les confondre. Ésaïe 14:12 parle d'un « astre brillant, fils de l'aurore » qui tombe : c'est le roi de Babylone, abattu, non le Christ. Morning Star se tient du côté de l'annonce, pas de la chute.`;

const PRACTICE = [
  `${APP_NAME} publie une méditation chrétienne chaque jour. Chaque texte est écrit pour être lu lentement : un titre, quelques paragraphes, une référence biblique que l'on ouvre sans quitter la page.`,
  `La veille et le lendemain restent à portée : méditation précédente, méditation suivante, archive. On peut chercher un mot, une date, un thème. On ne fait pas défiler un fil.`,
  `Il n'y a pas de commentaires publics, pas de redirection vers un site extérieur pour lire la Bible. La lecture reste ici.`,
  `L'auteur prépare, programme et publie seul. La newsletter envoie la méditation du jour à celles et ceux qui l'ont confirmée — un message, puis le silence.`,
];

const RHYTHM = [
  {
    title: "Un texte",
    note: "Pas une suite d'articles. Une méditation, écrite pour le matin.",
  },
  {
    title: "Un passage",
    note: "La référence s'ouvre sur la page. Le verset se lit ici.",
  },
  {
    title: "Puis le jour",
    note: "On s'arrête. L'étoile a annoncé. Elle n'a pas à tenir jusqu'au soir.",
  },
] as const;

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
  {
    label: "Ésaïe 14:12",
    note: "Un astre qui tombe : le roi de Babylone, non le Christ.",
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
      <div className="mx-auto flex w-full max-w-[var(--ms-container)] flex-col gap-4 px-[var(--ms-gutter)] pb-8 pt-4 sm:pt-6 lg:pb-10">
      <figure className="min-w-0">
        <div className="relative -mx-[var(--ms-gutter)] overflow-hidden md:mx-0 md:rounded-[22px]">
          <Image
            src="/about/dawn.jpg"
            alt="Un ciel pâle avant le jour, une étoile encore visible au-dessus des collines."
            width={1280}
            height={720}
            priority
            sizes="(min-width: 64rem) 72rem, 100vw"
            className="about-hero"
          />
          <header className="absolute inset-x-0 bottom-0 bg-gradient-to-t from-ms-black/80 via-ms-black/35 to-transparent px-[var(--ms-gutter)] pb-5 pt-14 md:px-7 md:pb-7 md:pt-20">
            <p className="mb-2 text-[13px] font-medium text-ms-black">
              La publication
            </p>
            <h1 className="max-w-[16ch] font-sans text-[clamp(2rem,5vw,2.75rem)] font-semibold leading-[var(--ms-leading-tight)] tracking-[var(--ms-tracking-tight)] text-white">
              À propos
            </h1>
            <p className="mt-2 max-w-[var(--ms-measure)] font-sans text-[clamp(1rem,2.4vw,1.25rem)] leading-snug text-white/90 sm:mt-3">
              Une méditation par jour, pour commencer la journée dans la Parole.
            </p>
          </header>
        </div>
        <figcaption className="pt-3">
          <Typography variant="meta">
            Avant le jour. L&apos;étoile reste ; le soleil n&apos;est pas encore
            levé.
          </Typography>
        </figcaption>
      </figure>

      <div className="grid grid-cols-1 items-start gap-4 md:grid-cols-12">

        <div className="flex min-w-0 flex-col gap-6 rounded-[22px] bg-white px-5 py-6 shadow-[0_1px_2px_rgba(26,26,26,0.05)] sm:px-7 md:col-span-7">
          <LinkedProse text={NAME} onOpen={openReference} />
          <LinkedProse text={ORIGIN} onOpen={openReference} />
          <LinkedProse text={LAMP} onOpen={openReference} />
        </div>

        <figure className="min-w-0 overflow-hidden rounded-[22px] bg-white shadow-[0_1px_2px_rgba(26,26,26,0.05)] md:col-span-5">
          <Image
            src="/about/reading.jpg"
            alt="Un livre ouvert près d'une fenêtre, à la première lumière du matin."
            width={1152}
            height={864}
            sizes="(min-width: 48rem) 28rem, 100vw"
            className="about-reading"
          />
          <figcaption className="px-5 py-3">
            <Typography variant="meta">
              La lecture du matin : une lampe, puis le jour.
            </Typography>
          </figcaption>
        </figure>
      </div>

        <section
          aria-labelledby="origine-ecriture"
          className="min-w-0 rounded-[22px] bg-white px-5 py-6 shadow-[0_1px_2px_rgba(26,26,26,0.05)] sm:px-7"
        >
          <Typography
            variant="label"
            as="h2"
            id="origine-ecriture"
            className="mb-4 text-ms-gold-dark"
          >
            Dans l&apos;Écriture
          </Typography>
          <ol className="grid grid-cols-1 gap-3 md:grid-cols-2">
            {INDEX.map((item, index) => (
              <li
                key={item.label}
                className="grid min-w-0 grid-cols-[2.5rem_1fr] gap-4 rounded-2xl bg-ms-cream-deep px-4 py-4"
              >
                <Typography variant="meta" as="span" className="pt-1">
                  {String(index + 1).padStart(2, "0")}
                </Typography>
                <div className="min-w-0">
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
          <div className="mt-8 grid grid-cols-1 gap-6 md:grid-cols-2 md:gap-x-10">
            <LinkedProse text={PROMISE} onOpen={openReference} />
            <LinkedProse text={STAR_OF_JACOB} onOpen={openReference} />
            <div className="md:col-span-2">
              <LinkedProse text={DISTINCTION} onOpen={openReference} />
            </div>
          </div>
        </section>

        <section
          aria-labelledby="le-rythme"
          className="min-w-0 rounded-[22px] bg-white px-5 py-6 shadow-[0_1px_2px_rgba(26,26,26,0.05)] sm:px-7"
        >
          <Typography
            variant="label"
            as="h2"
            id="le-rythme"
            className="mb-4 text-ms-gold-dark"
          >
            Le rythme
          </Typography>
          <ol className="grid grid-cols-1 gap-3 md:grid-cols-3">
            {RHYTHM.map((step, index) => (
              <li
                key={step.title}
                className="grid min-w-0 grid-cols-[2.5rem_1fr] gap-4 rounded-2xl bg-ms-cream-deep px-4 py-4 md:grid-cols-1 md:gap-2"
              >
                <span className="pt-0.5 text-[13px] font-medium text-ms-gold-dark">
                  {String(index + 1).padStart(2, "0")}
                </span>
                <div className="min-w-0">
                  <p className="text-[16px] font-semibold text-ms-black">
                    {step.title}
                  </p>
                  <p className="mt-1 text-[15px] leading-snug text-ms-gray-700">
                    {step.note}
                  </p>
                </div>
              </li>
            ))}
          </ol>
        </section>

        <section
          aria-labelledby="la-publication"
          className="min-w-0 rounded-[22px] bg-white px-5 py-6 shadow-[0_1px_2px_rgba(26,26,26,0.05)] sm:px-7"
        >
          <Typography
            variant="label"
            as="h2"
            id="la-publication"
            className="mb-4 text-ms-gold-dark"
          >
            Comment cela se lit
          </Typography>
          <div className="grid grid-cols-1 gap-6 md:grid-cols-2 md:gap-x-10">
            {PRACTICE.map((paragraph) => (
              <Typography key={paragraph.slice(0, 24)} variant="body">
                {paragraph}
              </Typography>
            ))}
          </div>
        </section>
      </div>

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
