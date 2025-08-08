import {LabelType} from "@/app/components/card/matchLabel";
import {Stack} from "@/app/model/stack";

interface CardLayoutProps {
	updatedAt:Date;
	isPublic?: string;
	description: string;
	labels: LabelType[];
	stacks:Stack[]
	type?: "teammate" | "team";
}

const CardLayout =()=>{
	return (
		<div className="max-w-80 h-[22rem] border rounded-xl border-gray-300 flex flex-col p-4 font-semibold text-sm mt-8">
				<div className="flex  justify-between mx-2 my-2">
					<div className="text-main">2010-08-12</div>
					<div>온라인</div>
				</div>
				<div className="rounded-lg max-w-72 h-[12rem] border border-gray-200 p-7 mt-2">콘텐츠 자리</div>
			<div className="mt-4 mx-4 flex gap-2">
				라벨자리
			</div>
			<div className="mt-4 mx-4 flex gap-2 flex-wrap ">기술스택</div>
		</div>
	)
}
export default CardLayout;