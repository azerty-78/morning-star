import type { NextConfig } from "next";
import path from "node:path";
import { fileURLToPath } from "node:url";

const projectRoot = path.dirname(fileURLToPath(import.meta.url));

const nextConfig: NextConfig = {
  // Image de production : serveur autonome, public/ et .next/static copiés par le Dockerfile.
  output: "standalone",
  outputFileTracingRoot: projectRoot,
  // Le dépôt git parent hors du projet peut faire ignorer le lockfile local.
  turbopack: {
    root: projectRoot,
  },
  poweredByHeader: false,
  // URLs propres — pas de trailing slash technique.
  trailingSlash: false,
  async redirects() {
    return [
      { source: "/about", destination: "/a-propos", permanent: true },
      { source: "/search", destination: "/archive", permanent: true },
    ];
  },
};

export default nextConfig;
