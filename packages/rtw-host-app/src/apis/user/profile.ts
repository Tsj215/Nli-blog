import * as S from '@/schema';
import { HOST, umiRequest } from '@/skeleton';

export async function getProfileById(id: number): Promise<S.UserProfile> {
  const { data } = await umiRequest.get<{ data: S.UserProfile }>(
    `${HOST}/user/profile/${id}`,
  );

  return data;
}

/** 更新用户信息 */
export async function updateProfile(profile: Partial<S.UserProfile>) {
  const { status } = await umiRequest.patch<{ status: string }>(
    `${HOST}/user/update`,
    {
      data: profile,
    },
  );

  return status === 'ok';
}
