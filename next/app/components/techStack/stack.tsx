"use client";

import React, { useState } from "react";
import TechStackLabel from "@/app/components/techStack/stackLabel";
import { stackMock } from "@/app/mock/stack";
import SearchInput from "@/app/components/searchInput/searchInput";
import SelectStack from "@/app/components/techStack/selectStack";
import type { Stack } from "@/app/model/stack";
import clsx from "clsx";

type TechStackProps = {
  value: number[];
  className?: string;
  onChange: (stacks: number[]) => void;
};

const TechStack = ({ className, value, onChange }: TechStackProps) => {
  const [search, setSearch] = useState("");
  const isSelected = (stacks: Stack) => {
    return value.includes(stacks.stackId);
  };

  const handleToggle = (stacks: Stack) => {
    const exists = isSelected(stacks);
    const updatedStacks = exists
      ? value.filter((id) => id !== stacks.stackId)
      : [...value, stacks.stackId];
    onChange(updatedStacks);
  };

  const handleRemove = (stackId: number) => {
    const updatedStacks = value.filter((id) => id !== stackId);
    onChange(updatedStacks);
  };

  const filteredStacks = stackMock.techStack.filter((stack) =>
    stack.name.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div
      className={clsx(
        "w-full flex flex-col gap-4 p-4 border border-gray-300 rounded-xl md:w-6/8 lg:w-[54rem]",
        className
      )}
    >
      <SearchInput readOnly={false} value={search} onChange={setSearch} />
      <SelectStack selected={value} onRemove={handleRemove} />
      <TechStackLabel
        stacks={filteredStacks}
        selected={value}
        onToggle={handleToggle}
      />
    </div>
  );
};

export default TechStack;
