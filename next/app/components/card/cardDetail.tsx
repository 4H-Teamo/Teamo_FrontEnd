"use client";

import CardField from "@/app/components/card/cardField";
import { BoardType, Post, User } from "@/app/model/type";
import Button from "../button/button";
import { formatISOToKorean } from "@/app/utils/formatDate";
import { useChat } from "@/app/hooks/useChat";
import { useAccessToken } from "@/app/hooks/useUser";
import { useCurrentUser } from "@/app/hooks/useUserProfile";
import { useState } from "react";

interface CardLayoutProps {
  type: BoardType;
  data: Post | User;
}

const CardDetail = ({ type, data }: CardLayoutProps) => {
  const { accessToken } = useAccessToken();
  const { data: currentUser } = useCurrentUser();
  const { startChat } = useChat();
  const [isCreating, setIsCreating] = useState(false);

  const handleStartChat = async () => {
    if (!accessToken || !currentUser?.userId) {
      alert("로그인이 필요합니다.");
      return;
    }

    const targetUserId = (data as User).userId;
    if (!targetUserId) {
      alert("사용자 정보를 찾을 수 없습니다.");
      return;
    }

    setIsCreating(true);
    try {
      const result = await startChat(targetUserId, currentUser.userId);
      console.log("채팅방 생성됨:", result);

      // 채팅방 생성 완료
      if (result && result.id) {
        alert(
          `채팅방이 생성되었습니다! (ID: ${result.id})\n채팅 아이콘을 클릭하여 대화를 시작하세요.`
        );
      } else {
        alert("채팅방이 생성되었습니다!");
      }
    } catch (error) {
      console.error("채팅방 생성 실패:", error);
      alert("채팅방 생성에 실패했습니다.");
    } finally {
      setIsCreating(false);
    }
  };
  return (
    <div className="flex flex-col h-full gap-12 ">
      <div className="flex flex-col gap-8">
        <div className="text-main text-sm font-semibold">
          {type === "teammate"
            ? formatISOToKorean((data as User).updatedAt)
            : formatISOToKorean((data as Post).createdAt)}
        </div>

        <div className="text-3xl font-bold text-black">
          {type === "teammate" ? (data as User).nickname : (data as Post).title}
        </div>
        <div className="text-black text-xl font-semibold">
          {type === "teammate"
            ? (data as User).description
            : (data as Post).content}
        </div>
      </div>
      <div className="flex-1">
        <CardField board={type} data={data} />
      </div>
      {type === "teammate" ? (
        <div className="flex justify-end items-end mt-8">
          <div className="text-right text-gray-600 max-w-xs">
            <Button className="button-common" onClick={handleStartChat}>
              {isCreating ? "채팅방 생성 중..." : "채팅하기"}
            </Button>
          </div>
        </div>
      ) : (
        <div className="mt-8"></div>
      )}
    </div>
  );
};
export default CardDetail;
