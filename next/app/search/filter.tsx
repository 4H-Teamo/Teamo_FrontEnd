"use client";
import SearchInput from "@/app/components/searchInput/searchInput";
import Stack from "@/app/components/techStack/stack";
import { useState } from "react";
import Position from "../components/position/position";
import { FilterTab } from "../components/filterTab/filterTab";

const Filter = () => {
  const [search, setSearch] = useState("");
  const [selectedStacks, setSelectedStacks] = useState<number[]>([]);
  const [selectedPositions, setSelectedPositions] = useState<number[]>([]);
  return (
    <div className="flex flex-col gap-5 border border-gray-300 rounded-lg p-10">
      <FilterTab />
      <SearchInput
        readOnly={false}
        className="w-full h-12"
        value={search}
        onChange={setSearch}
      />
      <Stack
        value={selectedStacks}
        onChange={setSelectedStacks}
        className="lg:w-full"
      />
      <Position
        value={selectedPositions}
        onChange={setSelectedPositions}
        className=""
      />
    </div>
  );
};
export default Filter;
