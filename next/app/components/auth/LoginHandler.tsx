"use client";

import { useSession } from "next-auth/react";
import { useRouter } from "next/navigation";
import { useEffect } from "react";

const LoginHandler = () => {
  const { data: session, status } = useSession();
  const router = useRouter();

  useEffect(() => {
    if (status === "authenticated" && session) {
      // 로그인 성공 후 신규회원 판단
      const checkNewUser = async () => {
        try {
          // 백엔드 API로 신규회원 여부 확인
          const response = await fetch(
            `${process.env.NEXT_PUBLIC_API_BASE_URL}/auth/check-user`,
            {
              headers: {
                Authorization: `Bearer ${session.accessToken}`,
              },
            }
          );

          const data = await response.json();

          if (data.isNewUser) {
            // 신규회원: 마이페이지로 이동
            router.push("/mypage");
          } else {
            // 기존회원: 메인 페이지로 이동
            router.push("/");
          }
        } catch (error) {
          console.error("사용자 정보 확인 실패:", error);
          // 에러 시 기본적으로 메인으로 이동
          router.push("/");
        }
      };

      checkNewUser();
    }
  }, [session, status, router]);

  return null; // 이 컴포넌트는 UI를 렌더링하지 않음
};

export default LoginHandler;
