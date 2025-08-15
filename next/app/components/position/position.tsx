import { POSITION, type Positions } from "@/app/constants/forms/positions";
import clsx from "clsx";

type Props = {
  value: Positions[];
  className: string;
  onChange: (value: Positions[]) => void;
};

const Position = ({ className, value, onChange }: Props) => {
  const handleToggle = (position: Positions) => {
    const selected = value.some((s) => s.positionId === position.positionId);
    const newSelected = selected
      ? value.filter((s) => s.positionId !== position.positionId)
      : [...value, position];
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
        const isActive = value.some(
          (s) => s.positionId === position.positionId
        );
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
