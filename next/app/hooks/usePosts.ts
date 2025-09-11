import {
  useInfiniteQuery,
  useQuery,
  useMutation,
  useQueryClient,
} from "@tanstack/react-query";
import {
  getTeams,
  getTeamDetail,
  getTeammates,
  getTeammateDetail,
} from "@/app/api/post";
import type { Post } from "@/app/model/type";

export const useTeams = () =>
  useQuery<any[]>({ queryKey: ["teams"], queryFn: () => getTeams(1, 12) });

export const useTeam = (id: string) =>
  useQuery<any>({ queryKey: ["team", id], queryFn: () => getTeamDetail(id) });

export const useTeammates = () =>
  useQuery<any[]>({
    queryKey: ["teammates"],
    queryFn: () => getTeammates(1, 12),
  });

// 제한 개수로 팀(팀원 구해요) 목록 조회
export const useTeamsLimited = (limit: number = 3) =>
  useQuery<any[]>({
    queryKey: ["teams", "limited", limit],
    queryFn: () => getTeams(1, limit),
  });

// 제한 개수로 사용자(팀 구해요) 목록 조회
export const useTeammatesLimited = (limit: number = 3) =>
  useQuery<any[]>({
    queryKey: ["teammates", "limited", limit],
    queryFn: () =>
      fetcher<any[]>(
        `/api/proxy/users?page=1&limit=${encodeURIComponent(limit)}`,
        {
          method: "GET",
        }
      ),
  });

// 기술스택 수요/공급 통계 조회
type DemandSupplyItem = { stackId: number; stackName: string; count: number };
export type TechStackDemandSupply = {
  supply: DemandSupplyItem[];
  demand: DemandSupplyItem[];
};

export const useTechStackDemandSupply = () =>
  useQuery<TechStackDemandSupply>({
    queryKey: ["analysis", "tech-stack-demand-supply"],
    queryFn: () =>
      fetcher<TechStackDemandSupply>(
        "/api/proxy/analysis/tech-stack-demand-supply",
        { method: "GET" }
      ),
    staleTime: 1000 * 60 * 10,
  });

export const useTeammate = (id: string) =>
  useQuery<any>({
    queryKey: ["teammate", id],
    queryFn: () => getTeammateDetail(id),
  });

export const useInfiniteTeammates = (limit: number = 12) =>
  useInfiniteQuery<any[], Error>({
    queryKey: ["teammates", "infinite", limit],
    initialPageParam: 1,
    queryFn: ({ pageParam }) => getTeammates(pageParam as number, limit),
    getNextPageParam: (lastPage, allPages, lastPageParam) => {
      const curr = (lastPageParam as number) ?? allPages.length;
      return Array.isArray(lastPage) && lastPage.length >= limit
        ? curr + 1
        : undefined;
    },
    refetchOnWindowFocus: false,
  });

export const useInfiniteTeams = (limit: number = 12) =>
  useInfiniteQuery<any[], Error>({
    queryKey: ["teams", "infinite", limit],
    initialPageParam: 1,
    queryFn: ({ pageParam }) => getTeams(pageParam as number, limit),
    getNextPageParam: (lastPage, allPages, lastPageParam) => {
      const curr = (lastPageParam as number) ?? allPages.length;
      return Array.isArray(lastPage) && lastPage.length >= limit
        ? curr + 1
        : undefined;
    },
    refetchOnWindowFocus: false,
  });

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

// 글 조회 (GET 요청)
export const useTeamPosts = () => {
  return useQuery<Post[]>({
    queryKey: ["posts"],
    queryFn: () => fetcher<Post[]>("/api/proxy/posts", { method: "GET" }),
  });
};

// 글 작성 (POST 요청)
export const useCreatePost = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (postData: Partial<Post>) =>
      fetcher<Post>("/api/proxy/posts", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(postData),
      }),

    onSuccess: (data) => {
      // 글 작성 성공 시 posts 캐시 업데이트
      queryClient.invalidateQueries({ queryKey: ["posts"] });
      console.log("글 작성 완료:", data);
    },

    onError: (error) => {
      console.error("글 작성 실패:", error);
    },
  });
};
