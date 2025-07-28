import {WORK_MODE} from "@/app/constants/forms/workMode";
import {BEGINNER} from "@/app/constants/forms/beginner";
import {POSITION} from "@/app/constants/forms/positions";

export const USERINFO_LABEL = [
	{ id: "NAME", label: "이름",type:"text",placeholder:"새싹여부"},
	{ id: "LOCATION", label: "지역", type:"text" ,placeholder:"새싹여부"},
	{ id: "GITHUB", label: "깃허브", type:"text",placeholder:"새싹여부"},
	{ id: "BEGINNER", label: "새싹여부",type:"select",options:BEGINNER,placeholder:"새싹여부"},
	{ id: "WORK_MODE", label: "진행여부",type:"select" ,options:WORK_MODE,placeholder:"새싹여부"},
	{ id: "POSITION", label: "포지션",type:"select" ,options:POSITION,placeholder:"새싹여부" },
];