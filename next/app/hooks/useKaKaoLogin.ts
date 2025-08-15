import { useUserStore } from "@/app/store/userStore";
import { useRouter } from "next/navigation";

export default function useKakaoLogin() {
  const router = useRouter();
  const logout = useUserStore((s) => s.clearUser);

  const login = async () => {
    try {
      const clientId = process.env.NEXT_PUBLIC_KAKAO_RESTAPI_KEY;
      if (!clientId) {
        console.error("카카오 REstApi가 설정되어 있지 않습니다.");
        return;
      }

      const origin =
        typeof window !== "undefined"
          ? window.location.origin
          : "http://localhost:3000";
      const redirectUri = `${origin}/kakao/redirect`;
      const loginUrl = `https://kauth.kakao.com/oauth/authorize?client_id=${clientId}&redirect_uri=${encodeURIComponent(
        redirectUri
      )}&response_type=code`;

      router.push(loginUrl);
      console.log("loginUrl", loginUrl);
    } catch (error) {
      console.error("로그인 실패:", error);
    }
  };

  const logoutAndClearCookie = async () => {
    try {
      // 프록시 라우트를 통해 서버에서 쿠키 제거 처리 (필요 시 구현)
      await fetch("/api/proxy/auth/logout", {
        method: "POST",
        credentials: "include",
      });
    } catch (error) {
      console.error("로그아웃 실패:", error);
    } finally {
      logout();
      router.push("/");
    }
  };

  return {
    login,
    logout: logoutAndClearCookie,
  };
}
