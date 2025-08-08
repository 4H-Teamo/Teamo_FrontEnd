import type { ReactNode } from "react";

export type LabelType =
	| "포지션 일치"
	| "기술 일치"
	| "기술 부분 일치"
	| "해당 없음"
	| "로그인 후 일치 여부 확인가능";

interface LabelProps {
	type: LabelType;
	children: ReactNode;
}

const matchLabel=({ type, children }: LabelProps) =>{
	const baseStyle =
		"min-w-[75px] h-[26px] px-3 flex items-center justify-center border rounded-full text-white text-xs";
	const bgColor = (() => {
		switch (type) {
			case "포지션 일치":
				return "bg-main";
			case "기술 일치":
			case "기술 부분 일치":
				return "bg-skillMatch";
			case "해당 없음":
				return "bg-noMatch";
			case "로그인 후 일치 여부 확인가능":
				return "bg-needLogin";
			default:
				return "bg-gray-200";
		}
	})();

	return <div className={`${baseStyle} ${bgColor}`}>{children}</div>;
}

export default  matchLabel