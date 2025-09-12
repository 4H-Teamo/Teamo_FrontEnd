import { z } from "zod";

export const createPostSchema = z.object({
  title: z.string().min(1, "제목을 입력해주세요.").trim(),
  content: z.string().min(1, "내용을 입력해주세요.").trim(),
  location: z.string().min(1, "지역을 선택해주세요.").trim(),
  workMode: z.number().min(1, "진행 여부을 선택해주세요."),
  capacity: z.number().min(1, "모집 인원을 입력해주세요."),
  endDate: z.string().min(1, "마감일을 선택해주세요.").trim(),
  stacks: z.array(z.number()).min(1, "기술 스택을 최소 1개 이상 선택해주세요."),
  positions: z
    .array(z.number())
    .min(1, "모집 포지션을 최소 1개 이상 선택해주세요."),
});

export type CreatePostData = z.infer<typeof createPostSchema>;

export const getFirstValidationError = (data: unknown): string | null => {
  try {
    createPostSchema.parse(data);
    return null;
  } catch (error) {
    if (error instanceof z.ZodError) {
      return error.issues[0]?.message || "유효성 검사에 실패했습니다.";
    }
    return "유효성 검사에 실패했습니다.";
  }
};
