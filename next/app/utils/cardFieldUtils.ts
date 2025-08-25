import { WORK_MODE } from "@/app/constants/forms/workMode";
import { stackMock } from "@/app/mock/stack";
import type { Post, User, BoardType } from "@/app/model/type";
import { positionsToLabels } from "@/app/utils/position";
import { formatISOToKorean } from "./formatDate";

export const getValue = (board: BoardType, data: User | Post, key: string) => {
  if (board === "team") {
    return (data as Post)[key as keyof Post];
  } else {
    return (data as User)[key as keyof User];
  }
};

export const formatValue = (key: string, value: unknown) => {
  const formatters = {
    workMode: () =>
      WORK_MODE.find((mode) => mode.id === value)?.label || "정보 없음",
    stacks: () =>
      Array.isArray(value)
        ? value
            .map(
              (id) =>
                stackMock.techStack.find((stack) => stack.stackId === id)
                  ?.name || `ID: ${id}`
            )
            .join(", ")
        : "정보 없음",
    positions: () =>
      Array.isArray(value)
        ? positionsToLabels(
            value.map((p) =>
              typeof p === "string" ? parseInt(p) || 0 : Number(p)
            )
          ).join(", ")
        : "정보 없음",
    endDate: () => formatISOToKorean(value as string),
  };

  return (
    formatters[key as keyof typeof formatters]?.() ||
    String(value || "정보 없음")
  );
};
