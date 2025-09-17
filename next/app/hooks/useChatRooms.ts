"use client";

import { useState, useCallback } from "react";
import { useChatStore } from "@/app/store/chatStore";

interface ChatRoom {
  id: string;
  name: string;
  avatar: string;
  lastMessage: string;
  lastMessageTime: string;
  unreadCount: number;
  recentMessages?: string[];
}

// 채팅방 목록 조회 API (프록시 사용)
export const getChatRooms = async (): Promise<ChatRoom[]> => {
  console.log("📋 채팅방 목록 조회 API 호출");

  const res = await fetch("/api/proxy/chat-rooms", {
    cache: "no-store",
    credentials: "include",
  });

  console.log("📋 채팅방 목록 조회 API 응답:", {
    status: res.status,
    ok: res.ok,
  });

  if (!res.ok) {
    const errorText = await res.text();
    console.error("❌ 채팅방 목록 조회 실패:", errorText);
    throw new Error("❌채팅방 목록 조회 실패");
  }

  const data = await res.json();
  console.log("✅ 채팅방 목록 조회 성공:", data);
  return data;
};

// 메시지 목록 조회 API (프록시 사용)
export const getMessages = async (chatRoomId: string) => {
  console.log("📨 메시지 목록 조회 API 호출:", chatRoomId);

  const res = await fetch(`/api/proxy/chat-messages/${chatRoomId}`, {
    cache: "no-store",
    credentials: "include",
  });

  console.log("📨 메시지 목록 조회 API 응답:", {
    status: res.status,
    ok: res.ok,
  });

  if (!res.ok) {
    const errorText = await res.text();
    console.error("❌ 메시지 목록 조회 실패:", errorText);
    throw new Error("❌메시지 목록 조회 실패");
  }

  const data = await res.json();
  console.log("✅ 메시지 목록 조회 성공:", data);
  return data;
};

// useChatRooms 훅
export const useChatRooms = () => {
  const { chatRooms, setChatRooms } = useChatStore();
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [hasFetched, setHasFetched] = useState(false);

  // 채팅방 목록 조회 (useCallback으로 메모이제이션)
  const fetchChatRooms = useCallback(async () => {
    // 이미 로딩 중이거나 이미 조회한 경우 중복 호출 방지
    if (isLoading || hasFetched) {
      console.log("📋 채팅방 목록 조회 건너뜀 (이미 로딩 중이거나 조회 완료)");
      return;
    }

    setIsLoading(true);
    setError(null);

    try {
      const rooms = await getChatRooms();

      // 서버 데이터를 클라이언트 형식으로 변환
      const formattedRooms = rooms.map((room: any) => ({
        roomId: room.id,
        participants: room.participants || [],
        messages: room.messages || [],
        unreadCount: room.unreadCount || 0,
      }));

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

  // 컴포넌트에서 사용할 형식으로 변환
  const rooms = chatRooms.map((room) => ({
    id: room.roomId,
    name: `채팅방 ${room.roomId}`,
    avatar: "💬",
    lastMessage:
      room.messages[room.messages.length - 1]?.content || "메시지가 없습니다",
    lastMessageTime:
      room.messages[room.messages.length - 1]?.timestamp ||
      new Date().toISOString(),
    unreadCount: room.unreadCount,
    recentMessages: room.messages,
  }));

  return {
    rooms,
    isLoading,
    error,
    fetchChatRooms,
    updateRoomMessage: () => {}, // TODO: 구현 필요
    clearUnreadCount: (roomId: string) => {
      // 채팅 스토어에서 unread count 리셋
      const { resetUnread } = useChatStore.getState();
      resetUnread(roomId);
      console.log("✅ 읽음 처리 완료:", roomId);
    },
  };
};
