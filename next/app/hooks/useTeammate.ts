import { useQuery } from "@tanstack/react-query";
import { User } from "@/app/model/type";
import { getTeammates } from "@/app/api/post";

const fetcher = async <T>(
  input: RequestInfo,
  init?: RequestInit
): Promise<T> => {
  const res = await fetch(input, { credentials: "include", ...init });

  if (!res.ok) {
    const errorText = await res.text();
    const errorInfo = {
      status: res.status,
      statusText: res.statusText,
      url: input,
      responseText: errorText,
    };

    console.error("Fetcher 에러:", JSON.stringify(errorInfo, null, 2));
    throw new Error(`HTTP ${res.status}: ${res.statusText} - ${errorText}`);
  }

  return res.json();
};

// 특정 사용자 정보 조회 (GET 요청)
export const useTeammateDetail = (userId: string) => {
  return useQuery<User>({
    queryKey: ["teammate", userId],
    queryFn: () =>
      fetcher<User>(`/api/proxy/users/${userId}`, { method: "GET" }),
    enabled: !!userId,
  });
};

// 팀원 목록 조회 (GET 요청)
export const useTeammates = () => {
  return useQuery<User[]>({
    queryKey: ["teammates"],
    queryFn: () => getTeammates(),
  });
};
