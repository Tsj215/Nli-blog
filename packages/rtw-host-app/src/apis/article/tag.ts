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
export async function deleteTag(tagName: string) {
  const { status } = await umiRequest.delete<{ status: string }>(
    `${HOST}/tags/${tagName}`,
  );

  return status === 'ok';
}

/** 更新标签 */
export async function updateTag(tagName: string, _tagName: string) {
  const { status } = await umiRequest.patch<{ status: string }>(
    `${HOST}/tags/${tagName}/${_tagName}`,
  );

  return status === 'ok';
}
