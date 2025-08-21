import type { WorkMode, WorkModeNumeric } from "@/app/model/type";

// 공통 카드 데이터 타입: 팀/팀원 카드 모두 이 형태로 변환해 전달
export type CardData<TType extends "team" | "teammate"> = {
  // 라우팅용 id
  id: string | number;
  // 타입 구분
  type: TType;
  // 공통 상단 메타
  dateText?: string; // YYYY-MM-DD 같은 표시용
  workMode?: WorkMode | WorkModeNumeric; // 숫자/문자 모두 허용
  // 본문
  title?: string; // teammate에서 사용
  content?: string; // teammate에서 사용, team은 description
  // 보조 정보
  stackIds?: number[]; // 아이콘 표시용
  positionIds?: Array<number | string>; // teammate에서 라벨 매핑용
  labels?: string[]; // 매칭 라벨
};
