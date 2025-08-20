import React from "react";

type DetailRow = { label: string; content: React.ReactNode };

interface DetailSectionProps {
  dateText?: string;
  title: string;
  body?: string;
  rightAction?: React.ReactNode;
  rows: DetailRow[];
  footer?: React.ReactNode;
}

const DetailSection = ({
  dateText,
  title,
  body,
  rightAction,
  rows,
  footer,
}: DetailSectionProps) => {
  return (
    <section className="detail-container relative w-full mt-6 rounded-[20px] border border-[#D9D9D9] bg-white overflow-hidden p-8 md:p-8 pb-6">
      <div className="flex items-center justify-between">
        <div className="text-[15px] font-medium text-[#1C5CFF]">
          {dateText ?? ""}
        </div>
        {rightAction}
      </div>

      <h1 className="mt-3 text-[30px] font-bold text-black">{title}</h1>

      {body && (
        <div className="mt-6 space-y-3 text-[20px] font-semibold leading-7 text-[#1E1E1E]">
          {body.split("\n").map((line, i) => (
            <p key={i}>{line}</p>
          ))}
        </div>
      )}

      <div className="mt-8 grid grid-cols-[100px_1fr] gap-y-4 text-[15px] font-semibold">
        {rows.map((r, idx) => (
          <React.Fragment key={`${r.label}-${idx}`}>
            <div className="text-[#5A5AF7]">{r.label}</div>
            <div className="text-black">{r.content}</div>
          </React.Fragment>
        ))}
      </div>
    </section>
  );
};

export default DetailSection;
