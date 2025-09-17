"use client";

import { useEffect } from "react";
import { getSocket } from "./socketManager";
import { useAuthStore } from "@/app/store/authStore";
import { useChatStore } from "@/app/store/chatStore";

export const useMessageHandler = () => {
  const { user } = useAuthStore();
  const { addMessage, addRoom } = useChatStore();

  // 소켓 이벤트 리스너 설정 (소켓이 연결된 후에만)
  useEffect(() => {
    const socket = getSocket();
    if (!socket) return;

    const handleReceiveMessage = (data: {
      message: {
        id: string;
        content: string;
        senderId: string;
        roomId: string;
        timestamp: string;
      };
    }) => {
      console.log("📨 소켓으로 메시지 수신:", data);
      console.log("📨 메시지 상세:", {
        id: data.message.id,
        content: data.message.content,
        senderId: data.message.senderId,
        roomId: data.message.roomId,
        timestamp: data.message.timestamp,
        isMyMessage: data.message.senderId === user?.userId,
      });

      // 현재 사용자가 보낸 메시지가 아닌 경우에만 처리
      if (data.message.senderId !== user?.userId) {
        const message = {
          id: data.message.id,
          content: data.message.content,
          senderUserId: data.message.senderId,
          timestamp: data.message.timestamp,
        };

        console.log("✅ 다른 사용자 메시지 처리:", message);
        addMessage(data.message.roomId, message, false);
      } else {
        console.log("ℹ️ 내가 보낸 메시지 (무시)");
      }
    };

    const handleRoomCreated = (data: {
      roomId: string;
      participants: string[];
      createdBy: string;
    }) => {
      console.log("🏠 채팅방 생성됨:", data);

      // 새 채팅방을 채팅 스토어에 추가
      const newRoom = {
        roomId: data.roomId,
        participants: data.participants,
        messages: [],
        unreadCount: 0,
      };

      addRoom(newRoom);
    };

    socket.on("receiveMessage", handleReceiveMessage);
    socket.on("roomCreated", handleRoomCreated);

    return () => {
      socket.off("receiveMessage", handleReceiveMessage);
      socket.off("roomCreated", handleRoomCreated);
    };
  }, [user, addMessage, addRoom]);

  const sendMessage = (msg: string, roomId?: string) => {
    const socket = getSocket();
    if (socket && msg.trim() !== "") {
      console.log("🔌 소켓 연결 상태:", {
        connected: socket.connected,
        id: socket.id,
      });

      // 먼저 채팅방에 참여
      console.log("🚪 채팅방 참여 시도:", roomId || "default");
      socket.emit("joinRoom", { roomId: roomId || "default" });

      // 서버 DTO에 맞는 형식으로 메시지 전송
      const payload = {
        content: msg,
        roomId: roomId || "default",
        senderId: user?.userId || "unknown",
        timestamp: new Date().toISOString(),
      };

      console.log("📤 소켓으로 메시지 전송:", payload);
      socket.emit("sendMessage", payload);
      console.log("✅ 메시지 전송 완료 (소켓)");
    } else {
      console.error("❌ 소켓 연결 없음 또는 빈 메시지");
    }
  };

  const joinRoom = (roomId: string) => {
    const socket = getSocket();
    if (socket) {
      console.log("🏠 채팅방 참여:", roomId);
      socket.emit("joinRoom", { roomId });
    }
  };

  const createRoom = (targetUserId: string) => {
    const socket = getSocket();
    if (socket && user?.userId) {
      const roomId = `room_${user.userId}_${targetUserId}_${Date.now()}`;

      // 채팅방 참여
      joinRoom(roomId);

      // 새 채팅방을 스토어에 추가
      const newRoom = {
        roomId,
        participants: [user.userId, targetUserId],
        messages: [],
        unreadCount: 0,
      };
      addRoom(newRoom);

      console.log("🏠 새 채팅방 생성:", roomId);
    }
  };

  return { sendMessage, createRoom, joinRoom };
};
