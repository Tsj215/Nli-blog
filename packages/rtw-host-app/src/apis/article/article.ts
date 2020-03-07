import * as S from '@/schema';
import { HOST, umiRequest } from '@/skeleton';

export async function newArticle(
  title: string,
  tags: string[],
  content: string,
) {
  const { status } = await umiRequest.post<{ status: string }>(
    `${HOST}/article/new`,
    {
      data: {
        title,
        tags,
        content,
      },
    },
  );

  return status === 'ok';
}

export async function getArticleList(
  pageNum: number,
  pageSize: number,
  article?: S.Article,
) {
  const { data } = await umiRequest.post<{ data: S.Article[] }>(
    `${HOST}/article/list`,
    {
      data: {
        pageNum,
        pageSize,
        article,
      },
    },
  );

  return data;
}
