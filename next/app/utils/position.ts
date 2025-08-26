import { POSITION } from "@/app/constants/forms/positions";

// 숫자 id → 라벨 매핑 (백엔드에서 받은 숫자를 라벨로 변환)
const idToLabelMap = new Map<number, string>(
  POSITION.map((p) => [p.id, p.label])
);

// 라벨 → 숫자 id 매핑 (UI에서 백엔드로 보낼 때)
const labelToIdMap = new Map<string, number>(
  POSITION.map((p) => [p.label, p.id])
);

// 백엔드에서 받은 숫자를 UI 라벨로 변환
export const positionIdToLabel = (id: number): string => {
  return idToLabelMap.get(id) || String(id);
};

// UI 라벨을 백엔드 숫자로 변환
export const positionLabelToId = (label: string): number => {
  return labelToIdMap.get(label) || 0;
};

// 여러 개의 position id를 라벨 배열로 변환
export const positionsToLabels = (ids: number[] = []): string[] =>
  ids.map((id) => positionIdToLabel(id));

// 여러 개의 position label을 id 배열로 변환
export const labelsToPositions = (labels: string[] = []): number[] =>
  labels.map((label) => positionLabelToId(label));
