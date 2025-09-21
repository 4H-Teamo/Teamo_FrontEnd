"use client";

import { useCurrentUser, useUserProfile } from "@/app/hooks/useUserProfile";
import { ChatRoom } from "@/app/types/chat";
import { formatTime } from "@/app/utils/formatTime";
import {
  findOtherParticipant,
  generateDisplayName,
} from "@/app/utils/formatChat";

interface ChatRoomItemProps {
  room: ChatRoom;
  onClick: (roomId: string) => void;
}

const ChatRoomItem = ({ room, onClick }: ChatRoomItemProps) => {
  const { data: currentUser } = useCurrentUser();
  const otherParticipant = findOtherParticipant(
    room.participants,
    currentUser?.userId
  );
  const { data: otherUser } = useUserProfile(otherParticipant || "");

  // 상대방 이름 결정
  const displayName = generateDisplayName(otherUser, otherParticipant);

  return (
    <div
      className="p-3 rounded-lg hover:bg-gray-50 cursor-pointer transition-colors"
      onClick={() => onClick(room.id)}
    >
      <div className="flex items-center gap-3">
        <div className="w-10 h-10 bg-gradient-to-br from-blue-400 to-blue-600 rounded-full flex items-center justify-center text-white text-lg font-semibold">
          {room.avatar}
        </div>
        <div className="flex-1 min-w-0">
          <div className="flex justify-between items-start mb-1">
            <h4 className="font-medium text-gray-900 text-sm truncate">
              {displayName}
            </h4>
            <span className="text-xs text-gray-500">
              {formatTime(room.lastMessageTime)}
            </span>
          </div>
          <div className="flex justify-between items-center">
            <p className="text-sm text-gray-600 truncate">
              {room.lastMessage?.content || "메시지가 없습니다"}
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
  );
};

export default ChatRoomItem;
