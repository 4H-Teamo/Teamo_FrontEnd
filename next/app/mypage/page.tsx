"use client";

import useUser from "@/app/hooks/useUser";
import { useForm, FormProvider } from "react-hook-form";
import { useEffect } from "react";
import { checkCookieStatus } from "../hooks/useUser";

import Avatar from "@/app/components/avatar/avatar";
import UserInfoForm from "@/app/mypage/userInfoForm";
import Header from "./header";
import { useUpdateUserProfile } from "../hooks/useUserProfile";

const Mypage = () => {
  const { data: userData, isLoading } = useUser();
  const updateUserProfile = useUpdateUserProfile();
  const methods = useForm({
    defaultValues: userData || {}, // 사용자 데이터로 초기값 설정
  });

  // 사용자 데이터가 변경되면 폼 초기값 업데이트
  useEffect(() => {
    if (userData) {
      console.log("userData", userData);
      methods.reset(userData);
    }
  }, [userData, methods]);

  // 쿠키 상태 확인
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
      console.log("폼 제출 데이터:", data);

      // 현재 쿠키 상태 확인
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

      // userId는 제거하고 필요한 데이터만 전송
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

        // mutateAsync 사용하여 에러를 명시적으로 캐치
        const result = await updateUserProfile.mutateAsync(updateData);
        console.log("사용자 정보 업데이트 완료!", result);
        alert("회원정보가 수정되었습니다!");
      } catch (error) {
        console.error("=== 마이페이지 업데이트 에러 ===");
        console.error("에러 타입:", typeof error);
        console.error("에러 객체:", JSON.stringify(error, null, 2));
        console.error(
          "에러 메시지:",
          error instanceof Error ? error.message : String(error)
        );
        console.error("================================");

        // 401 에러 시 로그인 페이지로 리다이렉트
        if (error instanceof Error && error.message.includes("401")) {
          alert("로그인이 만료되었습니다. 다시 로그인해주세요.");
          window.location.href = "/";
          return;
        }

        alert("회원정보 수정에 실패했습니다.");
      }
    } catch (error) {
      console.error("폼 제출 에러:", error);
      alert("폼 제출에 실패했습니다.");
    }
  });

  if (isLoading) return <div>로딩중...</div>;

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
