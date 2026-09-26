import Link from "next/link";
import { APP_NAME } from "@/constants/app";
import { ADMIN_ROUTES } from "@/constants/routes";
import { Container } from "@/components/ui";

export default function AdminLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <div className="flex min-h-full flex-col bg-ms-white">
      <header className="border-b border-ms-black">
        <Container className="flex items-center justify-between py-4">
          <div>
            <p className="text-xs uppercase tracking-[0.14em] text-ms-muted">
              Espace administrateur
            </p>
            <Link
              href={ADMIN_ROUTES.dashboard}
              className="text-lg font-semibold no-underline"
            >
              {APP_NAME}
            </Link>
          </div>
          <Link
            href={ADMIN_ROUTES.login}
            className="text-xs uppercase tracking-[0.14em] no-underline hover:text-ms-accent-muted"
          >
            Connexion
          </Link>
        </Container>
      </header>
      <main className="flex-1">{children}</main>
    </div>
  );
}
