import { POSITION } from "@/app/constants/forms/positions";

// id(숫자 또는 문자열) → 라벨("백엔드" 등) 매핑
const idToLabelMap = new Map<string, string>(
  POSITION.map((p) => [String(p.value ?? p.id), p.label])
);

// 숫자 id → 라벨 (API가 1,2로 내려줄 때 우선 매칭)
const numericIdToLabel: Record<number, string> = {
  1: "프론트",
  2: "백엔드",
};

export const positionIdToLabel = (id: number | string): string => {
  if (typeof id === "number" && numericIdToLabel[id])
    return numericIdToLabel[id];
  const byKey = idToLabelMap.get(String(id));
  return byKey ?? String(id);
};

export const positionsToLabels = (ids: Array<number | string> = []): string[] =>
  ids.map((i) => positionIdToLabel(i));
