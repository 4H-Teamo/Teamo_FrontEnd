"use client";

import { useEffect, useRef } from "react";
import { getSocket } from "./socketManager";
import { useAuthStore } from "@/app/store/authStore";
import { useChatStore } from "@/app/store/chatStore";
import { Message, UIMessage } from "@/app/types/chat";

// 백엔드에서 받는 메시지 타입 정의
interface ReceiveMessageData {
  message: Message;
}

export const useMessageHandler = () => {
  const { user } = useAuthStore();
  const { addMessage, addRoom, activeRoomId } = useChatStore();

  // 소켓 이벤트 리스너 설정
  useEffect(() => {
    const socket = getSocket();
    if (!socket) return;

    const handleReceiveMessage = (data: ReceiveMessageData) => {
      console.log("📨 소켓으로 메시지 수신:", data);

      const { message } = data;
      console.log("�� 메시지 상세:", {
        id: message.id,
        roomId: message.roomId,
        content: message.content,
        senderId: message.senderId,
        createdAt: message.createdAt,
        isMyMessage: message.senderId === useAuthStore.getState().user?.userId,
      });
      const isInActiveRoom =
        useChatStore.getState().activeRoomId === message.roomId;

      console.log("🏠 현재 활성 채팅방:", useChatStore.getState().activeRoomId);
      console.log("📱 메시지가 온 채팅방:", message.roomId);
      console.log("✅ 활성 채팅방에 있음:", isInActiveRoom);

      // 메시지를 스토어에 추가
      const uiMessage: UIMessage = {
        id: message.id,
        content: message.content,
        senderUserId: message.senderId,
        timestamp: message.createdAt,
        isRead: message.isRead,
      };

      // 활성 채팅방에 있으면 읽음 처리, 아니면 안읽음 처리
      addMessage(message.roomId, uiMessage, isInActiveRoom);

      console.log("✅ 메시지 처리 완료:", {
        roomId: message.roomId,
        isActiveRoom: isInActiveRoom,
        message: uiMessage,
      });
    };

    socket.on("receiveMessage", handleReceiveMessage);

    return () => {
      socket.off("receiveMessage", handleReceiveMessage);
    };
  }, []); // 의존성 배열을 비워서 한 번만 등록

  const sendMessage = (roomId: string, content: string, senderId: string) => {
    const socket = getSocket();
    if (socket && content.trim() !== "") {
      console.log("🔌 소켓 연결 상태:", {
        connected: socket.connected,
        id: socket.id,
      });

      const payload = {
        roomId,
        content,
        senderId,
      };

      console.log("📤 소켓으로 메시지 전송:", payload);
      socket.emit("sendMessage", payload);
      console.log("✅ 메시지 전송 완료 (소켓)");
    }
  };
  const joinRoom = (roomId: string) => {
    const socket = getSocket();
    if (!socket) {
      console.error("❌ 소켓이 없어서 채팅방 참여 실패");
      return;
    }

    if (!socket.connected) {
      console.error("❌ 소켓이 연결되지 않아서 채팅방 참여 실패");
      return;
    }

    console.log("🏠 채팅방 참여:", roomId);
    socket.emit("joinRoom", { roomId });
  };

  // REST API로 채팅방 생성
  const createRoom = async (targetUserId: string) => {
    try {
      const token = localStorage.getItem("accessToken");
      const response = await fetch("http://211.230.62.32:81/api/chat-rooms", {
        method: "POST",
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          participants: [user?.userId, targetUserId],
        }),
      });

      if (response.ok) {
        const newRoom = await response.json();
        console.log("🏠 새 채팅방 생성됨:", newRoom);

        // 새 채팅방을 스토어에 추가
        addRoom({
          roomId: newRoom.id,
          participants: newRoom.participants,
          messages: [],
          unreadCount: 0,
        });

        // 채팅방 참여
        joinRoom(newRoom.id);

        return newRoom;
      } else {
        console.error("❌ 채팅방 생성 실패:", response.status);
      }
    } catch (error) {
      console.error("❌ 채팅방 생성 에러:", error);
    }
  };

  return { sendMessage, createRoom, joinRoom };
};
