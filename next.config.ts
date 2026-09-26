import type { NextConfig } from "next";
import path from "node:path";
import { fileURLToPath } from "node:url";

const projectRoot = path.dirname(fileURLToPath(import.meta.url));

const nextConfig: NextConfig = {
  // Le dépôt git parent hors du projet peut faire ignorer le lockfile local.
  turbopack: {
    root: projectRoot,
  },
};

export default nextConfig;
