'use client';

import React, {useState} from "react";
import TechStackLabel from "@/app/components/techStack/stackLabel";
import { stackMock } from "@/app/mock/stack";
import SearchInput from "@/app/components/searchInput/searchInput";
import SelectStack from "@/app/components/techStack/selectStack";
import type { Stack } from "@/app/model/stack";

type TechStackProps = {
	value: Stack[];
	onChange: (stacks: Stack[]) => void;
};

const TechStack = ({ value, onChange }: TechStackProps) => {
	const [search, setSearch] =useState('');
	const isSelected = (stack: Stack) => {
		return value.some((s) => s.stackId === stack.stackId);
	};

	const handleToggle = (stack: Stack) => {
		const exists = isSelected(stack);
		const updatedStacks = exists
			? value.filter((s) => s.stackId !== stack.stackId)
			: [...value, stack];
		onChange(updatedStacks);
	};

	const handleRemove = (stackId: number) => {
		const updatedStacks = value.filter((s) => s.stackId !== stackId);
		onChange(updatedStacks);
	};

	const filteredStacks = stackMock.techStack.filter((stack) =>
		stack.name.toLowerCase().includes(search.toLowerCase())
	);

	return (
		<div className="w-full flex flex-col gap-4 p-4 border border-gray-300 rounded-xl md:w-6/8 lg:w-[54rem]">
			<SearchInput readOnly={false} value={search} onChange={setSearch} />
			<SelectStack selected={value} onRemove={handleRemove} />
			<TechStackLabel stacks={filteredStacks} selected={value} onToggle={handleToggle} />
		</div>
	);
};

export default TechStack;