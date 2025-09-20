// 백엔드에서 받는 채팅방 데이터 타입
export interface ChatRoomResponse {
  id: string; // MongoDB ObjectId
  participants: string[]; // 참여자 UUID 배열
  createdAt: string; // 생성일시 (ISO string)
  updatedAt: string; // 수정일시 (ISO string)
  lastMessage?: {
    // 마지막 메시지 (선택적)
    content: string;
    createdAt: string;
    senderId: string;
  };
  unreadCount: number; // 읽지 않은 메시지 수
}

// 프론트엔드에서 사용하는 채팅방 타입
export interface ChatRoom {
  id: string; // 채팅방 ID
  participants: string[]; // 참여자 UUID 배열
  createdAt: string; // 생성일시
  updatedAt: string; // 수정일시
  lastMessage?: LastMessage; // 마지막 메시지
  unreadCount: number; // 읽지 않은 메시지 수
  messages: UIMessage[]; // 메시지 목록 (프론트엔드에서 관리)
  avatar: string; // 채팅방 아바타
  name: string; // 채팅방 이름
  lastMessageTime: string; // 마지막 메시지 시간
}

// 마지막 메시지 타입
export interface LastMessage {
  content: string;
  createdAt: string;
  senderId: string;
}

// 메시지 타입
export interface Message {
  id: string; // 메시지 ID
  roomId: string; // 채팅방 ID
  senderId: string; // 발신자 UUID
  content: string; // 메시지 내용
  isRead: boolean; // 읽음 여부
  createdAt: string; // 생성일시
}

// 프론트엔드에서 사용하는 메시지 타입 (UI용)
export interface UIMessage {
  id: string;
  content: string;
  senderUserId: string; // senderId와 동일하지만 UI에서 사용하는 이름
  timestamp: string; // createdAt과 동일하지만 UI에서 사용하는 이름
  isRead: boolean;
}
