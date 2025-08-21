"use client";

import Card from "@/app/components/card/layout";
import { useEffect, useRef } from "react";
import { useInfiniteTeammates } from "@/app/hooks/usePosts";
import type { Post } from "@/app/model/type";
import {
  toTeammateCardData,
  computeTeammateMatchLabels,
} from "@/app/utils/cardData";
import { currentUserMock } from "@/app/mock/currentUser";

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

  const items = (data?.pages ?? []).flat() as Post[];

  return (
    <div>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {items.map((p) => {
          const card = toTeammateCardData(p);
          const match = computeTeammateMatchLabels(
            card,
            currentUserMock.positionIds as Array<number | string>,
            currentUserMock.stackIds as number[]
          );
          return (
            <Card
              key={card.id}
              id={card.id}
              type={card.type}
              data={card}
              labels={match.map((m) => m.type)}
            />
          );
        })}
      </div>
      <div ref={sentinelRef} className="h-8" />
    </div>
  );
};

export default InfiniteTeammateList;
