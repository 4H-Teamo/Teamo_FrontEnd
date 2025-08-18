"use client";

import React from "react";
import QueryProvider from "./QueryProvider";
import { useAuthSync } from "@/app/hooks/useAuthSync";

const RootProvider = ({ children }: { children: React.ReactNode }) => {
  useAuthSync();
  return <QueryProvider>{children}</QueryProvider>;
};

export default RootProvider;
