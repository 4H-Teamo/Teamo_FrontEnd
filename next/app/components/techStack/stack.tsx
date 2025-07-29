// 'use client';
// import { useState } from "react";
// import TechStackLabel from "@/app/components/techStack/stackLabel"
// import { stackMock } from "@/app/mock/stack"
// import SearchInput from "@/app/components/searchInput/searchInput";
// import SelectStack from "@/app/components/techStack/selectStack";
//
// import type{Stack} from "@/app/model/stack"
//
// const TechStack = () => {
// 	const [search, setSearch] = useState('');
// 	const selectedStacks = []
//
// 	const isSelected = (stack: Stack) => {
// 		return selectedStacks.some((s) => s.stackId === stack.stackId);
// 	}
//
// 	const handleToggle = (stack: Stack) => {
// 		if (!user) return;
// 		const exists = isSelected(stack);
// 		const updatedStacks = exists
// 			? selectedStacks.filter((s) => s.stackId !== stack.stackId)
// 			: [...selectedStacks, stack];
// 		setUser({ ...user, userStacks: updatedStacks });
// 	};
//
// 	const handleRemove = (stackId: string) => {
// 		if (!user) return;
// 		const updatedStacks = selectedStacks.filter((s) => s.stackId !== stackId);
// 		setUser({ ...user, userStacks: updatedStacks });
// 	};
//
// 	return (
// 		<div className="w-full flex flex-col gap-4 p-4 border border-gray-300 rounded-xl">
// 			<SearchInput readOnly={false} value={search} onChange={setSearch} />
// 			<SelectStack
// 				selected={selectedStacks}
// 				onRemove={handleRemove}
// 			/>
// 			<TechStackLabel
// 				stacks={techStack}
// 				selected={selectedStacks}
// 				onToggle={handleToggle}
// 			/>
// 		</div>
// 	);
// };
//
// export default TechStack;
'use client';

import { useState } from "react";
import TechStackLabel from "@/app/components/techStack/stackLabel";
import { stackMock } from "@/app/mock/stack";
import SearchInput from "@/app/components/searchInput/searchInput";
import SelectStack from "@/app/components/techStack/selectStack";

import type { Stack } from "@/app/model/stack";

const TechStack = () => {
	const [search, setSearch] = useState('');
	const [selectedStacks, setSelectedStacks] = useState<Stack[]>([]);

	const isSelected = (stack: Stack) => {
		return selectedStacks.some((s) => s.stackId === stack.stackId);
	};

	const handleToggle = (stack: Stack) => {
		const exists = isSelected(stack);
		const updatedStacks = exists
			? selectedStacks.filter((s) => s.stackId !== stack.stackId)
			: [...selectedStacks, stack];
		setSelectedStacks(updatedStacks);
	};
	const filteredStacks = stackMock.techStack.filter((stack) =>
		stack.name.toLowerCase().includes(search.toLowerCase())
	);
	const handleRemove = (stackId: number) => {
		const updatedStacks = selectedStacks.filter((s) => s.stackId !== stackId);
		setSelectedStacks(updatedStacks);
	};

	return (
		<div className="w-full flex flex-col gap-4 p-4 border border-gray-300 rounded-xl md:w-6/8 lg:w-[54rem]">
			<SearchInput readOnly={false} value={search} onChange={setSearch} />
			<SelectStack
				selected={selectedStacks}
				onRemove={handleRemove}
			/>
			<TechStackLabel
				stacks={filteredStacks}
				selected={selectedStacks}
				onToggle={handleToggle}
			/>
		</div>
	);
};

export default TechStack;