import {WORK_MODE} from "@/app/constants/forms/workMode";
export const CREATE_TEAM_LABEL = [
	{ id: "title", label: "이름"},
	{ id: "content", label: "내용", placeholder:"내용을 입력하세요"},
	{ id: "capacity", label: "모집 인원"},
	{ id: "positions", label:"모집 분야"},
	{ id: "stacks", label:"모집 기술"},
	{ id: "workMode", label: "진행방식",options:WORK_MODE},
	{ id: "location", label: "지역" },
	{ id: "endDate", label: "마감기한"},
];