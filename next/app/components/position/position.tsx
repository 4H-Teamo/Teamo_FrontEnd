import { POSITION, type Positions } from "@/app/constants/forms/positions";
import clsx from "clsx";

type Props = {
  value: number[]; // 배열로 변경
  className: string;
  onChange: (value: number[]) => void; // 배열 반환
};

const Position = ({ className, value, onChange }: Props) => {
  const safeValue = value || null;

  const handleToggle = (position: Positions) => {
    const selected = safeValue.includes(position.positionId); // some 대신 includes 사용
    const newSelected = selected
      ? safeValue.filter((id) => id !== position.positionId) // 배열에서 제거
      : [...safeValue, position.positionId]; // 배열에 추가
    onChange(newSelected);
  };

  return (
    <div
      className={clsx(
        "w-full flex flex-row gap-4 m-4  rounded-xl md:w-6/8 lg:w-[54rem]",
        className
      )}
    >
      {POSITION.map((position) => {
        const isActive = safeValue.includes(position.positionId); // some 대신 includes 사용
        return (
          <div
            key={position.positionId}
            onClick={() => handleToggle(position)}
            className={clsx(
              "badge-common",
              className,
              isActive ? "badge-active" : "badge-inactive"
            )}
          >
            {position.label}
          </div>
        );
      })}
    </div>
  );
};

export default Position;
