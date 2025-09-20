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
