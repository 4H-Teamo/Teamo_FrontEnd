import { create } from "zustand";
import { UIMessage } from "@/app/types/chat";

// UI에서 사용하는 채팅방 타입 (스토어용)
export interface StoreChatRoom {
  roomId: string;
  participants: string[];
  messages: UIMessage[];
  unreadCount: number;
  lastMessage?: {
    content: string;
    senderId: string;
    createdAt: string;
  };
}
export interface ChatStore {
  chatRooms: StoreChatRoom[];
  currentRoomId: string | null;
  activeRoomId: string | null;
  setChatRooms: (chatRooms: StoreChatRoom[]) => void;
  addMessage: (roomId: string, message: UIMessage, isActive: boolean) => void;
  addRoom: (room: StoreChatRoom) => void;
  setCurrentRoom: (roomId: string) => void;
  setActiveRoomId: (roomId: string | null) => void;
  resetUnread: (roomId: string) => void;
}

export const useChatStore = create<ChatStore>((set) => ({
  chatRooms: [],
  currentRoomId: null,
  activeRoomId: null,

  setChatRooms: (chatRooms) => set({ chatRooms }),

  setActiveRoomId: (roomId) => set({ activeRoomId: roomId }),

  setCurrentRoom: (roomId) =>
    set((state) => ({
      currentRoomId: roomId,
      chatRooms: state.chatRooms.map((room) =>
        room.roomId === roomId ? { ...room, unreadCount: 0 } : room
      ),
    })),

  addMessage: (roomId, message, isActive) =>
    set((state) => {
      console.log("💾 채팅 스토어에 메시지 추가:", {
        roomId,
        message,
        isActive,
      });

      const updatedRooms = state.chatRooms.map((room) =>
        room.roomId === roomId
          ? {
              ...room,
              messages: [...room.messages, message],
              unreadCount: isActive ? 0 : room.unreadCount + 1,
            }
          : room
      );

      console.log("✅ 채팅 스토어 업데이트 완료:", updatedRooms);
      return { chatRooms: updatedRooms };
    }),

  addRoom: (room) =>
    set((state) => {
      // 이미 존재하는 채팅방인지 확인
      const exists = state.chatRooms.some(
        (existingRoom) => existingRoom.roomId === room.roomId
      );
      if (!exists) {
        return { chatRooms: [...state.chatRooms, room] };
      }
      return state;
    }),

  resetUnread: (roomId) =>
    set((state) => ({
      chatRooms: state.chatRooms.map((room) =>
        room.roomId === roomId ? { ...room, unreadCount: 0 } : room
      ),
    })),
}));
