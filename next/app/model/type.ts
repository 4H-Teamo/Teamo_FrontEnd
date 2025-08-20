import type { Stack } from "@/app/model/stack";
export type WorkMode = "ONLINE" | "OFFLINE" | "BOTH";
export type WorkModeNumeric = 1 | 2 | 3;

export type Post = {
  postId?: number | string;
  id?: number | string;
  userId?: string;
  title: string;
  content: string;
  status?: boolean;
  workMode: WorkMode | WorkModeNumeric;
  stacks: Stack[] | number[];
  endDate?: string;
  capacity?: number;
  positions: string[] | number[];
  location?: string | null;
  createdAt?: Date | string;
  updatedAt?: Date | string;
};
export type User = {
  userId: string;
  nickname: string;
  nickName?: string;
  description?: string;
  location?: string | null;
  image?: string | null;
  github?: string | null;
  workMode: WorkMode | WorkModeNumeric;
  beginner?: string | boolean;
  isPublic?: boolean;
  stacks: Stack[] | number[];
  createdAt?: Date | string;
  updatedAt?: Date | string;
  positionId?: number | null;
  posts?: Post[];
  comments?: Comment[];
  notices?: Notice[];
};
export type Notice = {
  noticeId: string;
  userId: string;
  isRead: boolean;
  message: string;
  createdAt: Date;
};

export type Board = "teammate" | "team";
