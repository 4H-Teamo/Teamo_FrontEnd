"use client";

import CardLayout from "@/app/components/card/layout";
import { useEffect, useRef } from "react";
import { useInfiniteTeammates } from "@/app/hooks/usePosts";
import type { User } from "@/app/model/type";

const InfiniteTeammateList = ({ limit = 12 }: { limit?: number }) => {
  const { data, fetchNextPage, hasNextPage, isFetchingNextPage } =
    useInfiniteTeammates(limit);
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

  const items = (data?.pages ?? []).flat() as User[];

  return (
    <div>
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4">
        {items.map((user) => {
          return (
            <CardLayout
              key={user.userId}
              id={user.userId || ""}
              type="teammate"
              data={user}
            />
          );
        })}
      </div>
      <div ref={sentinelRef} className="h-8" />
    </div>
  );
};

export default InfiniteTeammateList;
