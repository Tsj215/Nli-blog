import * as S from '@/schema';
import { HOST, setAuthority, umiRequest } from '@/skeleton';
import { getToken, isTokenExpired, setToken } from '@/skeleton/auth/token';

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

export async function loginByUserToken() {
  // 首先获取 token
  const token = getToken();

  // 判断是否过期
  if (isTokenExpired(token, 24 * 3600)) {
    setToken(null);
    setAuthority(null);
  } else {
    await postLogin(token);

    return;
  }

  if (!token) {
    await postLogin(null);
  }
}

// 登录后的统一处理
async function postLogin(token: string | null) {
  if (token) {
    setToken(token);
    // 获取用户信息并设置权限

    const profile = await getProfileById(1);

    if (!profile) {
      return;
    }
    setAuthority('admin');
  } else {
    setToken(null);
    setAuthority(null);
  }
}
