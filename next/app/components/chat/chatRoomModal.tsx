"use client";

import { useChatRoom } from "@/app/hooks/useChatRoom";
import { formatTime } from "@/app/utils/formatTime";
interface ChatRoomModalProps {
  roomId: string;
  onClose: () => void;
}

const ChatRoomModal = ({ roomId, onClose }: ChatRoomModalProps) => {
  const {
    messages,
    newMessage,
    setNewMessage,
    messagesEndRef,
    displayName,
    currentUser,
    handleSendMessage,
    handleKeyPress,
  } = useChatRoom(roomId);

  return (
    <>
      <div onClick={onClose} />
      <div className="fixed bottom-20 left-8  w-80 h-[30rem] bg-white rounded-lg shadow-xl border border-gray-200 z-50 flex flex-col">
        <div className="flex items-center justify-between p-4 border-b border-gray-200">
          <div>
            <h3 className="font-semibold text-gray-900">{displayName}</h3>
          </div>
          <button
            onClick={onClose}
            className="text-gray-400 hover:text-gray-600 transition-colors"
          >
            ✕
          </button>
        </div>

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
                  className={`max-w-xs px-3 py-2 rounded-2xl text-xs ${
                    message.senderUserId === currentUser?.userId
                      ? "bg-main text-white rounded-br-md"
                      : "bg-gray-100 text-black rounded-bl-md"
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
