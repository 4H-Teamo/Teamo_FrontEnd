"use client";

import { useState, useEffect } from "react";
import { useAccessToken } from "../../hooks/useUser";
import { useCurrentUser } from "../../hooks/useUserProfile";

interface ChatMessage {
  id: string;
  content: string;
  senderId: string;
  timestamp: string;
}

interface ChatRoomProps {
  roomId: string;
}

export default function ChatRoom({ roomId }: ChatRoomProps) {
  const { accessToken } = useAccessToken();
  const { data: currentUser } = useCurrentUser();
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [newMessage, setNewMessage] = useState("");
  const [isLoading, setIsLoading] = useState(true);

  // 채팅방 메시지 로드
  useEffect(() => {
    const loadMessages = async () => {
      if (!accessToken || !roomId) return;

      try {
        // 실제로는 API에서 메시지를 가져와야 함
        // const response = await fetch(`/api/chat-rooms/${roomId}/messages`, {
        //   headers: { Authorization: `Bearer ${accessToken}` }
        // });
        // const messageData = await response.json();

        // 임시 데이터
        setMessages([
          {
            id: "1",
            content: "안녕하세요!",
            senderId: "user1",
            timestamp: new Date().toISOString(),
          },
          {
            id: "2",
            content: "프로젝트 팀원을 찾고 있어요",
            senderId: currentUser?.userId || "currentUser",
            timestamp: new Date().toISOString(),
          },
        ]);
      } catch (error) {
        console.error("메시지 로드 실패:", error);
      } finally {
        setIsLoading(false);
      }
    };

    loadMessages();
  }, [accessToken, roomId, currentUser?.userId]);

  const handleSendMessage = async () => {
    if (!newMessage.trim() || !currentUser?.userId) return;

    const message: ChatMessage = {
      id: Date.now().toString(),
      content: newMessage,
      senderId: currentUser.userId,
      timestamp: new Date().toISOString(),
    };

    // 실제로는 API로 메시지 전송
    console.log("메시지 전송:", newMessage);
    setMessages((prev) => [...prev, message]);
    setNewMessage("");
  };

  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-full">
        <div className="text-gray-500">메시지를 불러오는 중...</div>
      </div>
    );
  }

  return (
    <div className="flex flex-col h-full bg-white rounded-lg shadow-sm">
      {/* 채팅 메시지 영역 */}
      <div className="flex-1 p-4 overflow-y-auto">
        <div className="space-y-4">
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
                className={`max-w-xs px-4 py-3 rounded-2xl ${
                  message.senderId === currentUser?.userId
                    ? "bg-blue-500 text-white rounded-br-md"
                    : "bg-gray-100 text-gray-800 rounded-bl-md"
                }`}
              >
                <p className="text-sm">{message.content}</p>
                <p className="text-xs opacity-70 mt-1">
                  {new Date(message.timestamp).toLocaleTimeString()}
                </p>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* 입력 영역 */}
      <div className="p-4 border-t border-gray-100">
        <div className="flex gap-3">
          <input
            type="text"
            value={newMessage}
            onChange={(e) => setNewMessage(e.target.value)}
            placeholder="메시지를 입력하세요..."
            className="flex-1 px-4 py-3 border border-gray-200 rounded-full focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent text-sm bg-gray-50"
            onKeyPress={(e) => e.key === "Enter" && handleSendMessage()}
          />
          <button
            onClick={handleSendMessage}
            className="px-6 py-3 bg-blue-500 text-white rounded-full hover:bg-blue-600 transition-colors text-sm font-medium shadow-sm"
          >
            전송
          </button>
        </div>
      </div>
    </div>
  );
}
