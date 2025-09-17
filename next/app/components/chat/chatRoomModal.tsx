"use client";

import { useState, useEffect, useRef } from "react";
import { useCurrentUser } from "@/app/hooks/useUserProfile";
// import { useChatRooms } from "@/app/hooks/useChatRooms";
import { useMessageHandler } from "@/app/socket/messageHandler";
import { useChatStore } from "@/app/store/chatStore";
import { initializeSocket } from "@/app/socket/socketManager";

interface Message {
  id: string;
  content: string;
  senderId: string;
  timestamp: string;
}

interface ChatRoomModalProps {
  roomId: string;
  onClose: () => void;
  updateRoomMessage?: (roomId: string, message: Message) => void;
}

const ChatRoomModal = ({
  roomId,
  onClose,
  updateRoomMessage,
}: ChatRoomModalProps) => {
  const { data: currentUser } = useCurrentUser();
  // const { rooms } = useChatRooms();
  const { sendMessage } = useMessageHandler();
  const { addMessage, chatRooms } = useChatStore();
  const [messages, setMessages] = useState<Message[]>([]);
  const [newMessage, setNewMessage] = useState("");
  const messagesEndRef = useRef<HTMLDivElement>(null);

  // const room = rooms.find((r: any) => r.id === roomId);
  const chatStoreRoom = chatRooms.find((r) => r.roomId === roomId);

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

  // 초기 메시지 로드 및 실시간 메시지 동기화
  useEffect(() => {
    if (chatStoreRoom?.messages && chatStoreRoom.messages.length > 0) {
      console.log("📨 채팅 스토어에서 메시지 로드:", chatStoreRoom.messages);
      setMessages(
        chatStoreRoom.messages.map((msg) => ({
          id: msg.id,
          content: msg.content,
          senderId: msg.senderUserId,
          timestamp: msg.timestamp,
        }))
      );
    } else {
      console.log("📨 채팅방에 메시지가 없습니다");
      setMessages([]);
    }
  }, [chatStoreRoom]);

  // 채팅 스토어의 메시지 변경 감지
  useEffect(() => {
    if (chatStoreRoom?.messages) {
      setMessages(
        chatStoreRoom.messages.map((msg) => ({
          id: msg.id,
          content: msg.content,
          senderId: msg.senderUserId,
          timestamp: msg.timestamp,
        }))
      );
    }
  }, [chatStoreRoom?.messages]);

  // 메시지 전송
  const handleSendMessage = () => {
    if (!newMessage.trim() || !currentUser?.userId) return;

    const message: Message = {
      id: Date.now().toString(),
      content: newMessage,
      senderId: currentUser.userId,
      timestamp: new Date().toISOString(),
    };

    console.log("📤 소켓으로 메시지 전송:", message);

    // 소켓으로 메시지 전송
    sendMessage(newMessage, roomId);

    // 로컬 상태에 즉시 추가 (낙관적 업데이트)
    setMessages((prev) => [...prev, message]);
    setNewMessage("");

    // 채팅 스토어에 메시지 추가
    addMessage(
      roomId,
      {
        id: message.id,
        content: message.content,
        senderUserId: message.senderId,
        timestamp: message.timestamp,
      },
      true
    );

    // 채팅방 목록 업데이트
    if (updateRoomMessage) {
      updateRoomMessage(roomId, message);
    }
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
      {/* 배경 오버레이 */}
      <div onClick={onClose} />

      {/* 채팅 모달 */}
      <div className="fixed bottom-20 left-8 w-80 h-96 bg-white rounded-lg shadow-xl border border-gray-200 z-50 flex flex-col">
        {/* 헤더 */}
        <div className="flex items-center justify-between p-4 border-b border-gray-200">
          <div>
            <h3 className="font-semibold text-gray-900">
              {chatStoreRoom?.roomId || `채팅방 ${roomId}`}
            </h3>
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
                  message.senderId === currentUser?.userId
                    ? "justify-end"
                    : "justify-start"
                }`}
              >
                <div
                  className={`max-w-xs px-3 py-2 rounded-2xl text-sm ${
                    message.senderId === currentUser?.userId
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
