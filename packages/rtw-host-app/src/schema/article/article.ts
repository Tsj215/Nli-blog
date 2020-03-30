import { Tag } from './tag';
export interface ArticleParam {
  title: string;
  content: string;
  tags: Tag[];
  imageList: string[];
  createAt: string;
  from: string;
  to: string;
  orderBy: 'createAt' | 'visiTime';
}

export class CountArticle {
  date: string;
  count: string;
}

export interface Image {
  id?: number;
  name: string;
  url: string;
}

export class Article {
  id: number;
  title: string;
  content: string;
  tags: Tag[];
  images: Image[];
  createAt: string;
  updateAt: string;
  visitTimes: number;
}
