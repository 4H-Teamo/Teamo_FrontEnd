"use client";

import { useState } from "react";
import Image from "next/image";
import ChatAvatar from "@/app/assets/chatAvatar.svg";
import { useChatRooms } from "@/app/hooks/useChatRooms";
import ChatRoomModal from "./chatRoomModal";
import ChatRoomItem from "./ChatRoomItem";
import { useChatStore } from "@/app/store/chatStore";

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

  // Zustand Store에서 활성 채팅방 관리
  const { setActiveRoomId } = useChatStore();

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
    setActiveRoomId(roomId); // Zustand Store에 활성 채팅방 설정
    clearUnreadCount(roomId);
    setIsOpen(true);
  };

  const handleCloseModal = () => {
    setSelectedRoomId(null);
    setActiveRoomId(null); // Zustand Store에서 활성 채팅방 해제
    setIsOpen(false);
    // 채팅방에서 나갈 때 목록 새로고침 (안읽은 메시지 카운트 업데이트)
    fetchChatRooms();
  };

  const handleDebugConnection = () => {
    console.log("🔧 디버깅 시작...");
    console.log("📋 현재 채팅방 목록:", rooms);
    console.log("📋 로딩 상태:", isLoading);
    console.log("📋 에러 상태:", error);
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
                    <ChatRoomItem
                      key={room.id}
                      room={room}
                      onClick={handleRoomClick}
                    />
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
