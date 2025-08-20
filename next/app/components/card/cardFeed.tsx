"use client";
import { useRouter } from "next/navigation";
import Image from "next/image";
import type { Post, User, BoardType } from "@/app/model/type";
import { WORK_MODE } from "@/app/constants/forms/workMode";
import { stackMock } from "@/app/mock/stack";
import beginner from "@/app/assets/beginner.svg";
interface CardLayoutProps {
  type: BoardType;
  data?: Post | User;
}

const CardLayout = ({ type, data }: CardLayoutProps) => {
  const router = useRouter();

  const handleClick = () => {
    if (!data) return;

    console.log("Card 클릭됨:", { type, data });

    if (type === "team") {
      const post = data as Post;
      console.log("팀 모집글 ID:", post.postId);
      router.push(`/team/${post.postId}`);
    } else {
      const user = data as User;
      console.log("사용자 ID:", user.userId);
      router.push(`/teammate/${user.userId}`);
    }
  };
  return (
    <div
      className="max-w-80 h-[22rem] border rounded-xl border-gray-300 flex flex-col p-4 font-semibold text-sm mt-14 cursor-pointer"
      onClick={handleClick}
    >
      <div className="flex justify-between mx-2 my-2">
        <div className="text-main">
          {data?.createdAt
            ? new Date(data.createdAt).toLocaleDateString()
            : "날짜 없음"}
        </div>
        <div>
          {WORK_MODE.find((mode) => mode.id === data?.workMode)?.value ||
            "정보 없음"}
        </div>
      </div>
      <div className="rounded-lg max-w-72 h-[12rem] border border-gray-200 p-7 mt-2">
        {data ? (
          <>
            <div className="font-bold text-black text-lg mb-2">
              {type === "teammate"
                ? (data as User).nickname
                : (data as Post).title}
            </div>
            <div className="text-gray-600">
              {type === "teammate"
                ? (data as User).description
                : (data as Post).content}
            </div>
          </>
        ) : (
          <div className="text-gray-400">데이터 없음</div>
        )}
      </div>
      <div className="mt-4 mx-4 flex gap-2">
        {type === "team" ? (
          "라벨"
        ) : (data as User)?.beginner ? (
          <Image
            src={beginner}
            alt="새싹"
            width={20}
            height={20}
            className="w-5 h-5"
          />
        ) : (
          <div className="w-5 h-5"></div>
        )}
      </div>
      <div className="mt-4 mx-4 flex gap-2 flex-wrap ">
        {data?.stacks && data.stacks.length > 0 ? (
          data.stacks.map((stackId) => (
            <span key={stackId.toString()}>
              {stackMock.techStack.find((stack) => stack.stackId === stackId)
                ?.name || `ID: ${stackId}`}
            </span>
          ))
        ) : (
          <span className="text-gray-400">기술 스택 없음</span>
        )}
      </div>
    </div>
  );
};
export default CardLayout;
