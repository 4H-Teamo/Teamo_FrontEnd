"use client";

import useUser from "@/app/hooks/useUser";
import { useForm, FormProvider } from "react-hook-form";
import { useEffect } from "react";
import { checkCookieStatus } from "../hooks/useUser";
import { toast } from "sonner";
import { useRouter } from "next/navigation";
import { useAuthStore } from "@/app/store/authStore";
import { useAuthSync } from "@/app/hooks/useAuthSync";
import Avatar from "@/app/components/avatar/avatar";
import UserInfoForm from "@/app/mypage/userInfoForm";
import Header from "./header";
import { useUpdateUserProfile } from "../hooks/useUserProfile";

const Mypage = () => {
  const { data: userData, isLoading } = useUser();
  const updateUserProfile = useUpdateUserProfile();
  const router = useRouter();
  const { isAuthenticated, checkAuthStatus } = useAuthStore();
  const methods = useForm({
    defaultValues: userData || {},
  });

  // 인증 상태 동기화
  useAuthSync();

  useEffect(() => {
    if (userData) {
      console.log("userData", userData);
      methods.reset(userData);
    }
  }, [userData, methods]);

  // 로그인 상태 확인 및 리다이렉트
  useEffect(() => {
    const checkAuthAndRedirect = async () => {
      await checkAuthStatus();
      if (!isAuthenticated) {
        toast.error("로그인이 필요합니다.");
        router.push("/login");
        return;
      }
    };
    checkAuthAndRedirect();
  }, [isAuthenticated, checkAuthStatus, router]);

  // 현재 쿠키 상태
  useEffect(() => {
    const checkCookie = async () => {
      await checkCookieStatus();
    };
    checkCookie();
  }, []);

  const formValues = methods.watch();
  useEffect(() => {
    console.log("현재 폼 값:", formValues);
  }, [formValues]);

  const onSubmit = methods.handleSubmit(async (data) => {
    try {
      // 로그인 상태 확인
      if (!isAuthenticated) {
        toast.error("로그인이 필요합니다.");
        router.push("/login");
        return;
      }

      console.log("폼 제출 데이터:", data);

      // 현재 쿠키 상태
      const Cookies = (await import("js-cookie")).default;
      const currentToken = Cookies.get("accessToken");
      console.log("=== 현재 쿠키 상태 ===");
      console.log("토큰 존재:", !!currentToken);
      console.log("토큰 길이:", currentToken?.length || 0);
      if (currentToken) {
        console.log("토큰 앞 20자:", currentToken.substring(0, 20));
        console.log("토큰 전체:", currentToken);
      }
      console.log("======================");

      const updateData = {
        nickname: data.nickname,
        description: data.description,
        location: data.location,
        image: data.image,
        github: data.github,
        workMode: data.workMode,
        beginner: data.beginner,
        isPublic: data.isPublic,
        stacks:
          data.stacks
            ?.map((stack: { id?: number } | number) =>
              typeof stack === "object" ? stack.id : stack
            )
            .filter(Boolean) || [],
        positionId: data.positionId || null,
      };

      try {
        console.log("변환 전 stacks:", data.stacks);
        console.log("변환 후 updateData:", updateData);
        console.log("workMode 원본 값:", data.workMode);
        console.log("workMode 타입:", typeof data.workMode);
        console.log("=== positionId 상세 디버깅 ===");
        console.log("data.positionId:", data.positionId);
        console.log("data.positionId 타입:", typeof data.positionId);
        console.log(
          "data.positionId 값이 유효한가?",
          data.positionId >= 1 && data.positionId <= 8
        );
        console.log(
          "POSITION 상수에서 해당 ID 존재하는가?",
          [1, 2, 3, 4, 5, 6, 7, 8].includes(data.positionId)
        );
        console.log("updateData.positionId:", updateData.positionId);
        console.log("===============================");

        const result = await updateUserProfile.mutateAsync(updateData);
        console.log("사용자 정보 업데이트 완료!", result);
      } catch (error) {
        console.error("=== 마이페이지 업데이트 에러 ===");
        console.error("에러 타입:", typeof error);
        console.error("에러 객체:", JSON.stringify(error, null, 2));
        console.error(
          "에러 메시지:",
          error instanceof Error ? error.message : String(error)
        );
        console.log(typeof data.positionId);
        console.error("================================");
      }
    } catch (error) {
      console.error("폼 제출 에러:", error);
      toast.error("폼 제출에 실패했습니다. 다시 시도해주세요.");
    }
  });

  if (isLoading) return <div>로딩중...</div>;

  // 로그인되지 않은 경우 로그인 모달로 리다이렉트
  if (!isAuthenticated) {
    return null;
  }

  return (
    <FormProvider {...methods}>
      <form onSubmit={onSubmit}>
        <Header onSubmit={onSubmit} />
        <div className="leading-5 text-sm flex flex-col justify-items-center justify-center align-middle font-light text-gray10">
          <Avatar />
          <UserInfoForm />
        </div>
      </form>
    </FormProvider>
  );
};

export default Mypage;
