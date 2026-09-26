export interface Comment {
  id: string;
  meditationId: string;
  authorName: string;
  authorEmail?: string;
  body: string;
  approved: boolean;
  createdAt: Date;
}
