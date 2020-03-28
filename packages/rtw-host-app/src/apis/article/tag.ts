import { HOST, umiRequest } from '@/skeleton';

/** 获取所有标签 */
export async function getTagList() {
  const { data } = await umiRequest.get<{ data: string[] }>(`${HOST}/tags`);

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
