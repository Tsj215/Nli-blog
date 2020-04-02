import { Article } from './article';

export class Tag {
  id: number;
  content: string;
}

export interface ArchiveTag {
  id: number;
  content: string;
  articles: Article[];
}
