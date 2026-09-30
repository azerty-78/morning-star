import { BrandLogo } from "@/components/brand";
import { Container } from "@/components/ui";

export const metadata = {
  title: "Connexion admin",
};

/**
 * Formulaire structurel uniquement.
 * L'authentification réelle sera branchée ultérieurement.
 */
export default function AdminLoginPage() {
  return (
    <div className="ios-ui min-h-screen bg-ms-cream-deep">
      <Container narrow className="flex min-h-screen items-center py-10">
      <section className="w-full overflow-hidden rounded-3xl bg-white shadow-[0_1px_2px_rgba(26,26,26,0.05)]">
        <div className="flex flex-col items-center px-6 pb-2 pt-8">
          <span className="brand-mark brand-mark--login">
            <BrandLogo decorative mark />
          </span>
          <h1 className="mt-4 text-[28px] font-semibold tracking-tight text-ms-black">
            Connexion
          </h1>
          <p className="mt-1 text-center text-[15px] text-ms-gray-600">
            Accès réservé à l’auteur. L’authentification n’est pas encore active.
          </p>
        </div>
        <form className="mt-4 border-t border-ms-gold/15" aria-describedby="auth-note">
          <label className="flex items-center justify-between gap-4 border-b border-black/5 px-5 py-3">
            <span className="text-[15px] text-ms-gray-600">Email</span>
            <input
              name="email"
              type="email"
              autoComplete="username"
              required
              disabled
              placeholder="auteur@morningstar"
              className="w-1/2 bg-transparent text-right text-[16px] text-ms-black outline-none placeholder:text-ms-gray-400"
            />
          </label>
          <label className="flex items-center justify-between gap-4 px-5 py-3">
            <span className="text-[15px] text-ms-gray-600">Mot de passe</span>
            <input
              name="password"
              type="password"
              autoComplete="current-password"
              required
              disabled
              placeholder="••••••••"
              className="w-1/2 bg-transparent text-right text-[16px] text-ms-black outline-none placeholder:text-ms-gray-400"
            />
          </label>
          <div className="px-5 pb-5 pt-2">
            <button
              type="submit"
              disabled
              className="h-11 w-full cursor-not-allowed rounded-full bg-ms-gold/50 text-[16px] font-semibold text-ms-black/60"
            >
              Se connecter
            </button>
            <p id="auth-note" className="mt-3 text-center text-[12px] leading-snug text-ms-gray-600">
              Champs désactivés tant que l’authentification n’est pas branchée.
            </p>
          </div>
        </form>
      </section>
    </Container>
    </div>
  );
}
