// import type { Stack } from "@/app/model/stack";
export type WorkMode = "ONLINE" | "OFFLINE" | "BOTH";
export type WorkModeNumeric = 1 | 2 | 3;

export type filterType = "팀 구해요" | "팀원 구해요";
export type Post = {
  postId: number;
  userId: string;
  title: string;
  content: string;
  status: boolean;
  workMode: number;
  stacks: number[];
  endDate: string;
  capacity: number;
  positions: string[];
  createdAt: Date;
  location: string;
  updatedAt: Date;
};
export type User = {
  userId?: string;
  nickname?: string;
  description?: string;
  location?: string;
  image?: string;
  github?: string;
  workMode: number;
  beginner?: boolean;
  isPublic?: boolean;
  stacks?: number[];
  createdAt?: Date;
  updatedAt: Date;
  positionId?: string;
  posts?: Post[];
  comments?: Comment[];
  notices?: Notice[];
  postId?: number | string;
  id?: number | string;
  title: string;
  content: string;
  status?: boolean;
  // workMode: WorkMode | WorkModeNumeric;
  // stacks: Stack[] | number[];
  endDate?: string;
  capacity?: number;
  positions: string[] | number[];
};

export type Notice = {
  noticeId?: string;
  userId?: string;
  isRead?: boolean;
  message?: string;
  createdAt?: Date;
};
export type BoardType = "team" | "teammate";

type TeamItemKey = keyof Post;

type TeamItem = {
  key: TeamItemKey;
  label: string;
};

export const teamItem: TeamItem[] = [
  { key: "positions", label: "모집 포지션" },
  { key: "stacks", label: "기술 스택" },
  { key: "workMode", label: "작업 방식" },
  { key: "location", label: "지역" },
  { key: "endDate", label: "마감일" },
];

type TeammateItemKey = keyof User;

type TeammateItem = {
  key: TeammateItemKey;
  label: string;
};

export const teammateItem: TeammateItem[] = [
  { key: "location", label: "지역" },
  { key: "github", label: "깃허브" },
  { key: "positionId", label: "포지션" },
  { key: "stacks", label: "기술 스택" },
];
