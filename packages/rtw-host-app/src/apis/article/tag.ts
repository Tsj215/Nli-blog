import * as S from '@/schema';
import { HOST, umiRequest } from '@/skeleton';

/** 获取所有标签 */
export async function getTagList() {
  const { data } = await umiRequest.get<{ data: S.Tag[] }>(`${HOST}/tags`);

  return data;
}

/** 新增标签 */
export async function newTag(tagName: string) {
  const { status } = await umiRequest.post<{ status: string }>(`${HOST}/tags`, {
    data: { tagName },
  });

  return status === 'ok';
}

/** 删除标签 */
export async function deleteTag(tagId: number) {
  const { status } = await umiRequest.delete<{ status: string }>(
    `${HOST}/tags/${tagId}`,
  );

  return status === 'ok';
}

/** 更新标签 */
export async function updateTag(tagId: number, _tagName: string) {
  const { status } = await umiRequest.patch<{ status: string }>(
    `${HOST}/tags/${tagId}/${_tagName}`,
  );

  return status === 'ok';
}

/** 获取 tag 对应 articleId */
export async function archiveTags() {
  const { data } = await umiRequest.get<{ data: S.ArchiveTag[] }>(
    `${HOST}/tags/articleCount`,
  );
  return data;
}
