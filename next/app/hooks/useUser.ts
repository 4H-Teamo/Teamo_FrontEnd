"use client";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import { useState, useEffect } from "react";

// 쿠키 상태 확인 함수
export const checkCookieStatus = async () => {
  if (typeof document === "undefined") return null;

  try {
    const Cookies = (await import("js-cookie")).default;
    const accessToken = Cookies.get("accessToken");

    console.log("현재 쿠키 상태:", {
      hasAccessToken: !!accessToken,
      accessToken: accessToken ? `${accessToken.substring(0, 20)}...` : null,
    });

    return accessToken;
  } catch (error) {
    console.error("쿠키 확인 중 에러:", error);
    return null;
  }
};

// 토큰 관리를 위한 훅
export const useAccessToken = () => {
  const [accessToken, setAccessToken] = useState<string>("");

  useEffect(() => {
    const getToken = async () => {
      const token = await checkCookieStatus();
      setAccessToken(token || "");
    };
    getToken();
  }, []);

  return { accessToken };
};

const fetchUser = async () => {
  const res = await fetch("/api/proxy/users/me", {
    method: "GET",
    credentials: "include",
  });

  if (!res.ok) {
    throw new Error(`HTTP error! status: ${res.status}`);
  }

  const userData = await res.json();

  return userData;
};

export default function useUser() {
  const queryClient = useQueryClient();

  const query = useQuery({
    queryKey: ["user"],
    queryFn: async () => fetchUser(),
    staleTime: 1000 * 60 * 30,
    refetchOnWindowFocus: false,
    retry: false,
    enabled: false,
  });

  const prefetchUser = async () => {
    try {
      await queryClient.prefetchQuery({
        queryKey: ["user"],
        queryFn: fetchUser,
        staleTime: 1000 * 60 * 30,
      });
    } catch (error) {
      console.log("사용자 정보 prefetch 실패:", error);
    }
  };

  const clearUser = () => {
    queryClient.removeQueries({ queryKey: ["user"] });
    console.log("사용자 정보가 캐시에서 제거되었습니다.");
  };

  return {
    ...query,
    prefetchUser,
    clearUser,
  };
}
