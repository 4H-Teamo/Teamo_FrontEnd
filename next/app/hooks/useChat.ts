import { useMessageHandler } from "@/app/socket/messageHandler";
import { useChatStore } from "@/app/store/chatStore";

interface ChatRoom {
  id: string;
  participants: string[];
  createdAt: string;
}

// 백엔드 API 호출 함수 (프록시 사용)
export const createChatRoom = async (
  participants: string[]
): Promise<ChatRoom> => {
  console.log("🏠 채팅방 생성 API 호출:", { participants });

  const res = await fetch("/api/proxy/chat-rooms", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({ participants }),
    credentials: "include",
  });

  console.log("🏠 채팅방 생성 API 응답:", {
    status: res.status,
    ok: res.ok,
    url: res.url,
  });

  if (!res.ok) {
    const errorText = await res.text();
    console.error("❌ 채팅방 생성 API 실패:", errorText);
    throw new Error("❌채팅방 생성 실패");
  }

  const data = await res.json();
  console.log("✅ 채팅방 생성 성공 (DB 저장됨):", data);
  return data;
};

export const useChat = () => {
  const { createRoom } = useMessageHandler();
  const { addRoom } = useChatStore();

  const startChat = async (
    targetUserId: string,
    currentUserId: string
  ): Promise<ChatRoom | null> => {
    try {
      // 1. 백엔드 API로 채팅방 생성 (기존 채팅방 확인 포함)
      const roomData = await createChatRoom([currentUserId, targetUserId]);

      // 2. 생성된 채팅방을 로컬 스토어에 추가
      const newRoom = {
        roomId: roomData.id,
        participants: roomData.participants,
        messages: [],
        unreadCount: 0,
      };
      addRoom(newRoom);

      // 3. 소켓으로 채팅방 참여
      createRoom(targetUserId);

      return {
        id: roomData.id,
        participants: roomData.participants,
        createdAt: roomData.createdAt,
      };
    } catch (error) {
      console.error("채팅방 생성 실패:", error);
      throw error;
    }
  };

  return { startChat };
};
