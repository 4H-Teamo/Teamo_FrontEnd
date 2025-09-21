"use client";

import { io, Socket } from "socket.io-client";

const SOCKET_SERVER_URL = process.env.NEXT_PUBLIC_BACKEND_URL;

let socket: Socket | null = null;

export const initializeSocket = (): Socket | null => {
  if (typeof window === "undefined") {
    return null;
  }

  if (socket) {
    return socket;
  }

  socket = io("http://211.230.62.32:81/chat", {
    path: "/api/socket.io",
    withCredentials: true,
    autoConnect: true,
    reconnection: true,
    reconnectionAttempts: 5,
    reconnectionDelay: 1000,
    transports: ["websocket", "polling"],
    timeout: 20000,
    forceNew: true,
  });

  socket.on("connect", () => {
    console.log("✅ 서버에 연결됨!", {
      id: socket?.id,
      connected: socket?.connected,
      url: SOCKET_SERVER_URL,
    });
  });

  socket.on("disconnect", (reason) => {
    console.log("❌ 서버 연결 끊김", { reason });
  });

  socket.on("error", (err) => {
    console.error("💥 소켓 에러:", err);
  });

  socket.on("connect_error", (err) => {
    console.error("🚫 연결 에러:", err);
    console.error("🚫 에러 상세:", {
      message: err.message,
    });
  });

  // 연결 상태 주기적 확인 (디버깅용)
  setInterval(() => {
    if (socket) {
      console.log("🔍 소켓 상태:", {
        connected: socket.connected,
        id: socket.id,
        url: SOCKET_SERVER_URL,
      });
    }
  }, 30000); // 30초마다 확인

  return socket;
};

// 소켓 인스턴스 반환 (클라이언트에서만)
export const getSocket = (): Socket | null => {
  if (typeof window === "undefined") {
    return null;
  }

  if (!socket) {
    return initializeSocket();
  }

  return socket;
};
