import { APP_NAME } from "@/constants/app";
import { Container, Separator } from "@/components/ui";

export function SiteFooter() {
  return (
    <footer className="mt-auto">
      <Separator tone="default" />
      <Container className="flex flex-col gap-2 py-8 md:flex-row md:items-center md:justify-between">
        <p className="text-[length:var(--ms-text-2xs)] uppercase tracking-[var(--ms-tracking-widest)] text-ms-muted">
          {APP_NAME}
        </p>
        <p className="text-[length:var(--ms-text-sm)] text-ms-muted">
          Publication éditoriale · méditations quotidiennes
        </p>
      </Container>
    </footer>
  );
}
