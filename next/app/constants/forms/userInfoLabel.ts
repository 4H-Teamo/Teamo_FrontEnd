import {WORK_MODE} from "@/app/constants/forms/workMode";
import {BEGINNER} from "@/app/constants/forms/beginner";
import {POSITION} from "@/app/constants/forms/positions";

export const USERINFO_LABEL = [
	{ id: "NAME", label: "이름",type:"text",placeholder:"이름"},
	{ id: "LOCATION", label: "지역", type:"text" ,placeholder:"지역"},
	{ id: "GITHUB", label: "깃허브", type:"text",placeholder:"깃허브"},
	{ id: "BEGINNER", label: "새싹여부",type:"select",options:BEGINNER,placeholder:"새싹여부"},
	{ id: "WORK_MODE", label: "진행여부",type:"select" ,options:WORK_MODE,placeholder:"진행여부"},
	{ id: "POSITION", label:"포지션", type:"select", options:POSITION, placeholder:"포지션"},
	{ id: "STACK", label:"기술스택", type:"multiSelect"},
	{ id: "DESCRIPTION", label:"자기소개",type:"textarea" ,placeholder:"자기소개를 입력하세요"},
];