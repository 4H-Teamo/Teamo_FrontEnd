"use client";

import { useState, useEffect, useRef } from "react";
import { useCurrentUser, useUserProfile } from "@/app/hooks/useUserProfile";
import { useMessageHandler } from "@/app/socket/messageHandler";
import { useChatStore } from "@/app/store/chatStore";
import { initializeSocket } from "@/app/socket/socketManager";
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
  const { sendMessage } = useMessageHandler();
  const { addMessage, chatRooms } = useChatStore();
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
        console.log("✅ 소켓 초기화 완료");
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

    const newMessages = chatStoreRoom.messages.filter(
      (storeMsg) => !messages.some((serverMsg) => serverMsg.id === storeMsg.id)
    );

    if (newMessages.length > 0) {
      setMessages((prev) => [...prev, ...newMessages]);
      console.log("📋 새 메시지 추가:", newMessages);
    }
  }, [chatStoreRoom?.messages, messages]);

  // 메시지 전송
  const handleSendMessage = () => {
    if (!newMessage.trim() || !currentUser?.userId) return;

    console.log("📤 소켓으로 메시지 전송:", {
      roomId,
      content: newMessage,
      senderId: currentUser.userId,
    });

    // 소켓으로 메시지 전송 (백엔드 형태에 맞춰)
    sendMessage(roomId, newMessage, currentUser.userId);

    // 임시 메시지를 스토어에 추가 (낙관적 업데이트)
    const tempMessage: UIMessage = {
      id: Date.now().toString(),
      content: newMessage,
      senderUserId: currentUser.userId,
      timestamp: new Date().toISOString(),
      isRead: false,
    };
    addMessage(roomId, tempMessage, true);

    // 입력 필드만 초기화 (메시지는 백엔드에서 받을 때 추가)
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
