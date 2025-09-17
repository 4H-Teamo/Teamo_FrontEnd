import { create } from "zustand";
export interface Message {
  id: string;
  content: string;
  senderUserId: string;
  timestamp: string;
}

export interface ChatRoom {
  roomId: string;
  participants: string[];
  messages: Message[];
  unreadCount: number;
}
export interface ChatStore {
  chatRooms: ChatRoom[];
  currentRoomId: string | null;
  setChatRooms: (chatRooms: ChatRoom[]) => void;
  addMessage: (roomId: string, message: Message, isActive: boolean) => void;
  addRoom: (room: ChatRoom) => void;
  setCurrentRoom: (roomId: string) => void;
  resetUnread: (roomId: string) => void;
}
export interface ChatStore {
  chatRooms: ChatRoom[];
  setChatRooms: (chatRooms: ChatRoom[]) => void;
}

export const useChatStore = create<ChatStore>((set) => ({
  chatRooms: [],
  currentRoomId: null,

  setChatRooms: (chatRooms) => set({ chatRooms }),

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
