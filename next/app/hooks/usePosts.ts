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
  getMyPosts,
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

// 내 글 목록 훅
export const useMyPosts = (accessToken: string) =>
  useQuery<Post[]>({
    queryKey: ["myPosts"],
    queryFn: () => getMyPosts(accessToken),
    enabled: !!accessToken,
    retry: false,
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
    },
  });
};
