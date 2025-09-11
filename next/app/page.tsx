"use client";

import StackDemandSupplyChart from "@/app/components/dashboard/StackDemandSupplyChart";
import CardLayout from "@/app/components/card/layout";
import { useEffect } from "react";
import {
  useTeamsLimited,
  useTeammatesLimited,
  useTechStackDemandSupply,
} from "@/app/hooks/usePosts";
import type { Post, User } from "@/app/model/type";
import { stackMock } from "@/app/mock/stack";

export default function Home() {

  const { data: teamPosts } = useTeamsLimited(3); // 팀원 구해요 = posts
  const { data: users } = useTeammatesLimited(3); // 팀 구해요 = users

  const { data: ds } = useTechStackDemandSupply();
  useEffect(() => {
    if (ds) {
      console.log("[통계 API 응답] /analysis/tech-stack-demand-supply", ds);
    }
  }, [ds]);
  const stats = (ds?.demand ?? []).map((d) => {
    const idNum = Number(d.stackId);
    const supplyItem = (ds?.supply ?? []).find(
      (x) => Number(x.stackId) === idNum
    );
    const mappedName =
      stackMock.techStack.find((t) => t.stackId === idNum)?.name || d.stackName;
    const demandNum = Number(d.count ?? 0) || 0;
    const supplyNum = Number(supplyItem?.count ?? 0) || 0;
    return {
      stackId: idNum,
      name: mappedName,
      demand: demandNum,
      supply: supplyNum,
    };
  });

  useEffect(() => {
    if (stats?.length) {
      console.log("[차트 데이터 계산 결과]", stats);
    }
  }, [stats]);

  return (
    <div className="flex flex-col gap-10">
      <h2 className="text-xl font-bold text-black">수요와 공급</h2>
      <StackDemandSupplyChart stats={stats} />
      <section className="flex flex-col gap-4">
        <h2 className="text-xl font-bold text-black">팀원 구해요</h2>
        <div className="relative">
          <div
            className="flex gap-4 overflow-x-auto snap-x snap-mandatory no-scrollbar scroll-p-4 pr-4"
            style={{ WebkitOverflowScrolling: "touch" }}
          >
            {(teamPosts as Post[] | undefined)?.map((post) => (
              <div
                key={post.postId}
                className="min-w-[18rem] md:min-w-[22rem] snap-start"
              >
                <CardLayout id={post.postId} type="team" data={post} />
              </div>
            ))}
          </div>
        </div>
      </section>
      <section className="flex flex-col gap-4">
        <h2 className="text-xl font-bold text-black">팀 구해요</h2>
        <div className="relative">
          <div
            className="flex gap-4 overflow-x-auto snap-x snap-mandatory no-scrollbar scroll-p-4 pr-4"
            style={{ WebkitOverflowScrolling: "touch" }}
          >
            {(users as User[] | undefined)?.map((user) => (
              <div
                key={user.userId}
                className="min-w-[18rem] md:min-w-[22rem] snap-start"
              >
                <CardLayout
                  id={user.userId || ""}
                  type="teammate"
                  data={user}
                />
              </div>
            ))}
          </div>
        </div>
      </section>
    </div>
  );
}
