import { create } from "zustand";
import { devtools } from "zustand/middleware";
import type { User } from "@/app/model/type";

interface AuthState {
  user: User | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  login: (user: User) => void;
  logout: () => void;
  checkAuthStatus: () => Promise<void>;
}

export const useAuthStore = create<AuthState>()(
  devtools(
    (set, get) => ({
      user: null,
      isAuthenticated: false,
      isLoading: false,

      login: (user: User) => {
        set({ user, isAuthenticated: true, isLoading: false });
        console.log("로그인 성공:", user);
      },

      logout: async () => {
        // 쿠키 삭제
        try {
          const Cookies = (await import("js-cookie")).default;
          Cookies.remove("accessToken");
          Cookies.remove("refreshToken");
          console.log("쿠키 삭제 완료");
        } catch (error) {
          console.error("쿠키 삭제 중 에러:", error);
        }
        set({ user: null, isAuthenticated: false, isLoading: false });
        console.log("로그아웃 완료");
      },

      checkAuthStatus: async () => {
        try {
          set({ isLoading: true });
          console.log("인증 상태 확인 시작");

          // 쿠키에서 accessToken 확인
          const Cookies = (await import("js-cookie")).default;
          const accessToken = Cookies.get("accessToken");

          if (!accessToken) {
            // 쿠키가 없으면 로그아웃 상태
            console.log("액세스 토큰이 없습니다. 로그아웃 처리");
            get().logout();
            return;
          }

          console.log("액세스 토큰 확인됨, 사용자 정보 검증 중...");

          // 쿠키가 있으면 사용자 정보 확인
          const response = await fetch("/api/proxy/users/me", {
            method: "GET",
            credentials: "include",
          });

          if (!response.ok) {
            if (response.status === 401) {
              console.log(
                "토큰이 만료되었거나 유효하지 않습니다. 로그아웃 처리"
              );
              get().logout();
            } else {
              console.error(
                "사용자 정보 조회 실패:",
                response.status,
                response.statusText
              );
              set({ isLoading: false });
            }
            return;
          }

          const userData = await response.json();
          console.log("사용자 정보 검증 성공:", userData);
          get().login(userData);
        } catch (error) {
          console.error("인증 상태 확인 중 에러:", error);
          // 네트워크 오류인 경우 로그아웃하지 않고 로딩만 해제
          if (error instanceof TypeError && error.message.includes("fetch")) {
            console.log(
              "네트워크 오류로 인한 인증 확인 실패, 로그아웃하지 않음"
            );
            set({ isLoading: false });
          } else {
            get().logout();
          }
        }
      },
    }),
    {
      name: "auth-store",
    }
  )
);
