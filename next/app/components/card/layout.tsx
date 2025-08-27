"use client";
import { useRouter } from "next/navigation";
import Image from "next/image";
import type { Post, User, BoardType } from "@/app/model/type";
import { WORK_MODE } from "@/app/constants/forms/workMode";
import { stackMock } from "@/app/mock/stack";
import beginner from "@/app/assets/beginner.svg";
import MatchLabel from "./matchLabel";
// import { computeTeammateMatchLabels } from "@/app/utils/cardData";
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
    const positionIds = Array.isArray(post.positions)
      ? post.positions.map((p) =>
          typeof p === "string" ? parseInt(p) || 0 : p
        )
      : [];

    const userPositionIds = currentUser.positionId
      ? [currentUser.positionId]
      : [];
    const userStackIds = currentUser.stacks || [];

    const matchLabels: {
      type: import("./matchLabel").LabelType;
      text: string;
    }[] = [];

    if (userPositionIds.length > 0 && positionIds.length > 0) {
      const hasPositionMatch = userPositionIds.some((userPosId) =>
        positionIds.some((posId) => String(posId) === String(userPosId))
      );
      if (hasPositionMatch) {
        matchLabels.push({ type: "포지션 일치", text: "포지션 일치" });
      }
    }

    if (userStackIds.length > 0 && post.stacks && post.stacks.length > 0) {
      const matchedStacks = userStackIds.filter((userStackId) =>
        post.stacks!.includes(userStackId)
      );
      if (matchedStacks.length > 0) {
        const stackMatchType =
          matchedStacks.length >= 3 ? "기술 일치" : "기술 부분 일치";
        matchLabels.push({ type: stackMatchType, text: stackMatchType });
      }
    }

    if (matchLabels.length === 0) {
      matchLabels.push({ type: "해당 없음", text: "해당 없음" });
    }

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
    const elements: JSX.Element[] = [];

    // 기술 스택 표시
    if (data?.stacks?.length) {
      data.stacks.forEach((stackId) => {
        const stackName = stackMock.techStack.find(
          (stack) => stack.stackId === stackId
        )?.name;
        elements.push(
          <span key={`stack-${stackId}`}>{stackName || `ID: ${stackId}`}</span>
        );
      });
    }

    if (elements.length === 0) {
      return <span className="text-gray-400">기술 스택 및 포지션 없음</span>;
    }

    return elements;
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

      <div className="rounded-lg h-[14rem] border border-gray-200 p-7 mt-2">
        {renderContent()}
      </div>
      <div className="mt-3 mx-2 gap-2">
        {type === "team" ? renderMatchLabels() : renderBeginnerBadge()}
      </div>
      <div className="mt-4 mx-4 flex gap-2 flex-wrap">{renderTechStacks()}</div>
    </div>
  );
}
