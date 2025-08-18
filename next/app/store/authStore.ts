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

        // 상태 변경
        set({ user: null, isAuthenticated: false, isLoading: false });
        console.log("로그아웃 완료");
      },

      checkAuthStatus: async () => {
        try {
          set({ isLoading: true });

          // 쿠키에서 accessToken 확인
          const Cookies = (await import("js-cookie")).default;
          const accessToken = Cookies.get("accessToken");

          if (!accessToken) {
            // 쿠키가 없으면 로그아웃 상태
            get().logout();
            return;
          }

          // 쿠키가 있으면 사용자 정보 확인
          const response = await fetch("/api/proxy/users/me", {
            method: "GET",
            credentials: "include",
          });

          if (!response.ok) {
            // API 호출 실패 시 로그아웃
            get().logout();
            return;
          }

          const userData = await response.json();
          get().login(userData);
        } catch (error) {
          console.error("인증 상태 확인 중 에러:", error);
          get().logout();
        }
      },
    }),
    {
      name: "auth-store",
    }
  )
);
