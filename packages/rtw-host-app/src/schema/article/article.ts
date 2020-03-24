export interface ArticleParam {
  title: string;
  content: string;
  tags: string[];
  imageList: string[];
  createAt: string;
  from: string;
  to: string;
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
  tags: string[];
  images: Image[];
  createAt: string;
  updateAt: string;
  visitTimes: number;
}
