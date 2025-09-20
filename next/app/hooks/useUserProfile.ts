import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { User } from "@/app/model/type";
import { toast } from "sonner";
import { useAuthStore } from "../store/authStore";

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
      toast.success("회원정보가 성공적으로 수정되었습니다! 🎉");
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

      if (error instanceof Error && error.message.includes("401")) {
        toast.error("로그인이 만료되었습니다. 다시 로그인해주세요.");
      } else {
        toast.error("회원정보 수정에 실패했습니다. 다시 시도해주세요.");
      }
    },
  });
};

// 회원정보 삭제 (현재 로그인한 사용자)
export const useDeleteUserProfile = () => {
  const queryClient = useQueryClient();
  const { logout } = useAuthStore();

  return useMutation({
    mutationFn: () => fetcher(`/api/proxy/users`, { method: "DELETE" }),

    onSuccess: () => {
      queryClient.removeQueries({ queryKey: ["user"] });
      queryClient.removeQueries({ queryKey: ["currentUser"] });
      queryClient.invalidateQueries({ queryKey: ["users"] });

      toast.success("회원정보가 성공적으로 삭제되었습니다!");

      // 로그아웃 처리
      logout();
    },
    onError: (error) => {
      console.error("회원정보 삭제 실패:", error);

      if (error instanceof Error && error.message.includes("401")) {
        toast.error("로그인이 만료되었습니다. 다시 로그인해주세요.");
      } else {
        toast.error("회원정보 삭제에 실패했습니다. 다시 시도해주세요.");
      }
    },
  });
};

// 현재 로그인한 사용자 정보 조회
export const useCurrentUser = () => {
  // 쿠키에서 accessToken 확인
  const hasAccessToken =
    typeof document !== "undefined" && document.cookie.includes("accessToken");

  return useQuery({
    queryKey: ["currentUser"],
    queryFn: () => fetcher<User>("/api/proxy/users/me", { method: "GET" }),
    enabled: hasAccessToken,
    retry: false,
    staleTime: 1000 * 60 * 30,
  });
};

// 사용자 목록 조회 (페이지네이션 지원)
export const useUsers = (page: number = 1, limit: number = 50) => {
  return useQuery({
    queryKey: ["users", page, limit],
    queryFn: () =>
      fetcher<User[]>(`/api/proxy/users?page=${page}&limit=${limit}`, {
        method: "GET",
      }),
    enabled: typeof document !== "undefined",
  });
};
