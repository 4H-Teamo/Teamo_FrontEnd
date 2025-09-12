"use client";

import { useRouter, useSearchParams } from "next/navigation";
import { useEffect, useState, Suspense } from "react";
import { useQueryClient } from "@tanstack/react-query";
import { useAuthStore } from "@/app/store/authStore";
import { toast } from "sonner";

const LoadingUI = () => (
  <div className="flex flex-col items-center justify-center h-screen">
    <div>로그인 처리중...</div>
    <div className="mt-2 text-sm text-gray-500">잠시만 기다려주세요</div>
  </div>
);

const KakaoLoginHandler = () => {
  const router = useRouter();
  const searchParams = useSearchParams();
  const queryClient = useQueryClient();
  const { login } = useAuthStore();
  const [code, setCode] = useState<string | null>(null);

  useEffect(() => {
    const paramCode = searchParams.get("code");
    if (paramCode) {
      setCode(paramCode);
    }
  }, [searchParams]);

  useEffect(() => {
    if (!code) return;

    const handleKakaoLogin = async () => {
      try {
        // 프록시 라우트로 카카오 인증 요청
        const res = await fetch(`/api/proxy/auth/kakao?code=${code}`, {
          method: "GET",
          credentials: "include",
        });

        if (!res.ok) throw new Error(`HTTP error! status: ${res.status}`);

        const data = await res.json();

        if (data.user) {
          // 응답 데이터 전체 로깅
          console.log("카카오 로그인 응답 전체:", data);
          console.log("응답에 accessToken이 있나요?", !!data.accessToken);
          console.log("응답에 refreshToken이 있나요?", !!data.refreshToken);

          // React Query 캐시에 사용자 정보 저장
          await queryClient.setQueryData(["user"], data.user);
          console.log("사용자 정보가 캐시에 저장되었습니다:", data.user);

          // 응답에서 토큰 확인 및 쿠키 저장
          if (data.token) {
            console.log("토큰을 쿠키에 저장합니다:", data.token);
            // js-cookie를 사용하여 클라이언트에서 쿠키 설정
            const Cookies = (await import("js-cookie")).default;
            Cookies.set("accessToken", data.token, {
              expires: 7, // 7일
              path: "/",
              sameSite: "lax",
            });
            console.log("쿠키 저장 완료!");

            // 쿠키 저장 확인
            const savedToken = Cookies.get("accessToken");
            console.log("저장된 쿠키 확인:", !!savedToken);
            if (savedToken) {
              console.log("쿠키 저장 성공! 토큰 길이:", savedToken.length);
            } else {
              console.error("쿠키 저장 실패!");
            }
          } else if (data.accessToken) {
            console.log("accessToken을 쿠키에 저장합니다:", data.accessToken);
            // js-cookie를 사용하여 클라이언트에서 쿠키 설정
            const Cookies = (await import("js-cookie")).default;
            Cookies.set("accessToken", data.accessToken, {
              expires: 7, // 7일
              path: "/",
              sameSite: "lax",
            });
            console.log("쿠키 저장 완료!");

            // 쿠키 저장 확인
            const savedToken = Cookies.get("accessToken");
            console.log("저장된 쿠키 확인:", !!savedToken);
            if (savedToken) {
              console.log("쿠키 저장 성공! 토큰 길이:", savedToken.length);
            } else {
              console.error("쿠키 저장 실패!");
            }
          } else {
            console.warn("응답에 토큰이 없습니다! (token 또는 accessToken)");
          }

          // 즉시 유저 스토어에 저장
          login(data.user);
          router.push("/");
        } else {
          toast.error("로그인에 실패했습니다.");
          router.push("/");
        }
      } catch (error) {
        console.error("카카오 로그인 에러:", error);
        toast.error("로그인 처리 중 오류가 발생했습니다.");
        router.push("/");
      }
    };

    handleKakaoLogin();
  }, [code, router, queryClient, login]);

  return <LoadingUI />;
};

// 메인 페이지 컴포넌트
const KakaoCallback = () => {
  return (
    <Suspense fallback={<LoadingUI />}>
      <KakaoLoginHandler />
    </Suspense>
  );
};
export default KakaoCallback;
