"use client";

import CardLayout from "@/app/components/card/layout";
import { useEffect, useRef } from "react";
import { useInfiniteTeams } from "@/app/hooks/usePosts";
import type { Post } from "@/app/model/type";

const InfiniteTeamList = ({ limit = 12 }: { limit?: number }) => {
  const { data, fetchNextPage, hasNextPage, isFetchingNextPage } =
    useInfiniteTeams(limit);
  const sentinelRef = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    const el = sentinelRef.current;
    if (!el) return;
    const io = new IntersectionObserver((entries) => {
      if (entries[0].isIntersecting && hasNextPage && !isFetchingNextPage) {
        fetchNextPage();
      }
    });
    io.observe(el);
    return () => io.disconnect();
  }, [hasNextPage, isFetchingNextPage, fetchNextPage]);

  const items = (data?.pages ?? []).flat() as Post[];

  return (
    <div>
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4">
        {items.map((post) => {
          return (
            <CardLayout
              key={post.postId}
              id={post.postId}
              type="team"
              data={post}
            />
          );
        })}
      </div>
      <div ref={sentinelRef} className="h-8" />
    </div>
  );
};

export default InfiniteTeamList;
