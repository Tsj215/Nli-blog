export interface ArticleParam {
  title: string;
  content: string;
  tags: string[];
  imageList: string[];
  createAt: string;
  from: string;
  to: string;
}

export class Article {
  id: number;
  title: string;
  content: string;
  tags: string[];
  imageList: string[];
  createAt: string;
}
