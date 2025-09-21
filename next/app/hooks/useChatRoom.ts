"use client";

import { useState, useEffect, useRef } from "react";
import { useCurrentUser, useUserProfile } from "@/app/hooks/useUserProfile";
import { useChatStore } from "@/app/store/chatStore";
import { initializeSocket, getSocket } from "@/app/socket/socketManager";
import { UIMessage } from "@/app/types/chat";
import { useChat } from "@/app/hooks/useChat";
import {
  transformMessage,
  findOtherParticipant,
  generateDisplayName,
} from "@/app/utils/formatChat";

export const useChatRoom = (roomId: string) => {
  const { data: currentUser } = useCurrentUser();
  const { getMessages } = useChat();
  const { chatRooms } = useChatStore();
  const [messages, setMessages] = useState<UIMessage[]>([]);
  const [newMessage, setNewMessage] = useState("");
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const chatStoreRoom = chatRooms.find((r) => r.roomId === roomId);

  // 상대방 찾기
  const otherParticipant = findOtherParticipant(
    chatStoreRoom?.participants || [],
    currentUser?.userId
  );

  // 상대방 정보 가져오기
  const { data: otherUser } = useUserProfile(otherParticipant || "");

  // 상대방 이름 결정
  const displayName = generateDisplayName(otherUser, otherParticipant);

  // 메시지 목록 스크롤을 맨 아래로
  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  // 채팅방 초기화 (소켓 + 메시지 로드)
  useEffect(() => {
    const initializeChatRoom = async () => {
      console.log("🔌 채팅 모달 열림 - 소켓 초기화 시작");
      const socket = initializeSocket();
      if (socket) {
        console.log("🏠 채팅방 참여:", roomId);
        socket.emit("joinRoom", { roomId });
      } else {
        console.log("❌ 소켓 초기화 실패 (SSR 환경)");
      }

      // 2. 서버에서 메시지 로드
      try {
        console.log("📋 서버에서 메시지 로드 시작");
        const messages = await getMessages(roomId);
        const transformedMessages = messages.map(transformMessage);
        setMessages(transformedMessages);

        console.log("✅ 서버에서 메시지 로드 완료:", transformedMessages);
        scrollToBottom();
      } catch (error) {
        console.error("❌ 메시지 로드 실패:", error);
        setMessages([]);
      }
    };

    initializeChatRoom();
  }, [roomId, getMessages]);

  // 실시간 메시지 수신 시 스토어 메시지 추가
  useEffect(() => {
    if (!chatStoreRoom?.messages?.length) return;

    // 스토어의 새 메시지만 필터링하여 추가
    const newMessages = chatStoreRoom.messages.filter(
      (storeMsg) => !messages.some((localMsg) => localMsg.id === storeMsg.id)
    );

    if (newMessages.length > 0) {
      setMessages((prev) => {
        // 추가 중복 체크
        const uniqueNewMessages = newMessages.filter(
          (newMsg) => !prev.some((existingMsg) => existingMsg.id === newMsg.id)
        );

        if (uniqueNewMessages.length > 0) {
          console.log("📋 새 메시지 추가:", uniqueNewMessages);
          return [...prev, ...uniqueNewMessages];
        }

        return prev;
      });

      // 새 메시지 추가 후 스크롤을 맨 아래로
      setTimeout(() => scrollToBottom(), 100);
    }
  }, [chatStoreRoom?.messages]); // messages 의존성 제거하여 무한 루프 방지

  // 메시지 전송
  const handleSendMessage = () => {
    if (!newMessage.trim() || !currentUser?.userId) return;

    const socket = getSocket();
    if (!socket) {
      console.error("❌ 소켓이 없습니다");
      return;
    }

    if (!socket.connected) {
      console.error("❌ 소켓이 연결되지 않았습니다");
      return;
    }

    console.log("📤 소켓으로 메시지 전송:", {
      roomId,
      content: newMessage,
      senderId: currentUser.userId,
    });

    const payload = {
      roomId,
      content: newMessage,
      senderId: currentUser.userId,
    };

    socket.emit("sendMessage", payload);
    setNewMessage("");
  };

  // Enter 키로 메시지 전송
  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      handleSendMessage();
    }
  };

  return {
    messages,
    newMessage,
    setNewMessage,
    messagesEndRef,
    displayName,
    currentUser,
    handleSendMessage,
    handleKeyPress,
  };
};
