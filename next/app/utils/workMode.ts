import type { WorkMode, WorkModeNumeric } from "@/app/model/type";

export const workModeIdToKey = (
  mode?: WorkModeNumeric | number
): WorkMode | undefined => {
  if (mode === 1) return "ONLINE";
  if (mode === 2) return "OFFLINE";
  if (mode === 3) return "BOTH";
  return undefined;
};

export const workModeIdToLabel = (mode?: WorkModeNumeric | number): string => {
  if (mode === 1) return "온라인";
  if (mode === 2) return "오프라인";
  if (mode === 3) return "상관없음";
  return "";
};
