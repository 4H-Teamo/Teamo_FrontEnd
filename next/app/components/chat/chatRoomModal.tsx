"use client";

import { useState, useEffect, useRef } from "react";
import { useCurrentUser, useUserProfile } from "@/app/hooks/useUserProfile";
import { useMessageHandler } from "@/app/socket/messageHandler";
import { useChatStore } from "@/app/store/chatStore";
import { initializeSocket } from "@/app/socket/socketManager";
import { UIMessage } from "@/app/types/chat";
import { useChatRooms } from "@/app/hooks/useChatRooms";
import { transformMessage } from "@/app/utils/formatChat";

interface ChatRoomModalProps {
  roomId: string;
  onClose: () => void;
}

const ChatRoomModal = ({ roomId, onClose }: ChatRoomModalProps) => {
  const { data: currentUser } = useCurrentUser();
  const { getMessages } = useChatRooms();
  const { sendMessage } = useMessageHandler();
  const { addMessage, chatRooms } = useChatStore();
  const [messages, setMessages] = useState<UIMessage[]>([]);
  const [newMessage, setNewMessage] = useState("");
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const chatStoreRoom = chatRooms.find((r) => r.roomId === roomId);

  // 디버깅을 위한 로그
  console.log("🔍 ChatRoomModal 디버깅:", {
    roomId,
    serverMessagesCount: messages.length,
    storeMessagesCount: chatStoreRoom?.messages.length || 0,
    hasServerMessages: messages.length > 0,
    hasStoreMessages: (chatStoreRoom?.messages.length || 0) > 0,
  });

  // 상대방 찾기
  const otherParticipant = chatStoreRoom?.participants.find(
    (id) => id !== currentUser?.userId
  );

  // 상대방 정보 가져오기
  const { data: otherUser } = useUserProfile(otherParticipant || "");

  // 상대방 이름 결정
  const displayName =
    otherUser?.nickname ||
    `사용자 ${otherParticipant?.slice(-4) || "알 수 없음"}`;

  // 메시지 목록 스크롤을 맨 아래로
  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  // 채팅 모달이 열릴 때 소켓 초기화
  useEffect(() => {
    console.log("🔌 채팅 모달 열림 - 소켓 초기화 시작");
    const socket = initializeSocket();
    if (socket) {
      console.log("✅ 소켓 초기화 완료");
    } else {
      console.log("❌ 소켓 초기화 실패 (SSR 환경)");
    }
  }, []);

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  // 채팅방 열 때 서버에서 메시지 로드 (우선순위)
  useEffect(() => {
    const loadMessages = async () => {
      try {
        console.log("📋 서버에서 메시지 로드 시작");
        const messages = await getMessages(roomId);
        const transformedMessages = messages.map(transformMessage);
        setMessages(transformedMessages);
        console.log("✅ 서버에서 메시지 로드 완료:", transformedMessages);
      } catch (error) {
        console.error("❌ 메시지 로드 실패:", error);
        setMessages([]);
      }
    };

    loadMessages();
  }, [roomId, getMessages]);

  // 실시간 메시지 수신 시에만 스토어 메시지 추가 (낙관적 업데이트용)
  useEffect(() => {
    if (chatStoreRoom?.messages && chatStoreRoom.messages.length > 0) {
      // 스토어에 있는 새 메시지만 추가 (낙관적 업데이트)
      const newMessages = chatStoreRoom.messages.filter(
        (storeMsg) =>
          !messages.some((serverMsg) => serverMsg.id === storeMsg.id)
      );

      if (newMessages.length > 0) {
        setMessages((prev) => [...prev, ...newMessages]);
        console.log("📋 새 메시지 추가:", newMessages);
      }
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

    // 채팅방 목록의 마지막 메시지는 실시간으로 업데이트됨

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

  // 시간 포맷팅
  const formatTime = (timestamp: string) => {
    return new Date(timestamp).toLocaleTimeString("ko-KR", {
      hour: "2-digit",
      minute: "2-digit",
    });
  };

  return (
    <>
      <div onClick={onClose} />

      {/* 채팅 모달 */}
      <div className="fixed bottom-20 left-8 w-80 h-96 bg-white rounded-lg shadow-xl border border-gray-200 z-50 flex flex-col">
        {/* 헤더 */}
        <div className="flex items-center justify-between p-4 border-b border-gray-200">
          <div>
            <h3 className="font-semibold text-gray-900">{displayName}</h3>
            <p className="text-xs text-gray-500">실시간 채팅</p>
          </div>
          <button
            onClick={onClose}
            className="text-gray-400 hover:text-gray-600 transition-colors"
          >
            ✕
          </button>
        </div>

        {/* 메시지 영역 */}
        <div className="flex-1 p-4 overflow-y-auto">
          <div className="space-y-3">
            {messages.map((message) => (
              <div
                key={message.id}
                className={`flex ${
                  message.senderUserId === currentUser?.userId
                    ? "justify-end"
                    : "justify-start"
                }`}
              >
                <div
                  className={`max-w-xs px-3 py-2 rounded-2xl text-sm ${
                    message.senderUserId === currentUser?.userId
                      ? "bg-blue-500 text-white rounded-br-md"
                      : "bg-gray-100 text-gray-800 rounded-bl-md"
                  }`}
                >
                  <p>{message.content}</p>
                  <p className="text-xs opacity-70 mt-1">
                    {formatTime(message.timestamp)}
                  </p>
                </div>
              </div>
            ))}
            <div ref={messagesEndRef} />
          </div>
        </div>

        {/* 입력 영역 */}
        <div className="p-4 border-t border-gray-100">
          <div className="flex gap-2">
            <input
              type="text"
              value={newMessage}
              onChange={(e) => setNewMessage(e.target.value)}
              onKeyPress={handleKeyPress}
              placeholder="메시지를 입력하세요..."
              className="flex-1 px-3 py-2 border border-gray-200 rounded-full focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent text-sm bg-gray-50"
            />
            <button
              onClick={handleSendMessage}
              disabled={!newMessage.trim()}
              className="px-4 py-2 bg-blue-500 text-white rounded-full hover:bg-blue-600 transition-colors text-sm disabled:opacity-50 disabled:cursor-not-allowed"
            >
              전송
            </button>
          </div>
        </div>
      </div>
    </>
  );
};

export default ChatRoomModal;
