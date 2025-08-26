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
