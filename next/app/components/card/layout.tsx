"use client";
import { useRouter } from "next/navigation";
import Image from "next/image";
import type { Post, User, BoardType } from "@/app/model/type";
import { WORK_MODE } from "@/app/constants/forms/workMode";
import { stackMock } from "@/app/mock/stack";
import beginner from "@/app/assets/beginner.svg";
import MatchLabel from "./matchLabel";
import { computeTeammateMatchLabels } from "@/app/utils/cardData";
import { useCurrentUser } from "@/app/hooks/useUserProfile";

interface CardLayoutProps<T extends BoardType> {
  id: string | number;
  type: T;
  data?: Post | User;
}

export default function CardLayout<T extends BoardType>({
  type,
  data,
  id,
}: CardLayoutProps<T>) {
  const router = useRouter();
  const { data: currentUser, error: userError } = useCurrentUser();

  const handleClick = () => {
    const path = type === "team" ? `/team/${id}` : `/teammate/${id}`;
    router.push(path);
  };

  // 매칭 라벨
  const renderMatchLabels = () => {
    if (type !== "team" || !data) return null;

    const post = data as Post;
    if (!currentUser || userError) {
      return (
        <MatchLabel type="로그인 후 일치 여부 확인가능">로그인 필요</MatchLabel>
      );
    }

    // Post 데이터를 CardData 형태로 변환
    const positionIds = Array.isArray(post.positions)
      ? post.positions.map((p) =>
          typeof p === "string" ? parseInt(p) || 0 : p
        )
      : [];

    const cardData = {
      id: post.postId,
      type: "teammate" as const,
      dateText: post.endDate || "",
      workMode: post.workMode,
      title: post.title,
      content: post.content,
      stackIds: post.stacks || [],
      positionIds,
      labels: [],
    };

    // 매칭 라벨 계산
    const userPositionIds = currentUser.positionId
      ? [currentUser.positionId]
      : [];
    const userStackIds = currentUser.stacks || [];

    const matchLabels = computeTeammateMatchLabels(
      cardData,
      userPositionIds,
      userStackIds
    );

    if (matchLabels.length === 0) return null;

    return (
      <>
        {matchLabels.map((label, index) => (
          <MatchLabel key={index} type={label.type}>
            {label.text}
          </MatchLabel>
        ))}
      </>
    );
  };

  const renderBeginnerBadge = () => {
    if (type !== "teammate" || !data) return <div className="w-5 h-5" />;

    const user = data as User;
    return user.beginner ? (
      <Image
        src={beginner}
        alt="새싹"
        width={20}
        height={20}
        className="w-5 h-5"
      />
    ) : (
      <div className="w-5 h-5" />
    );
  };

  const renderTechStacks = () => {
    if (!data?.stacks?.length) {
      return <span className="text-gray-400">기술 스택 없음</span>;
    }

    return data.stacks.map((stackId) => {
      const stackName = stackMock.techStack.find(
        (stack) => stack.stackId === stackId
      )?.name;

      return (
        <span key={stackId.toString()}>{stackName || `ID: ${stackId}`}</span>
      );
    });
  };

  const renderDate = () => {
    if (!data?.createdAt) return "날짜 없음";
    try {
      return new Date(data.createdAt).toLocaleDateString();
    } catch {
      return "날짜 없음";
    }
  };

  const renderWorkMode = () => {
    const workMode = WORK_MODE.find((mode) => mode.id === data?.workMode);
    return workMode?.label || "정보 없음";
  };

  const renderContent = () => {
    if (!data) return <div className="text-gray-400">데이터 없음</div>;

    if (type === "teammate") {
      const user = data as User;
      return (
        <>
          <div className="font-bold text-black text-lg mb-2">
            {user.nickname || "이름 없음"}
          </div>
          <div className="text-gray-600">{user.description || "설명 없음"}</div>
        </>
      );
    }

    const post = data as Post;
    return (
      <>
        <div className="font-bold text-black text-lg mb-2">
          {post.title || "제목 없음"}
        </div>
        <div className="text-gray-600">{post.content || "내용 없음"}</div>
      </>
    );
  };

  return (
    <div
      className="h-[22rem] border rounded-xl border-gray-300 flex flex-col p-4 font-semibold text-sm mt-14 cursor-pointer"
      onClick={handleClick}
    >
      <div className="flex justify-between mx-2 my-2">
        <div className="text-main">{renderDate()}</div>
        <div>{renderWorkMode()}</div>
      </div>

      <div className="rounded-lg max-w-72 h-[14rem] border border-gray-200 p-7 mt-2">
        {renderContent()}
      </div>
      <div className="mt-3 mx-2 gap-2">
        {type === "team" ? renderMatchLabels() : renderBeginnerBadge()}
      </div>
      <div className="mt-4 mx-4 flex gap-2 flex-wrap">{renderTechStacks()}</div>
    </div>
  );
}
