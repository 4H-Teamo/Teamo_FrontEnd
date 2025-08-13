"use client";

import { useRouter, useSearchParams } from "next/navigation";
import { useEffect, useState } from "react";
import { useUserStore } from "@/app/store/userStore";

export default function KakaoCallback() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const setUser = useUserStore((s) => s.setUser);
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
        const backend = process.env.NEXT_PUBLIC_BACKEND_URL;
        if (!backend) {
          console.error("백엔드 URL이 설정되어 있지 않습니다");
          alert("백엔드 URL이 설정되어 있지 않습니다. 관리자에게 문의하세요.");
          return;
        }

        const apiUrl = `${backend}/auth/kakao?code=${code}`;
        const res = await fetch(apiUrl, { method: "GET", mode: "cors" });

        if (!res.ok) throw new Error(`HTTP error! status: ${res.status}`);

        const data = await res.json();

        if (data.user && data.token) {
          setUser(data.user);
          localStorage.setItem("accessToken", data.token);
          localStorage.setItem("refreshToken", data.token);
          router.push("/");
        } else {
          alert("로그인에 실패했습니다.");
          router.push("/");
        }
      } catch (error) {
        console.error("카카오 로그인 에러:", error);
        alert("로그인 처리 중 오류가 발생했습니다.");
        router.push("/");
      }
    };

    handleKakaoLogin();
  }, [code, router, setUser]);

  return (
    <div className="flex flex-col items-center justify-center h-screen">
      <div>로그인 처리중...</div>
      <div className="mt-2 text-sm text-gray-500">잠시만 기다려주세요</div>
    </div>
  );
}
