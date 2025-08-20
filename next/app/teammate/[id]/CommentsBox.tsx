"use client";

import React from "react";
import {currentUserMock} from "@/app/mock/currentUser";

const CommentsBox = () => {
  const [text, setText] = React.useState("");
  const [items, setItems] = React.useState<string[]>([]);
  const nickname = currentUserMock.nickname;
  const handleSubmit = () => {
    if (!text.trim()) return;
    setItems((prev) => [...prev, text.trim()]);
    setText("");
  };
  return (
    <div className="detail-container mt-4">
      <div className="rounded-2xl bg-[#F6F7FA] p-4 md:p-5 border border-gray-200 bg-white">
        <div className="text-sm font-semibold text-black mb-3">{nickname}</div>
        <div className="flex w-full items-center gap-4">
          <input
            className="h-12 min-w-[240px] flex-1 rounded-lg border border-gray-300 px-4 text-[15px] placeholder-[#B3B3B3] outline-none"
            placeholder="내용을 입력하세요"
            value={text}
            onChange={(e) => setText(e.target.value)}
          />
          <button
            onClick={handleSubmit}
            className="button-common h-12 w-[105px] bg-[#5932EA]"
          >
            지원하기
          </button>
        </div>
        {/*<div className="mt-4 space-y-2">*/}
        {/*  {items.map((c, i) => (*/}
        {/*    <div*/}
        {/*      key={`${c}-${i}`}*/}
        {/*      className="rounded-md border border-gray-200 p-3 text-[14px] bg-white"*/}
        {/*    >*/}
        {/*      {c}*/}
        {/*    </div>*/}
        {/*  ))}*/}
        {/*</div>*/}
      </div>
    </div>
  );
};

export default CommentsBox;
