"use client";
import SearchInput from "@/app/components/searchInput/searchInput";
import Stack from "@/app/components/techStack/stack";
import Position from "../components/position/position";
import { FilterTab } from "../components/filterTab/filterTab";
import { useSearch } from "@/app/features/search/useSearch";
import CardLayout from "@/app/components/card/layout";
import type { Post, User } from "@/app/model/type";

const Filter = () => {
  const {
    search,
    setSearch,
    tab,
    setTab,
    selectedStacks,
    setSelectedStacks,
    selectedPositions,
    setSelectedPositions,
    isLoading,
    isError,
    filteredResults,
  } = useSearch();

  if (isLoading) {
    return (
      <div className="flex justify-center items-center h-64">
        <div className="text-gray-500">검색 중...</div>
      </div>
    );
  }

  if (isError) {
    return (
      <div className="flex justify-center items-center h-64">
        <div className="text-red-500">검색 중 오류가 발생했습니다.</div>
      </div>
    );
  }

  return (
    <div className="flex flex-col gap-8">
      <div className="flex flex-col gap-5 border border-gray-300 rounded-lg p-10">
        <FilterTab activeTab={tab} onTabChange={setTab} />
        <SearchInput
          readOnly={false}
          className="w-full h-12"
          value={search}
          onChange={setSearch}
          placeholder={`${tab}`}
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
      <div className="space-y-4">
        <div className="flex justify-between items-center">
          <h2 className="text-xl font-bold text-gray-800">
            {tab} 검색 결과 ({filteredResults.length}개)
          </h2>
          {selectedStacks.length > 0 || selectedPositions.length > 0 ? (
            <button
              onClick={() => {
                setSelectedStacks([]);
                setSelectedPositions([]);
              }}
              className="text-sm text-gray-500 hover:text-gray-700 underline"
            >
              필터 초기화
            </button>
          ) : null}
        </div>

        {filteredResults.length === 0 ? (
          <div className="text-center py-12 text-gray-500">
            검색 결과가 없습니다.
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            {filteredResults.map((item: Post | User) => (
              <div
                key={
                  tab === "팀 찾기"
                    ? (item as Post).postId
                    : (item as User).userId
                }
              >
                <CardLayout
                  type={tab === "팀 찾기" ? "team" : "teammate"}
                  data={item}
                  id={
                    tab === "팀 찾기"
                      ? (item as Post).postId || 0
                      : (item as User).userId || 0
                  }
                />
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default Filter;
