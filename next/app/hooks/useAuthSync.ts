"use client";
import { useEffect, useRef, useCallback } from "react";
import { useAuthStore } from "@/app/store/authStore";

// 쿠키 변경을 감지하여 인증 상태를 자동으로 동기화하는 훅
export const useAuthSync = () => {
  const { checkAuthStatus } = useAuthStore();
  const lastActivityRef = useRef<number>(Date.now());
  const isActiveRef = useRef<boolean>(true);
  const isInitializedRef = useRef<boolean>(false);

  // checkAuthStatus를 useCallback으로 감싸서 안정화
  const stableCheckAuthStatus = useCallback(() => {
    checkAuthStatus();
  }, [checkAuthStatus]);

  useEffect(() => {
    // 초기 인증 상태 확인 (한 번만)
    if (!isInitializedRef.current) {
      console.log("초기 인증 상태 확인 시작");
      checkAuthStatus();
      isInitializedRef.current = true;
    }

    // 사용자 활동 감지
    const updateActivity = () => {
      lastActivityRef.current = Date.now();
      isActiveRef.current = true;
    };

    // 사용자 비활성 감지 (5분 동안 활동이 없으면 비활성)
    const checkInactivity = () => {
      const now = Date.now();
      const timeSinceLastActivity = now - lastActivityRef.current;
      const inactiveThreshold = 5 * 60 * 1000; // 5분

      if (timeSinceLastActivity > inactiveThreshold) {
        isActiveRef.current = false;
        console.log("사용자 비활성 상태로 전환");
      }
    };

    // 쿠키 변경 감지 (Storage Event)
    const handleStorageChange = (e: StorageEvent) => {
      if (e.key === "accessToken" || e.key === null) {
        console.log("쿠키 변경 감지, 인증 상태 재확인");
        stableCheckAuthStatus();
      }
    };

    // 페이지 포커스 시 인증 상태 확인
    const handleFocus = () => {
      console.log("페이지 포커스, 인증 상태 재확인");
      isActiveRef.current = true;
      lastActivityRef.current = Date.now();
      stableCheckAuthStatus();
    };

    // 페이지 가시성 변경 시 인증 상태 확인
    const handleVisibilityChange = () => {
      if (!document.hidden) {
        console.log("페이지 가시성 변경, 인증 상태 재확인");
        isActiveRef.current = true;
        lastActivityRef.current = Date.now();
        stableCheckAuthStatus();
      }
    };

    // 사용자 활동 이벤트 리스너
    const userActivityEvents = [
      "mousedown",
      "mousemove",
      "keypress",
      "scroll",
      "touchstart",
      "click",
    ];

    userActivityEvents.forEach((event) => {
      document.addEventListener(event, updateActivity, { passive: true });
    });

    // 이벤트 리스너 등록
    window.addEventListener("storage", handleStorageChange);
    window.addEventListener("focus", handleFocus);
    document.addEventListener("visibilitychange", handleVisibilityChange);

    // 비활성 체크 (1분마다)
    const inactivityInterval = setInterval(checkInactivity, 60 * 1000);

    // 컴포넌트 언마운트 시 정리
    return () => {
      // 이벤트 리스너 제거
      window.removeEventListener("storage", handleStorageChange);
      window.removeEventListener("focus", handleFocus);
      document.removeEventListener("visibilitychange", handleVisibilityChange);

      // 사용자 활동 이벤트 리스너 제거
      userActivityEvents.forEach((event) => {
        document.removeEventListener(event, updateActivity);
      });

      // 인터벌 정리
      clearInterval(inactivityInterval);
    };
  }, [stableCheckAuthStatus]); // user 제거, stableCheckAuthStatus만 의존
};
