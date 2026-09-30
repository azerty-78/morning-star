import { readFile } from "node:fs/promises";
import path from "node:path";

/** Fichier source du logo (carré, fond clair). */
export const LOGO_PUBLIC_PATH = "/logo.png";
export const LOGO_INTRINSIC_SIZE = 1254;

export async function loadLogoDataUrl(): Promise<string> {
  const file = path.join(process.cwd(), "public", "logo.png");
  const buffer = await readFile(file);
  return `data:image/png;base64,${buffer.toString("base64")}`;
}
