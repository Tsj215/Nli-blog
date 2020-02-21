import * as S from '@/schema';
import { HOST, umiRequest } from '@/skeleton';

/** 获取所有留言 */
export async function getMoCloudMsg(): Promise<S.MoCloudMsg> {
  const { data } = await umiRequest.get<{ data: S.MoCloudMsg }>(
    `${HOST}/mocloud/message`,
  );

  return data;
}

/** 新增留言 */
export async function addMoCloudMsg(message: string, createAt: string) {
  const { status } = await umiRequest.post<{ status: string }>(
    `${HOST}/mocloud/newMsg`,
    { data: { message, createAt } },
  );

  return status === 'ok';
}

/** 删除留言 */
export async function deleteMoCloudMsg(id: string) {
  const { status } = await umiRequest.delete<{ status: string }>(
    `${HOST}/mocloud/delete/${id}`,
  );
  return status === 'ok';
}
