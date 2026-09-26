import { Container, Input, PageHeader, Typography } from "@/components/ui";
import { MeditationList } from "@/components/meditation";
import { createMeditationService } from "@/services/meditation";
import { Button } from "@/components/ui/button";

export const metadata = {
  title: "Recherche",
};

interface PageProps {
  searchParams: Promise<{ q?: string }>;
}

export default async function RecherchePage({ searchParams }: PageProps) {
  const { q = "" } = await searchParams;
  const results = q
    ? await createMeditationService().search(q)
    : [];

  return (
    <Container className="pb-16">
      <PageHeader
        eyebrow="Explorer"
        title="Recherche"
        description="Rechercher dans les méditations publiées."
      />

      <form
        action="/recherche"
        method="get"
        className="mt-10 flex max-w-xl flex-col gap-4 sm:flex-row sm:items-end"
      >
        <div className="flex-1">
          <Input
            name="q"
            label="Requête"
            defaultValue={q}
            placeholder="Ex. lumière, silence…"
          />
        </div>
        <Button type="submit" variant="primary">
          Rechercher
        </Button>
      </form>

      <div className="mt-12">
        {q ? (
          results.length > 0 ? (
            <MeditationList meditations={results} />
          ) : (
            <Typography variant="meta">
              Aucun résultat pour « {q} ».
            </Typography>
          )
        ) : (
          <Typography variant="meta">
            Saisissez un terme pour lancer une recherche.
          </Typography>
        )}
      </div>
    </Container>
  );
}
