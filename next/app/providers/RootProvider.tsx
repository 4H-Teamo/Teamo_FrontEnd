"use client";

import React from "react";
import QueryProvider from "./QueryProvider";
import { useAuthSync } from "@/app/hooks/useAuthSync";
import { useMessageHandler } from "@/app/socket/messageHandler";

const RootProvider = ({ children }: { children: React.ReactNode }) => {
  useAuthSync();
  useMessageHandler(); // 전역적으로 한 번만 호출
  return <QueryProvider>{children}</QueryProvider>;
};

export default RootProvider;
