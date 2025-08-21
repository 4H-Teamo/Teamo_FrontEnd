import { filterType } from "@/app/model/type";
import clsx from "clsx";
import { useState } from "react";

// 필터 옵션 정의
const FILTER_OPTIONS: filterType[] = ["팀 구해요", "팀원 구해요"];

// 버튼 스타일 함수
const getButtonStyle = (isSelected: boolean) => {
  return clsx(
    "px-4 py-2 rounded-lg transition-colors duration-200 font-bold",
    isSelected ? "text-main" : "text-gray-600"
  );
};

export const FilterTab = () => {
  const [selectedFilter, setSelectedFilter] = useState<filterType>("팀 구해요");

  const handleFilterChange = (filter: filterType) => {
    setSelectedFilter(filter);
  };

  return (
    <div className="flex flex-row gap-2">
      {FILTER_OPTIONS.map((option) => (
        <button
          key={option}
          className={getButtonStyle(selectedFilter === option)}
          onClick={() => handleFilterChange(option)}
        >
          {option}
        </button>
      ))}
    </div>
  );
};
