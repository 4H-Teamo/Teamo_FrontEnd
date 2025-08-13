"use client";

import { useUserStore } from "@/app/store/userStore";
import useUser from "@/app/hooks/useUser";
import { useForm, FormProvider } from "react-hook-form";
import { useEffect } from "react";

import Avatar from "@/app/components/avatar/avatar";
import UserInfoForm from "@/app/mypage/userInfoForm";
import Header from "./header";

const Mypage = () => {
  const { data: userData, isLoading, error } = useUser();
  const setUser = useUserStore((s) => s.setUser);
  const methods = useForm({
    defaultValues: {}, // 빈 객체로 시작
  });

  useEffect(() => {
    console.log("userData", userData);
    if (userData) {
      methods.reset(userData);
      console.log("폼 초기화 완료");
    }
  }, [userData, methods]);

  // 폼 값 변화 감지
  const formValues = methods.watch();
  useEffect(() => {
    console.log("현재 폼 값:", formValues);
  }, [formValues]);

  const onSubmit = methods.handleSubmit((data) => {
    console.log("폼 제출 데이터:", data);
    setUser(data);
    // 업데이트 API 호출
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
