import type { Metadata, Viewport } from "next";
import { SkipLink } from "@/components/seo";
import { buildRootMetadata } from "@/lib/seo";
import "@/styles/globals.css";

export const metadata: Metadata = buildRootMetadata();

export const viewport: Viewport = {
  themeColor: "#f3f2ee",
  colorScheme: "light",
  width: "device-width",
  initialScale: 1,
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="fr" className="h-full">
      <body className="min-h-full flex flex-col font-sans antialiased">
        <SkipLink />
        {children}
      </body>
    </html>
  );
}
