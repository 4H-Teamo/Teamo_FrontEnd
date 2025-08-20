import type { User, Post } from "@/app/model/type";
import type { CardData } from "@/app/model/card";
import { positionsToLabels } from "@/app/utils/position";
import type { LabelType } from "@/app/components/card/matchLabel";

const toISOStringLoose = (value: Date | string | undefined): string => {
  if (!value) return "";
  if (typeof value === "string") return value;
  try {
    return value.toISOString();
  } catch {
    return "";
  }
};

export const toTeamCardData = (u: User): CardData<"team"> => ({
  id: u.userId,
  type: "team",
  dateText: toISOStringLoose(u.updatedAt as unknown as Date | string),
  workMode: u.workMode as any,
  content: u.description,
  stackIds: (Array.isArray(u.stacks) ? (u.stacks as any) : []) as number[],
});

export const toTeammateCardData = (p: Post): CardData<"teammate"> => ({
  id: (p.postId ?? p.id) as number | string,
  type: "teammate",
  dateText: (p.endDate as string) || (p.updatedAt as string) || "",
  workMode: p.workMode as any,
  title: p.title,
  content: p.content,
  stackIds: p.stacks as any as number[],
  positionIds: p.positions as any as Array<number | string>,
  labels: positionsToLabels(p.positions as any as Array<number | string>),
});

// 간단 매칭 라벨 계산기 (사용자 정보가 없으므로 positions/stack만 기반)
export const computeTeammateMatchLabels = (
  card: CardData<"teammate">,
  myPositionIds?: Array<number | string>,
  myStackIds?: number[]
): { type: LabelType; text: string }[] => {
  if (!myPositionIds && !myStackIds)
    return [{ type: "로그인 후 일치 여부 확인가능", text: "로그인 필요" }];
  const results: { type: LabelType; text: string }[] = [];
  if (myPositionIds && card.positionIds) {
    const set = new Set(card.positionIds.map(String));
    const hit = myPositionIds.some((id) => set.has(String(id)));
    if (hit) results.push({ type: "포지션 일치", text: "포지션 일치" });
  }
  if (myStackIds && card.stackIds) {
    const a = new Set(card.stackIds);
    const matched = myStackIds.filter((s) => a.has(s));
    if (matched.length > 0) {
      results.push({
        type: matched.length >= 3 ? "기술 일치" : "기술 부분 일치",
        text: matched.length >= 3 ? "기술 일치" : "기술 부분 일치",
      });
    }
  }
  if (results.length === 0)
    results.push({ type: "해당 없음", text: "해당 없음" });
  return results;
};
