import clsx from "clsx";

// 필터 옵션 정의
const FILTER_OPTIONS: ("팀 찾기" | "팀원 찾기")[] = ["팀 찾기", "팀원 찾기"];

// 버튼 스타일 함수
const getButtonStyle = (isSelected: boolean) => {
  return clsx(
    "px-4 py-2 rounded-lg transition-colors duration-200 font-bold",
    isSelected ? "text-main" : "text-gray-600"
  );
};

interface FilterTabProps {
  activeTab: "팀 찾기" | "팀원 찾기";
  onTabChange: (tab: "팀 찾기" | "팀원 찾기") => void;
}

export const FilterTab = ({ activeTab, onTabChange }: FilterTabProps) => {
  const handleFilterChange = (tab: "팀 찾기" | "팀원 찾기") => {
    onTabChange(tab);
  };

  return (
    <div className="flex flex-row gap-2">
      {FILTER_OPTIONS.map((option) => (
        <button
          key={option}
          className={getButtonStyle(activeTab === option)}
          onClick={() => handleFilterChange(option)}
        >
          {option}
        </button>
      ))}
    </div>
  );
};
