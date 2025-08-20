"use client";
import { useRouter } from "next/navigation";
import { URL } from "@/app/constants/url";
import { stackMock } from "@/app/mock/stack";
import MatchLabel from "@/app/components/card/matchLabel";
import type { LabelType } from "@/app/components/card/matchLabel";
import { useEffect, useState, useMemo } from "react";
import type { CardData } from "@/app/model/card";
import { workModeIdToLabel } from "@/app/utils/workMode";

type CardType = "teammate" | "team";

interface CardLayoutProps {
  id: string | number;
  type: CardType;
  data: CardData<CardType>;
  labels?: string[];
}

const workModeAnyToLabel = (mode: any) => {
  const byId = workModeIdToLabel(mode);
  if (byId) return byId;
  if (mode === "ONLINE") return "온라인";
  if (mode === "OFFLINE") return "오프라인";
  if (mode === "BOTH") return "상관없음";
  return "";
};

const formatDateText = (dateLike?: string) => {
  if (!dateLike) return "";
  const d = new Date(dateLike);
  if (isNaN(d.getTime())) return "";
  const y = d.getFullYear();
  const m = `${d.getMonth() + 1}`.padStart(2, "0");
  const dd = `${d.getDate()}`.padStart(2, "0");
  return `${y}-${m}-${dd}`;
};

const stackIdToName = (ids?: number[]) => {
  if (!ids || ids.length === 0) return [] as string[];
  const map = new Map(stackMock.techStack.map((s) => [s.stackId, s.name]));
  return ids.map((id) => map.get(id) ?? `#${id}`);
};

const HeaderMeta = ({ date, mode }: { date: string; mode: string }) => (
  <div className="flex justify-between items-center text-[18px] font-bold text-[#5A5AF7]">
    <div>{date}</div>
    <div className="text-black text-[16px] font-semibold">{mode}</div>
  </div>
);

const ContentBox = ({
  title,
  content,
}: {
  title?: string;
  content?: string;
}) => (
  <div className="rounded-2xl w-full min-h-[180px] border border-gray-200 p-6 mt-4 overflow-hidden bg-white">
    {title && (
      <div className="text-[20px] font-bold text-black leading-7 line-clamp-2">
        {title}
      </div>
    )}
    {content && (
      <div className="mt-3 text-[15px] font-medium leading-7 text-[#2E2E2E] line-clamp-5 whitespace-pre-line">
        {content}
      </div>
    )}
  </div>
);

type ComputedLabel = { type: LabelType; text: string };

const LabelsRow = ({ items }: { items?: ComputedLabel[] }) =>
  items && items.length > 0 ? (
    <div className="mt-5 flex items-center gap-3">
      {items.map((l, i) => (
        <MatchLabel key={`${l.text}-${i}`} type={l.type}>
          {l.text}
        </MatchLabel>
      ))}
    </div>
  ) : null;

const StacksRow = ({ names }: { names: string[] }) => (
  <div className="mt-5 flex items-center justify-between">
    <div className="flex items-center gap-3">
      {names.slice(0, 5).map((name) => {
        const record = stackMock.techStack.find((s) => s.name === name);
        const src = record?.image ?? "";
        return (
          <img
            key={name}
            src={src}
            alt={name}
            className="h-9 w-9 rounded-lg border border-gray-200 object-cover"
          />
        );
      })}
    </div>
    <div className="text-gray-400 text-xl">•••</div>
  </div>
);

const CardLayout = ({ id, type, data, labels }: CardLayoutProps) => {
  const router = useRouter();
  const handleClick = () => {
    const href =
      type === "teammate" ? URL.TEAMMATE_DETAIL(id) : URL.TEAM_DETAIL(id);
    router.push(href);
  };

  const {
    dateText: rawDateText,
    workMode,
    title,
    content,
    stackIds,
    labels: dataLabels,
  } = data as CardData<CardType>;

  const dateText = formatDateText(rawDateText);
  const modeText = workModeAnyToLabel(workMode);
  const titleText = title;
  const contentText = content;
  const stackNames = stackIdToName(stackIds ?? []);
  const labelList = labels ?? dataLabels;

  return (
    <button
      type="button"
      onClick={handleClick}
      className="w-full max-w-[520px] border rounded-2xl border-gray-300 flex flex-col p-6 font-semibold text-sm mt-8 text-left"
    >
      <HeaderMeta date={dateText || ""} mode={modeText || ""} />
      <ContentBox title={titleText} content={contentText} />
      {type === "teammate" && (
        <LabelsRow
          items={labelList?.map((t) => ({
            type: t as any as LabelType,
            text: t,
          }))}
        />
      )}
      <StacksRow names={stackNames} />
    </button>
  );
};
export default CardLayout;
