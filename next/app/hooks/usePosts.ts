import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import type { Post } from "@/app/model/type";

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
