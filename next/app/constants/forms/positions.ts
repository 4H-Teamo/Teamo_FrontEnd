export const POSITION = [
	{ id: "FULL_STACK", value:"FULL_STACK",label: "풀스택" },
	{ id: "WEB_FRONTEND", value:"WEB_FRONTEND",label: "웹 프론트엔드" },
	{ id: "APP_FRONTEND", value:"APP_FRONTEND",label: "앱 프론트엔드" },
	{ id: "BACKEND",value: "BACKEND",label: "백엔드" },
	{ id: "DESIGNER", value:"DESIGNER", label: "디자이너" },
	{ id: "DATA_ANALYST",value:"DATA_ANALYST",label: "데이터 분석가" },
	{ id: "AI", value:"AI",label: "AI" },
	{ id: "PM", value:"PM",label: "기획자" },
] as const;
export type Positions = typeof POSITION[number];