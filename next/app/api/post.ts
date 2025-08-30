import type { Post, User } from "@/app/model/type";
import { API_BASE } from "@/app/constants/url";

// 실제 API 스펙에 맞춰 경로를 조정: 목록은 /posts, 상세는 /posts/{id}
// 팀구해요: 사용자 목록 /users

const json = async (res: Response) => {
  if (!res.ok) throw new Error("요청 실패");
  return res.json();
};

export const getTeams = async (
  page: number = 1,
  limit: number = 10
): Promise<Post[]> => {
  // 팀원구해요 목록 (페이지네이션)
  const res = await fetch(`${API_BASE}/posts?page=${page}&limit=${limit}`, {
    // SSR과 CSR 모두에서 재검증 가능하도록 기본 no-store
    cache: "no-store",
  });
  return json(res);
};

export const getTeamDetail = async (id: string | number): Promise<Post> => {
  const res = await fetch(`${API_BASE}/posts/${id}`, { cache: "no-store" });
  return json(res);
};

// 팀구해요 목록(= 사용자 목록)
export const getTeammates = async (
  page: number = 1,
  limit: number = 10
): Promise<User[]> => {
  const res = await fetch(`${API_BASE}/users?page=${page}&limit=${limit}`, {
    cache: "no-store",
  });
  return json(res);
};

export const getTeammateDetail = async (id: string | number): Promise<User> => {
  const res = await fetch(`${API_BASE}/users/${id}`, { cache: "no-store" });
  return json(res);
};

// 내 글 목록 - 서버에서 직접 백엔드 API 호출
export const getMyPosts = async (accessToken: string): Promise<Post[]> => {
  if (!accessToken) {
    throw new Error("인증 토큰이 필요합니다.");
  }

  const res = await fetch(`${API_BASE}/posts/me`, {
    headers: {
      Authorization: `Bearer ${accessToken}`,
    },
    cache: "no-store",
  });

  if (!res.ok) {
    throw new Error(`HTTP error! status: ${res.status}`);
  }

  return res.json();
};
// 내 글 삭제
export const deleteMyPost = async (accessToken: string, postId: number) => {
  if (!accessToken) {
    throw new Error("인증 토큰이 필요합니다.");
  }

  const res = await fetch(`${API_BASE}/posts/${postId}`, {
    method: "DELETE",
    headers: {
      Authorization: `Bearer ${accessToken}`,
    },
  });

  if (!res.ok) {
    throw new Error(`HTTP error! status: ${res.status}`);
  }

  return res.json();
};
