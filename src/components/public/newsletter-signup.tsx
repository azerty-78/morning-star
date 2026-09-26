"use client";

import { useId, useState, useTransition } from "react";
import { Button, Grid, GridItem, Input, Typography } from "@/components/ui";
import { isValidEmail } from "@/lib/validation";

/**
 * Inscription newsletter — structure éditoriale.
 * Backend réel à brancher ultérieurement (mock pour l'instant).
 */
export function NewsletterSignup() {
  const formId = useId();
  const statusId = `${formId}-status`;
  const [email, setEmail] = useState("");
  const [error, setError] = useState<string | undefined>();
  const [status, setStatus] = useState<"idle" | "ok">("idle");
  const [pending, startTransition] = useTransition();

  function handleSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    const value = email.trim();

    if (!isValidEmail(value)) {
      setError("Indiquez une adresse email valide.");
      setStatus("idle");
      return;
    }

    setError(undefined);
    startTransition(() => {
      // Stub : pas d’API newsletter à cette étape.
      setStatus("ok");
      setEmail("");
    });
  }

  return (
    <section
      aria-labelledby="newsletter-heading"
      className="border-y border-ms-black py-[var(--ms-space-8)]"
    >
      <Grid cols={12} gap="lg">
        <GridItem span={12} className="md:col-span-4">
          <Typography variant="label" className="mb-3 text-ms-gold-dark">
            Newsletter
          </Typography>
          <Typography id="newsletter-heading" variant="title" as="h2">
            Recevoir la méditation
          </Typography>
        </GridItem>

        <GridItem span={12} className="md:col-span-7 md:col-start-6">
          <Typography variant="lede" className="max-w-[var(--ms-measure)]">
            Un envoi par jour, sans bruit. Désinscription possible à tout moment.
          </Typography>

          <form
            onSubmit={handleSubmit}
            className="mt-8 flex flex-col gap-6 sm:flex-row sm:items-end"
            noValidate
          >
            <div className="min-w-0 flex-1">
              <Input
                name="email"
                type="email"
                label="Adresse email"
                autoComplete="email"
                inputMode="email"
                required
                value={email}
                error={error}
                onChange={(e) => {
                  setEmail(e.target.value);
                  if (error) setError(undefined);
                  if (status === "ok") setStatus("idle");
                }}
                disabled={pending}
              />
            </div>
            <Button type="submit" variant="primary" disabled={pending}>
              {pending ? "Envoi…" : "S'abonner"}
            </Button>
          </form>

          <p
            id={statusId}
            role="status"
            aria-live="polite"
            className="mt-4 text-[length:var(--ms-text-sm)] text-ms-muted"
          >
            {status === "ok"
              ? "Demande enregistrée (démonstration). Le service email sera branché ultérieurement."
              : null}
          </p>
        </GridItem>
      </Grid>
    </section>
  );
}
