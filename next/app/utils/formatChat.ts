import {
  ChatRoomResponse,
  ChatRoom,
  Message,
  UIMessage,
} from "@/app/types/chat";

// 백엔드 응답-> 프론트엔드 타입
export const transformChatRoom = (response: ChatRoomResponse): ChatRoom => ({
  id: response.id,
  participants: response.participants,
  createdAt: response.createdAt,
  updatedAt: response.updatedAt,
  lastMessage: response.lastMessage,
  unreadCount: response.unreadCount,
  messages: [],
  avatar: "💬",
  name: `채팅방 ${response.id}`,
  lastMessageTime: response.lastMessage?.createdAt || response.createdAt, // 마지막 메시지 시간
});

// 백엔드-> 프론트로 변환
export const transformMessage = (message: Message): UIMessage => ({
  id: message.id,
  content: message.content,
  senderUserId: message.senderId,
  timestamp: message.createdAt,
  isRead: message.isRead,
});

// 상대방 찾기 (공통 유틸 함수)
export const findOtherParticipant = (
  participants: string[],
  currentUserId?: string
): string | undefined => {
  return participants.find((id) => id !== currentUserId);
};

// 상대방 이름 생성 (공통 유틸 함수)
export const generateDisplayName = (
  otherUser?: { nickname?: string },
  otherParticipant?: string
): string => {
  return (
    otherUser?.nickname ||
    `사용자 ${otherParticipant?.slice(-4) || "알 수 없음"}`
  );
};
