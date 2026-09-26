import type { BibleVerse } from "@/domain/bible";
import { mockBibleVerses } from "@/lib/mock";

export interface BibleRepository {
  findVerseById(id: string): Promise<BibleVerse | null>;
  listSampleVerses(): Promise<BibleVerse[]>;
}

export class MockBibleRepository implements BibleRepository {
  async findVerseById(id: string): Promise<BibleVerse | null> {
    return mockBibleVerses.find((v) => v.id === id) ?? null;
  }

  async listSampleVerses(): Promise<BibleVerse[]> {
    return mockBibleVerses;
  }
}
