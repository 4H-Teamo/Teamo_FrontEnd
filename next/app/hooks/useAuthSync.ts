"use client";
import { useEffect } from "react";
import { useAuthStore } from "@/app/store/authStore";

// 쿠키 변경을 감지하여 인증 상태를 자동으로 동기화하는 훅
export const useAuthSync = () => {
  const { checkAuthStatus } = useAuthStore();

  useEffect(() => {
    // 초기 인증 상태 확인
    checkAuthStatus();

    // 쿠키 변경 감지 (Storage Event)
    const handleStorageChange = (e: StorageEvent) => {
      if (e.key === "accessToken" || e.key === null) {
        console.log("쿠키 변경 감지, 인증 상태 재확인");
        checkAuthStatus();
      }
    };

    // 페이지 포커스 시 인증 상태 확인
    const handleFocus = () => {
      console.log("페이지 포커스, 인증 상태 재확인");
      checkAuthStatus();
    };

    // 이벤트 리스너 등록
    window.addEventListener("storage", handleStorageChange);
    window.addEventListener("focus", handleFocus);

    // 컴포넌트 언마운트 시 정리
    return () => {
      window.removeEventListener("storage", handleStorageChange);
      window.removeEventListener("focus", handleFocus);
    };
  }, [checkAuthStatus]);
};
