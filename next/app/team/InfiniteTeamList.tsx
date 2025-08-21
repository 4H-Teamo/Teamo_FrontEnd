"use client";

import Card from "@/app/components/card/layout";
import { useEffect, useRef } from "react";
import { useInfiniteTeams } from "@/app/hooks/usePosts";
import type { User } from "@/app/model/type";
import { toTeamCardData } from "@/app/utils/cardData";

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

  const items = (data?.pages ?? []).flat() as User[];

  return (
    <div>
      <div className="grid grid-cols-1 gap-4 md:grid-cols-2 lg:grid-cols-3">
        {items.map((u) => {
          const card = toTeamCardData(u);
          return (
            <Card key={card.id} id={card.id} type={card.type} data={card} />
          );
        })}
      </div>
      <div ref={sentinelRef} className="h-8" />
    </div>
  );
};

export default InfiniteTeamList;
