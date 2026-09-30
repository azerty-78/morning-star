"use client";

import { useId, useState, useTransition } from "react";
import { API_ROUTES } from "@/constants/routes";
import type { NewsletterPublicResult } from "@/domain/newsletter";
import { isValidEmail } from "@/lib/validation";

/**
 * Inscription newsletter — double opt-in, présentation iOS groupée.
 * L’API ne renvoie jamais l’adresse email.
 */
export function NewsletterSignup() {
  const formId = useId();
  const statusId = `${formId}-status`;
  const inputId = `${formId}-email`;
  const [email, setEmail] = useState("");
  const [error, setError] = useState<string | undefined>();
  const [message, setMessage] = useState<string | null>(null);
  const [pending, startTransition] = useTransition();

  function handleSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    const value = email.trim();

    if (!isValidEmail(value)) {
      setError("Indiquez une adresse email valide.");
      setMessage(null);
      return;
    }

    setError(undefined);
    startTransition(async () => {
      try {
        const res = await fetch(API_ROUTES.newsletterSubscribe, {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ email: value, source: "homepage" }),
        });
        const data = (await res.json()) as NewsletterPublicResult;
        if (!data.ok) {
          setError(data.message);
          setMessage(null);
          return;
        }
        setMessage(data.message);
        setEmail("");
      } catch {
        setError("Impossible d’enregistrer la demande pour le moment.");
        setMessage(null);
      }
    });
  }

  return (
    <section
      aria-labelledby="newsletter-heading"
      className="ios-ui rounded-[22px] bg-white px-5 py-6 shadow-[0_1px_2px_rgba(26,26,26,0.05)] sm:px-7 sm:py-8"
    >
      <p className="text-[13px] font-medium text-ms-gold-dark">Newsletter</p>
      <h2
        id="newsletter-heading"
        className="mt-1 text-[28px] font-semibold leading-tight tracking-tight text-ms-black"
      >
        Recevoir la méditation
      </h2>
      <p className="mt-2 max-w-xl text-[17px] leading-snug text-ms-gray-700">
        Un envoi par jour, sans bruit. Confirmation par email, désinscription
        possible à tout moment.
      </p>

      <form
        onSubmit={handleSubmit}
        className="mt-6 flex flex-col gap-3 sm:flex-row sm:items-center"
        noValidate
        aria-describedby={statusId}
      >
        <div className="min-w-0 flex-1">
          <label htmlFor={inputId} className="sr-only">
            Adresse email
          </label>
          <input
            id={inputId}
            name="email"
            type="email"
            autoComplete="email"
            inputMode="email"
            required
            placeholder="Adresse email"
            value={email}
            disabled={pending}
            aria-invalid={Boolean(error) || undefined}
            onChange={(event) => {
              setEmail(event.target.value);
              if (error) setError(undefined);
              if (message) setMessage(null);
            }}
            className="h-12 w-full rounded-full border border-ms-gold/30 bg-ms-cream-deep px-4 text-[17px] text-ms-black outline-none placeholder:text-ms-gray-500 focus-visible:border-ms-gold focus-visible:ring-2 focus-visible:ring-ms-gold/40"
          />
        </div>
        <button
          type="submit"
          disabled={pending}
          className="h-12 shrink-0 cursor-pointer rounded-full bg-ms-gold px-5 text-[17px] font-semibold text-ms-black transition-colors hover:bg-ms-gold-dark hover:text-white disabled:cursor-not-allowed disabled:opacity-40"
        >
          {pending ? "Envoi…" : "S'abonner"}
        </button>
      </form>

      <p
        id={statusId}
        role="status"
        aria-live="polite"
        className="mt-3 min-h-5 text-[15px] text-ms-gray-600"
      >
        {error ?? message}
      </p>
    </section>
  );
}
