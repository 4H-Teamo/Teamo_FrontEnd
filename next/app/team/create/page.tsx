"use client";
import Content from "@/app/team/create/content";
import Header from "@/app/team/create/header";
import { useForm, FormProvider } from "react-hook-form";
import { useCreatePost } from "@/app/hooks/usePosts";
const Create = () => {
  const methods = useForm();
  const createPost = useCreatePost();
  const onSubmit = methods.handleSubmit(async (data) => {
    console.log("=== 폼 제출 시작 ===");
    console.log("Form Submitted:", data);

    console.log("=== 필드별 타입 분석 ===");
    console.log("title:", data.title, "타입:", typeof data.title);
    console.log("content:", data.content, "타입:", typeof data.content);
    console.log("location:", data.location, "타입:", typeof data.location);
    console.log("workMode:", data.workMode, "타입:", typeof data.workMode);
    console.log("capacity:", data.capacity, "타입:", typeof data.capacity);
    console.log(
      "stacks:",
      data.stacks,
      "타입:",
      typeof data.stacks,
      "배열인가?",
      Array.isArray(data.stacks),
      "실제 값:",
      Array.isArray(data.stacks) ? data.stacks : []
    );
    console.log(
      "positions:",
      data.positions,
      "타입:",
      typeof data.positions,
      "배열인가?",
      Array.isArray(data.positions),
      "실제 값:",
      Array.isArray(data.positions) ? data.positions : []
    );
    console.log("endDate:", data.endDate, "타입:", typeof data.endDate);
    console.log("=== 필드별 타입 분석 완료 ===");

    const updateData = {
      title: data.title,
      content: data.content,
      location: data.location,
      workMode: data.workMode,
      capacity: parseInt(data.capacity) || 0,
      endDate: data.endDate,
      stacks: Array.isArray(data.stacks)
        ? data.stacks
            .map((stack) => (typeof stack === "object" ? stack.id : stack))
            .filter(Boolean)
        : [],
      positions: Array.isArray(data.positions)
        ? data.positions
            .map((pos) => (typeof pos === "object" ? pos.id : pos))
            .filter(Boolean)
        : [],
    };

    // 변환된 데이터의 타입도 확인
    console.log("=== 변환된 데이터 타입 분석 ===");
    console.log(
      "변환된 capacity:",
      updateData.capacity,
      "타입:",
      typeof updateData.capacity
    );
    console.log(
      "변환된 stacks:",
      updateData.stacks,
      "타입:",
      typeof updateData.stacks,
      "배열인가?",
      Array.isArray(updateData.stacks),
      "실제 값:",
      updateData.stacks,
      "요소 타입들:",
      updateData.stacks.map((item) => typeof item)
    );
    console.log(
      "변환된 positions:",
      updateData.positions,
      "타입:",
      typeof updateData.positions,
      "배열인가?",
      Array.isArray(updateData.positions),
      "실제 값:",
      updateData.positions,
      "요소 타입들:",
      updateData.positions.map((item) => typeof item)
    );
    console.log("=== 변환된 데이터 타입 분석 완료 ===");

    try {
      console.log("API 호출 시작...");
      const result = await createPost.mutateAsync(updateData);
      console.log("포스터 작성완료:", result);
      alert("팀 모집글이 작성되었습니다!");
    } catch (error) {
      console.error("=== Post Creation Error ===");
      console.error("에러 타입:", typeof error);
      console.error("에러 객체:", error);
      console.error(
        "에러 메시지:",
        error instanceof Error ? error.message : String(error)
      );
      alert("팀 모집글 작성에 실패했습니다.");
    }
  });

  return (
    <FormProvider {...methods}>
      <div className="border-gray20 rounded-lg border p-5 md:p-2 lg:p-10 min-w-2/3 max-w-5xl">
        <Header onSubmit={onSubmit} />
        <Content />
      </div>
    </FormProvider>
  );
};

export default Create;
