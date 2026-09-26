import type { Metadata } from "next";
import { IBM_Plex_Sans, IBM_Plex_Serif } from "next/font/google";
import { APP_DESCRIPTION, APP_NAME } from "@/constants/app";
import "@/styles/globals.css";

const plexSans = IBM_Plex_Sans({
  variable: "--font-ms-sans",
  subsets: ["latin"],
  weight: ["400", "500", "600", "700"],
  display: "swap",
});

const plexSerif = IBM_Plex_Serif({
  variable: "--font-ms-serif",
  subsets: ["latin"],
  weight: ["400", "600"],
  display: "swap",
  style: ["normal", "italic"],
});

export const metadata: Metadata = {
  title: {
    default: APP_NAME,
    template: `%s · ${APP_NAME}`,
  },
  description: APP_DESCRIPTION,
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="fr"
      className={`${plexSans.variable} ${plexSerif.variable} h-full`}
    >
      <body className="min-h-full flex flex-col font-sans antialiased">
        {children}
      </body>
    </html>
  );
}
