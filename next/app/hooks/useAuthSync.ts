"use client";
import { useEffect } from "react";
import { useAuthStore } from "@/app/store/authStore";

// 쿠키 변경을 감지하여 인증 상태를 자동으로 동기화하는 훅
export const useAuthSync = () => {
  const { checkAuthStatus } = useAuthStore();

  useEffect(() => {
    checkAuthStatus();

    const handleStorageChange = (e: StorageEvent) => {
      if (e.key === "accessToken" || e.key === null) {
        console.log("쿠키 변경 감지, 인증 상태 재확인");
        checkAuthStatus();
      }
    };

    const handleFocus = () => {
      console.log("페이지 포커스, 인증 상태 재확인");
      checkAuthStatus();
    };

    window.addEventListener("storage", handleStorageChange);
    window.addEventListener("focus", handleFocus);

    return () => {
      window.removeEventListener("storage", handleStorageChange);
      window.removeEventListener("focus", handleFocus);
    };
  }, [checkAuthStatus]);
};
