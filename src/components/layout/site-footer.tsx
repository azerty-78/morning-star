import { APP_NAME } from "@/constants/app";
import { Container } from "@/components/ui";

export function SiteFooter() {
  return (
    <footer className="mt-auto border-t border-ms-border">
      <Container className="flex flex-col gap-2 py-8 md:flex-row md:items-center md:justify-between">
        <p className="text-xs uppercase tracking-[0.14em] text-ms-muted">
          {APP_NAME}
        </p>
        <p className="text-sm text-ms-muted">
          Publication éditoriale · méditations quotidiennes
        </p>
      </Container>
    </footer>
  );
}
