import type { AnalyticsRepository } from "./analytics.repository";

const NOT_WIRED =
  "PrismaAnalyticsRepository n'est pas encore branché. Utilisez DATA_SOURCE=mock.";

export class PrismaAnalyticsRepository implements AnalyticsRepository {
  async record(): Promise<never> {
    throw new Error(NOT_WIRED);
  }
  async findRecent(): Promise<null> {
    throw new Error(NOT_WIRED);
  }
  async listSince(): Promise<never[]> {
    throw new Error(NOT_WIRED);
  }
  async listAll(): Promise<never[]> {
    throw new Error(NOT_WIRED);
  }
  async countPeriod(): Promise<never> {
    throw new Error(NOT_WIRED);
  }
  async countByMeditation(): Promise<never[]> {
    throw new Error(NOT_WIRED);
  }
  async dailyBuckets(): Promise<never[]> {
    throw new Error(NOT_WIRED);
  }
}
