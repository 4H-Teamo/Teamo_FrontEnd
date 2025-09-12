"use client";

import { useMemo } from "react";

type Stat = { stackId: number; name: string; demand: number; supply: number };

export default function StackDemandSupplyChart({
  stats,
  maxBars = 8,
  gridDivisions = 5,
}: {
  stats: Stat[];
  maxBars?: number;
  gridDivisions?: number;
}) {
  // 막대, 격자, Y축 라벨이 동일한 시작점(좌측/하단 패딩)을 공유
  const chartLeftPx = 48; // 모바일: 48px, 데스크톱: 64px
  const labelGapPx = 12; // 격자(막대 시작점)와 Y축 라벨 사이 여백
  const chartBottomPx = 32; // X축 레이블 영역 높이
  const top = useMemo(() => {
    const arr = [...stats];
    arr.sort((a, b) => b.demand - a.demand);
    return arr.slice(0, maxBars);
  }, [stats, maxBars]);

  const rawMax = Math.max(1, ...top.map((s) => Math.max(s.demand, s.supply)));
  const divisions = Math.max(1, Math.floor(gridDivisions));
  const unit = Math.ceil(rawMax / divisions); // 한 칸 높이
  const yMax = Math.max(unit * divisions, unit); // 0 ~ divisions 등분
  const step = yMax / divisions;
  const ticks = Array.from({ length: divisions + 1 }, (_, i) =>
    Math.round(i * step)
  );

  if (!top.length) {
    return (
      <div className="w-full rounded-2xl p-6 bg-white text-gray-400 text-sm">
        데이터가 없습니다.
      </div>
    );
  }

  return (
    <div className="w-full rounded-2xl p-3 sm:p-4 md:p-6 bg-white relative shadow-[0_2px_4px_-1px_rgba(0,0,0,0.1)]">
      <div className="relative h-64 sm:h-72 md:h-80">
        {/* 격자 라인: 막대 시작점과 동일 좌표에서 렌더 */}
        <div
          className="absolute right-0 top-0 z-0 pointer-events-none"
          style={{
            left: `${chartLeftPx}px`,
            bottom: `${chartBottomPx}px`,
            position: "absolute",
          }}
        >
          <div className="relative h-full w-full">
            {ticks.map((t) => {
              const topPct = 100 - (t / yMax) * 100;
              const alpha = t === 0 ? 0.09 : 0.18;
              return (
                <div
                  key={`grid-${t}`}
                  className="absolute left-0 right-0"
                  style={{
                    top: `${topPct}%`,
                    borderTop: `1px dashed rgba(0,0,0,${alpha})`,
                  }}
                />
              );
            })}
          </div>
        </div>

        {/* Y축 라벨 (왼쪽, 격자/막대와 동일한 세로 영역에 배치) */}
        <div
          className="absolute left-0 z-20"
          style={{
            top: 0,
            bottom: `${chartBottomPx}px`,
            width: `${chartLeftPx - labelGapPx - 15}px`,
          }}
        >
          <div className="relative h-full w-full">
            {ticks.map((t) => {
              const topPct = 100 - (t / yMax) * 100;
              return (
                <div
                  key={`y-${t}`}
                  className="absolute right-0 -translate-y-1/2 text-[10px] md:text-xs text-gray-400 text-right"
                  style={{ top: `${topPct}%` }}
                >
                  {t === 0 ? "00" : t}
                </div>
              );
            })}
          </div>
        </div>

        {/* 막대 영역 */}
        <div
          className="absolute right-0 top-0 z-10 grid grid-flow-col auto-cols-[40px] sm:auto-cols-[50px] md:auto-cols-[60px] lg:auto-cols-[80px] gap-1 sm:gap-1.5 md:gap-2 items-end"
          style={{
            left: `${chartLeftPx}px`,
            bottom: `${chartBottomPx}px`,
            position: "absolute",
          }}
        >
          {top.map((item) => {
            const demandPct = (item.demand / yMax) * 100;
            const supplyPct = (item.supply / yMax) * 100;
            const demandMin = item.demand > 0 ? 4 : 0;
            const supplyMin = item.supply > 0 ? 4 : 0;
            return (
              <div
                key={item.stackId}
                className="flex flex-col items-center h-full w-[40px] sm:w-[50px] md:w-[60px] lg:w-[80px]"
              >
                <div className="flex items-end gap-1 sm:gap-1.5 md:gap-2 h-full">
                  <div
                    className="w-2 bg-indigo-600 rounded-sm"
                    style={{ height: `${demandPct}%`, minHeight: demandMin }}
                  />
                  <div
                    className="w-2 bg-gray-400 rounded-sm"
                    style={{ height: `${supplyPct}%`, minHeight: supplyMin }}
                  />
                </div>
              </div>
            );
          })}
        </div>

        {/* X축 라벨: 막대 바로 아래 영역에 분리 렌더 */}
        <div
          className="absolute right-0 bottom-0 z-10 grid grid-flow-col auto-cols-[40px] sm:auto-cols-[50px] md:auto-cols-[60px] lg:auto-cols-[80px] gap-1 sm:gap-1.5 md:gap-2 items-start"
          style={{
            left: `${chartLeftPx}px`,
            height: `${chartBottomPx}px`,
            position: "absolute",
          }}
        >
          {top.map((item) => (
            <div
              key={`label-${item.stackId}`}
              className="w-[40px] sm:w-[50px] md:w-[60px] lg:w-[80px] flex justify-center"
            >
              <div
                className="text-[8px] sm:text-[10px] md:text-[12px] lg:text-[14px] text-black font-normal text-center break-words"
                style={{ fontFamily: "Pretendard" }}
              >
                {item.name}
              </div>
            </div>
          ))}
        </div>
      </div>

      <div className="mt-2 sm:mt-3 w-full flex justify-end">
        <div className="bg-white/90 backdrop-blur-sm rounded-md shadow px-2 sm:px-3 py-1.5 sm:py-2 flex flex-col gap-1 sm:gap-2 text-[10px] sm:text-xs">
          <div className="flex items-center gap-1.5 sm:gap-2">
            <span className="inline-block w-6 sm:w-8 md:w-10 h-0.5 bg-indigo-600" />
            <span>수요</span>
          </div>
          <div className="flex items-center gap-1.5 sm:gap-2">
            <span className="inline-block w-6 sm:w-8 md:w-10 h-0.5 bg-gray-400" />
            <span>공급</span>
          </div>
        </div>
      </div>
    </div>
  );
}
