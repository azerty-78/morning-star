/**
 * Stockage fichiers (PDF/DOCX) — emplacement réservé.
 * Provider concret (S3, local, etc.) à brancher via STORAGE_PROVIDER.
 */

export type StorageProvider = "local" | "s3" | "none";

export function getStorageProvider(): StorageProvider {
  const value = process.env.STORAGE_PROVIDER;
  if (value === "local" || value === "s3") return value;
  return "none";
}
