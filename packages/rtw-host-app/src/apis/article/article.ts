import * as S from '@/schema';
import { HOST, umiRequest } from '@/skeleton';

export async function newArticle(
  title: string,
  tags: string[],
  content: string,
  imageList: S.Image[],
) {
  const { status } = await umiRequest.post<{ status: string }>(
    `${HOST}/article/new`,
    {
      data: {
        article: {
          title,
          tags,
          content,
        },
        imageList,
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

export async function getArticleByTags(
  pageNum: number,
  pageSize: number,
  tags?: string[],
) {
  const { data } = await umiRequest.post<{ data: S.Article[] }>(
    `${HOST}/article/list/tags`,
    {
      data: { pageNum, pageSize, tags },
    },
  );

  return data;
}

export async function updateArticleImageList(
  articleId: number,
  imageList: S.Image[],
) {
  const { data } = await umiRequest.post<{ data: any }>(
    `${HOST}/article/imageList/${articleId}`,
    {
      data: { imageList },
    },
  );

  return data;
}
