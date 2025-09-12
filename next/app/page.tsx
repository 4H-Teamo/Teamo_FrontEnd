"use client";

import StackDemandSupplyChart from "@/app/components/dashboard/StackDemandSupplyChart";
import CardLayout from "@/app/components/card/layout";
import PageHeader from "@/app/components/pageHeader/header";
import { useEffect } from "react";
import {
  useTeamsLimited,
  useTeammatesLimited,
  useTechStackDemandSupply,
} from "@/app/hooks/usePosts";
import type { Post, User } from "@/app/model/type";
import { stackMock } from "@/app/mock/stack";

export default function Home() {
  const { data: teamPosts } = useTeamsLimited(4); // 팀원 구해요 = posts
  const { data: users } = useTeammatesLimited(4); // 팀 구해요 = users

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
    <div>
      <PageHeader title="수요와 공급" />
      <div className="mt-4">
        <StackDemandSupplyChart stats={stats} />
      </div>

      <div className="mt-8">
        <PageHeader title="팀원 구해요" />
        <div className="mt-4">
          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4">
            {(teamPosts as Post[] | undefined)?.map((post) => (
              <CardLayout
                key={post.postId}
                id={post.postId}
                type="team"
                data={post}
              />
            ))}
          </div>
        </div>
      </div>

      <div className="mt-8">
        <PageHeader title="팀 구해요" />
        <div className="mt-4">
          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4">
            {(users as User[] | undefined)?.map((user) => (
              <CardLayout
                key={user.userId}
                id={user.userId || ""}
                type="teammate"
                data={user}
              />
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
