import { DocumentDropzone } from "@/components/editor";
import { Container } from "@/components/ui";

export const metadata = {
  title: "Import",
};

const STEPS = [
  "Dépôt",
  "Validation",
  "Extraction",
  "Analyse",
  "Preview",
  "Publication",
];

export default function AdminImportPage() {
  return (
    <Container className="ios-ui space-y-4 py-4 pb-[var(--ms-space-10)]">
      <p className="text-[13px] text-ms-gray-600">
        Le document devient une preview. Rien n’est publié tout seul.
      </p>
      <DocumentDropzone />
      <ol className="overflow-hidden rounded-3xl bg-white shadow-[0_1px_2px_rgba(26,26,26,0.05)]">
        {STEPS.map((step, index) => (
          <li
            key={step}
            className="flex items-center gap-3 border-b border-black/5 px-4 py-3 last:border-b-0"
          >
            <span className="flex h-7 w-7 items-center justify-center rounded-full bg-ms-gold/20 text-[13px] font-semibold text-ms-gold-dark">
              {index + 1}
            </span>
            <span className="text-[16px] font-medium text-ms-black">{step}</span>
          </li>
        ))}
      </ol>
    </Container>
  );
}
