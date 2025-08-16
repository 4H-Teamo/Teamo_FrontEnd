import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { User } from "@/app/model/type";

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

export const useMyProfile = () => {
  return useQuery({
    queryKey: ["user"],
    queryFn: () => fetcher<User>("/api/proxy/users/me", { method: "GET" }),
    enabled: typeof document !== "undefined",
  });
};

export const useUserProfile = (userId: string) => {
  return useQuery({
    queryKey: ["user", userId],
    queryFn: () =>
      fetcher<User>(`/api/proxy/users/${userId}`, { method: "GET" }),
    enabled: !!userId,
  });
};

export const useUpdateUserProfile = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (userData: Partial<User>) =>
      fetcher<User>("/api/proxy/users", {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(userData),
      }),

    onSuccess: (data) => {
      // 현재 사용자 정보와 모든 사용자 정보 캐시 업데이트
      queryClient.setQueryData(["user"], data);
      queryClient.setQueryData(["currentUser"], data);
      queryClient.invalidateQueries({ queryKey: ["users"] });

      console.log("회원정보 수정 완료!");
    },

    onError: (error) => {
      console.error("=== useUpdateUserProfile 에러 ===");
      console.error("에러 타입:", typeof error);
      console.error("에러 객체:", JSON.stringify(error, null, 2));
      console.error(
        "에러 메시지:",
        error instanceof Error ? error.message : String(error)
      );
      console.error("================================");
    },
  });
};

// 회원정보 삭제
export const useDeleteUserProfile = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (userId: string) =>
      fetcher(`/api/proxy/users/${userId}`, { method: "DELETE" }),

    onSuccess: (_, userId) => {
      queryClient.removeQueries({ queryKey: ["user", userId] });
      queryClient.invalidateQueries({ queryKey: ["users"] });
      console.log("회원정보 삭제 완료!");
    },
  });
};

// 현재 로그인한 사용자 정보 조회
export const useCurrentUser = () => {
  return useQuery({
    queryKey: ["currentUser"],
    queryFn: () => fetcher<User>("/api/proxy/users/me", { method: "GET" }),
    enabled: typeof document !== "undefined",
  });
};
