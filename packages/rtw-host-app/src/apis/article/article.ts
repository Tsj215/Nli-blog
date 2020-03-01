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
