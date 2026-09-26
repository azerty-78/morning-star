/**
 * Types transverses partagés (réponses API, erreurs).
 */

export type DataSource = "mock" | "prisma";

export interface ApiErrorBody {
  error: string;
  code?: string;
}

export interface ApiSuccessBody<T> {
  data: T;
  meta?: {
    source: DataSource;
  };
}
