"use client";

import { useState, useCallback } from "react";
import { useChatStore, StoreChatRoom } from "@/app/store/chatStore";
import { ChatRoom, ChatRoomResponse, Message } from "@/app/types/chat";
import { transformChatRoom } from "@/app/utils/formatChat";
import { useMessageHandler } from "@/app/socket/messageHandler";

export const useChat = () => {
  const { chatRooms, setChatRooms, addRoom } = useChatStore();
  const { createRoom } = useMessageHandler();
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

  const getMessages = useCallback(
    async (roomId: string): Promise<Message[]> => {
      const response = await fetch(`/api/proxy/chat-messages/${roomId}`, {
        cache: "no-store",
        credentials: "include",
      });

      if (!response.ok) {
        throw new Error("메시지 목록 조회 실패");
      }

      return response.json();
    },
    []
  );

  const createChatRoom = async (
    participants: string[]
  ): Promise<ChatRoomResponse> => {
    console.log("🏠 채팅방 생성 API 호출:", { participants });

    const response = await fetch("/api/proxy/chat-rooms", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      credentials: "include",
      body: JSON.stringify({ participants }),
    });

    console.log("🏠 채팅방 생성 API 응답:", {
      status: response.status,
      ok: response.ok,
      url: response.url,
    });

    if (!response.ok) {
      const errorText = await response.text();
      console.error("❌ 채팅방 생성 API 실패:", errorText);
      throw new Error("❌채팅방 생성 실패");
    }

    const data = await response.json();
    console.log("✅ 채팅방 생성 성공 (DB 저장됨):", data);
    return data;
  };

  const startChat = async (
    targetUserId: string,
    currentUserId: string
  ): Promise<{
    id: string;
    participants: string[];
    createdAt: string;
  } | null> => {
    try {
      const roomData = await createChatRoom([currentUserId, targetUserId]);
      const newRoom = {
        roomId: roomData.id,
        participants: roomData.participants,
        messages: [],
        unreadCount: 0,
      };
      addRoom(newRoom);
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
          lastMessage: transformedRoom.lastMessage, // 백엔드 응답의 lastMessage 저장
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

  const rooms: ChatRoom[] = chatRooms.map((room) => {
    return transformChatRoom({
      id: room.roomId,
      participants: room.participants,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
      lastMessage: room.lastMessage, // 스토어에 저장된 lastMessage 직접 사용
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
    startChat,
    clearUnreadCount: (roomId: string) => {
      const { resetUnread } = useChatStore.getState();
      resetUnread(roomId);
      console.log("✅ 읽음 처리 완료:", roomId);
    },
  };
};
