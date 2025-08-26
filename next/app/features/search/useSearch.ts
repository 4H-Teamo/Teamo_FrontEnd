import { useState, useMemo } from "react";
import { useRouter } from "next/navigation";
import type { Post, User } from "../../model/type";
import { useTeamPosts } from "@/app/hooks/usePosts";
import { useTeammates } from "@/app/hooks/useTeammate";

export const useSearch = () => {
  const [search, setSearch] = useState("");
  const [tab, setTab] = useState<"팀 찾기" | "팀원 찾기">("팀 찾기");
  const [selectedStacks, setSelectedStacks] = useState<number[]>([]);
  const [selectedPositions, setSelectedPositions] = useState<number[]>([]);

  const router = useRouter();

  const {
    data: posts = [],
    isLoading: postsLoading,
    isError: postsError,
  } = useTeamPosts();
  const {
    data: teammates = [],
    isLoading: teammatesLoading,
    isError: teammatesError,
  } = useTeammates();

  const keyword = search.toLowerCase();

  const filteredResults = useMemo(() => {
    const data = tab === "팀 찾기" ? posts : teammates;

    // 디버깅 로그
    console.log(`현재 탭: ${tab}`);
    console.log(`데이터 개수: ${data.length}`);
    console.log(`선택된 스택: ${selectedStacks}`);
    console.log(`선택된 포지션: ${selectedPositions}`);
    console.log(`키워드: "${keyword}"`);

    const matchesTeamKeyword = (post: Post) => {
      if (!keyword) return true;

      return (
        (post.title && post.title.toLowerCase().includes(keyword)) ||
        (post.content && post.content.toLowerCase().includes(keyword))
      );
    };

    const matchesTeammateKeyword = (teammate: User) => {
      if (!keyword) return true;

      return (
        (teammate.nickname &&
          teammate.nickname.toLowerCase().includes(keyword)) ||
        (teammate.description &&
          teammate.description.toLowerCase().includes(keyword))
      );
    };

    const matchesKeyword = (item: Post | User) => {
      if (tab === "팀 찾기") {
        return matchesTeamKeyword(item as Post);
      } else {
        return matchesTeammateKeyword(item as User);
      }
    };

    const matchesStacks = (item: Post | User) => {
      if (selectedStacks.length === 0) return true;
      return (
        item.stacks &&
        selectedStacks.some((stackId) => item.stacks!.includes(stackId))
      );
    };

    const matchesPositions = (item: Post | User) => {
      if (selectedPositions.length === 0) return true;

      if (tab === "팀 찾기") {
        const post = item as Post;
        return (
          post.positions &&
          selectedPositions.some((posId) =>
            post.positions!.some((p) => String(p) === String(posId))
          )
        );
      } else {
        const teammate = item as User;
        return (
          teammate.positionId &&
          selectedPositions.includes(Number(teammate.positionId))
        );
      }
    };

    // 모든 필터 조건을 만족하는지 확인
    const passesAllFilters = (item: Post | User) => {
      return (
        matchesKeyword(item) && matchesStacks(item) && matchesPositions(item)
      );
    };

    return data.filter(passesAllFilters);
  }, [keyword, selectedStacks, selectedPositions, tab, posts, teammates]);

  const handleItemClick = (item: Post | User) => {
    if (tab === "팀 찾기") {
      router.push(`/team/${(item as Post).postId}`);
    } else {
      router.push(`/teammate/${(item as User).userId}`);
    }
  };

  return {
    keyword,
    search,
    setSearch,
    tab,
    setTab,
    selectedStacks,
    setSelectedStacks,
    selectedPositions,
    setSelectedPositions,
    isLoading: postsLoading || teammatesLoading,
    isError: postsError || teammatesError,
    filteredResults,
    handleItemClick,
    router,
  };
};
