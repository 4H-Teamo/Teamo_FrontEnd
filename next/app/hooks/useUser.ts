"use client";

import { useQuery } from "@tanstack/react-query";
import { fetchUser } from "@/app/api/auth/info";
import { useUserStore } from "@/app/store/userStore";
import { useEffect } from "react";

export default function useUser() {
  const setUser = useUserStore((s) => s.setUser);

  const query = useQuery({
    queryKey: ["user"],
    queryFn: async () => {
      const token = localStorage.getItem("accessToken");
      if (!token) {
        throw new Error("토큰이 없습니다. 다시 로그인해주세요.");
      }
      return fetchUser(token);
    },
    staleTime: 1000 * 60 * 5,
    refetchOnWindowFocus: false,
    retry: false, // 401 에러 시 재시도하지 않음
  });

  useEffect(() => {
    if (query.data) {
      setUser(query.data);
      console.log("사용자 정보 로드 완료:", query.data);
    }
  }, [query.data, setUser]);

  return query;
}
