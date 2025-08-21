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
	{ key: "title", label: "제목" },
	{ key: "workMode", label: "작업 방식" },
	{ key: "location", label: "지역" },
	{ key: "endDate", label: "마감일" },
	{ key: "positions", label: "모집 포지션" },
	{ key: "stacks", label: "기술 스택" },
	{ key: "content", label: "소개" },
];

type TeammateItemKey = keyof User;

type TeammateItem = {
	key: TeammateItemKey;
	label: string;
};

export const teammateItem: TeammateItem[] = [
	{ key: "nickName", label: "제목" },
	{ key: "workMode", label: "작업 방식" },
	{ key: "location", label: "지역" },
	{ key: "positionId", label: "모집 포지션" },
	{ key: "stacks", label: "기술 스택" },
	{ key: "description", label: "소개" },
];
