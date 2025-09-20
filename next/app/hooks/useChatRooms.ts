"use client";

import { useState, useCallback } from "react";
import { useChatStore, StoreChatRoom } from "@/app/store/chatStore";
import { ChatRoom, ChatRoomResponse, Message } from "@/app/types/chat";
import { transformChatRoom } from "@/app/utils/formatChat";

export const useChatRooms = () => {
  const { chatRooms, setChatRooms } = useChatStore();
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [hasFetched, setHasFetched] = useState(false);

  const getChatRooms = async (): Promise<ChatRoomResponse[]> => {
    const response = await fetch("/api/proxy/chat-rooms", {
      cache: "no-store",
      credentials: "include",
    });

    if (!response.ok) {
      throw new Error("채팅방 목록 조회 실패");
    }

    return response.json();
  };

  const getMessages = async (roomId: string): Promise<Message[]> => {
    const response = await fetch(`/api/proxy/chat-messages/${roomId}`, {
      cache: "no-store",
      credentials: "include",
    });

    if (!response.ok) {
      throw new Error("메시지 목록 조회 실패");
    }

    return response.json();
  };

  const createChatRoom = async (
    participants: string[]
  ): Promise<ChatRoomResponse> => {
    const response = await fetch("/api/proxy/chat-rooms", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      credentials: "include",
      body: JSON.stringify({ participants }),
    });

    if (!response.ok) {
      throw new Error("채팅방 생성 실패");
    }

    return response.json();
  };

  // 채팅방 목록 조회
  const fetchChatRooms = useCallback(async () => {
    if (isLoading || hasFetched) return;

    setIsLoading(true);
    setError(null);

    try {
      const rooms = await getChatRooms();

      const formattedRooms: StoreChatRoom[] = rooms.map((room) => {
        const transformedRoom = transformChatRoom(room);

        return {
          roomId: transformedRoom.id,
          participants: transformedRoom.participants,
          messages: [], // 초기에는 빈 배열
          unreadCount: transformedRoom.unreadCount,
        };
      });

      setChatRooms(formattedRooms);
      setHasFetched(true);
    } catch (err) {
      console.error("채팅방 목록 조회 실패:", err);
      setError(
        err instanceof Error ? err.message : "알 수 없는 오류가 발생했습니다."
      );
    } finally {
      setIsLoading(false);
    }
  }, [setChatRooms, isLoading, hasFetched]);

  // transformChatRoom 재사용해서 rooms 생성
  const rooms: ChatRoom[] = chatRooms.map((room) => {
    const lastMessage = room.messages.at(-1);

    return transformChatRoom({
      id: room.roomId,
      participants: room.participants,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
      lastMessage: lastMessage
        ? {
            content: lastMessage.content,
            senderId: lastMessage.senderUserId,
            createdAt: lastMessage.timestamp,
          }
        : undefined,
      unreadCount: room.unreadCount,
    });
  });

  return {
    rooms,
    isLoading,
    error,
    fetchChatRooms,
    getMessages,
    createChatRoom,
    updateRoomMessage: () => {}, // TODO: 구현 필요
    clearUnreadCount: (roomId: string) => {
      const { resetUnread } = useChatStore.getState();
      resetUnread(roomId);
      console.log("✅ 읽음 처리 완료:", roomId);
    },
  };
};
