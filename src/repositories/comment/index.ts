import type { Comment } from "@/domain/comment";

export interface CommentRepository {
  findByMeditationId(meditationId: string): Promise<Comment[]>;
}

/** Stub mock minimal — commentaires métier plus tard. */
export class MockCommentRepository implements CommentRepository {
  async findByMeditationId(): Promise<Comment[]> {
    return [];
  }
}
