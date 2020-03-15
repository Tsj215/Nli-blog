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
  article?: S.ArticleParam,
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

export async function deleteArticle(id: number) {
  const { status } = await umiRequest.delete<{ status: string }>(
    `${HOST}/article/delete/${id}`,
  );

  return status === 'ok';
}

export async function getArticleById(id: number) {
  const { data } = await umiRequest.get<{ data: S.Article }>(
    `${HOST}/article/${id}`,
  );

  return data;
}

export async function updateArticle(
  id: number,
  title: string,
  tags: string[],
  content: string,
) {
  const { status } = await umiRequest.patch<{ status: string }>(
    `${HOST}/article/update/${id}`,
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
