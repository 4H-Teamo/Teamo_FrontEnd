"use client";

import { useState } from "react";
import Image from "next/image";
import ChatAvatar from "@/app/assets/chatAvatar.svg";
import { useChatRooms } from "@/app/hooks/useChatRooms";
import ChatRoomModal from "./chatRoomModal";

const ChatWidget = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [selectedRoomId, setSelectedRoomId] = useState<string | null>(null);
  const {
    rooms,
    isLoading,
    error,
    fetchChatRooms,
    updateRoomMessage,
    clearUnreadCount,
  } = useChatRooms();

  const handleOpenModal = () => {
    setIsOpen(true);
    fetchChatRooms();
  };
  const handleRoomClick = (roomId: string) => {
    console.log("🔍 채팅방 클릭:", roomId);
    const selectedRoom = rooms.find((room) => room.id === roomId);
    console.log("🔍 선택된 채팅방:", selectedRoom);
    console.log("🔍 채팅방 메시지:", selectedRoom?.lastMessage);

    setSelectedRoomId(roomId);
    clearUnreadCount(roomId);
    setIsOpen(true);
  };

  const handleCloseModal = () => {
    setSelectedRoomId(null);
    setIsOpen(false);
  };

  const handleDebugConnection = () => {
    console.log("🔧 디버깅 시작...");
    console.log("📋 현재 채팅방 목록:", rooms);
    console.log("📋 로딩 상태:", isLoading);
    console.log("📋 에러 상태:", error);
  };

  const formatTime = (timestamp: string) => {
    const now = new Date();
    const messageTime = new Date(timestamp);
    const diffInMinutes = Math.floor(
      (now.getTime() - messageTime.getTime()) / (1000 * 60)
    );

    if (diffInMinutes < 1) return "방금 전";
    if (diffInMinutes < 60) return `${diffInMinutes}분 전`;
    if (diffInMinutes < 1440) return `${Math.floor(diffInMinutes / 60)}시간 전`;
    return `${Math.floor(diffInMinutes / 1440)}일 전`;
  };

  return (
    <>
      <button
        onClick={handleOpenModal}
        className="hover:opacity-80 transition-opacity relative"
      >
        <Image src={ChatAvatar} alt="chat" />
        {rooms.some((room) => room.unreadCount > 0) && (
          <div className="absolute -top-1 -right-1 w-3 h-3 bg-red-500 rounded-full"></div>
        )}
      </button>

      {/* 채팅 모달 */}
      {isOpen && (
        <>
          <div onClick={handleCloseModal} />
          <div className="fixed bottom-20 left-8 w-80 h-[30rem] bg-white rounded-lg shadow-md border border-gray-200 z-50 flex flex-col">
            {/* 헤더 */}
            <div className="p-4 border-b border-gray-200 flex justify-between items-center">
              <div>
                <h3 className="font-semibold text-gray-900">채팅</h3>
              </div>
              <div className="flex items-center gap-2">
                <button
                  onClick={handleDebugConnection}
                  className="text-xs bg-blue-500 text-white px-2 py-1 rounded hover:bg-blue-600"
                >
                  🔧 디버그
                </button>
                <button
                  onClick={handleCloseModal}
                  className="text-gray-400 hover:text-gray-600"
                >
                  ✕
                </button>
              </div>
            </div>

            {/* 채팅방 목록 */}
            <div className="flex-1 overflow-y-auto p-4">
              {isLoading ? (
                <div className="flex items-center justify-center h-full">
                  <div className="text-gray-500">
                    채팅방 목록을 불러오는 중...
                  </div>
                </div>
              ) : error ? (
                <div className="flex flex-col items-center justify-center h-full text-center">
                  <div className="text-red-500 mb-2">⚠️ {error}</div>
                </div>
              ) : rooms.length === 0 ? (
                <div className="flex items-center justify-center h-full">
                  <div className="text-gray-500">채팅방이 없습니다</div>
                </div>
              ) : (
                <div className="space-y-3">
                  {rooms.map((room) => (
                    <div
                      key={room.id}
                      className="p-3 rounded-lg hover:bg-gray-50 cursor-pointer transition-colors"
                      onClick={() => handleRoomClick(room.id)}
                    >
                      <div className="flex items-center gap-3">
                        <div className="w-10 h-10 bg-gradient-to-br from-blue-400 to-blue-600 rounded-full flex items-center justify-center text-white text-lg font-semibold">
                          {room.avatar}
                        </div>
                        <div className="flex-1 min-w-0">
                          <div className="flex justify-between items-start mb-1">
                            <h4 className="font-medium text-gray-900 text-sm truncate">
                              {room.name}
                            </h4>
                            <span className="text-xs text-gray-500">
                              {formatTime(room.lastMessageTime)}
                            </span>
                          </div>
                          <div className="flex justify-between items-center">
                            <p className="text-sm text-gray-600 truncate">
                              {room.lastMessage}
                            </p>
                            {room.unreadCount > 0 && (
                              <span className="bg-blue-500 text-white text-xs rounded-full w-5 h-5 flex items-center justify-center ml-2 font-medium">
                                {room.unreadCount}
                              </span>
                            )}
                          </div>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>
        </>
      )}

      {/* 개별 채팅방 모달 */}
      {selectedRoomId && (
        <ChatRoomModal
          roomId={selectedRoomId}
          onClose={handleCloseModal}
          updateRoomMessage={updateRoomMessage}
        />
      )}
    </>
  );
};

export default ChatWidget;
