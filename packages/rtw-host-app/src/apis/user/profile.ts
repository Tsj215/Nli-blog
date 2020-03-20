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

export async function loginByUsername(username: string, password: string) {
  const data = await umiRequest.post<{ data: any } | Response>(
    `${HOST}/user/login`,
    {
      data: { username, password },
    },
  );

  if (data instanceof Response) {
    return await data.json();
  } else {
    postLogin(data.data.token);
    return data;
  }
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

export function logout() {
  setToken(null);
  setAuthority(null);

  window.location.search = '';
  // 需要刷新界面，清空 redux
  window.location.reload();
}

// 上传文件
export async function getQiniuToken() {
  const { data } = await umiRequest.get<{ data: any }>(`${HOST}/user/upload`);

  return data;
}

// 获取下载链接
export async function getDownloadUrl(key: string) {
  const { data } = await umiRequest.get<{ data: string }>(
    `${HOST}/user/download/${key}`,
  );

  return data;
}

// 删除指定文件
export async function deleteByKey(key: string) {
  const { status } = await umiRequest.delete<{ status: string }>(
    `${HOST}/user/delete/${key}`,
  );

  return status === 'ok';
}
