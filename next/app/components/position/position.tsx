import { POSITION, type Positions } from "@/app/constants/forms/positions";
import clsx from "clsx";

type Props = {
  value: number[];
  className: string;
  onChange: (value: number[]) => void;
};

const Position = ({ className, value, onChange }: Props) => {
  const safeValue = value || null;

  const handleToggle = (position: Positions) => {
    const selected = safeValue.includes(position.id);
    const newSelected = selected
      ? safeValue.filter((id) => id !== position.id)
      : [...safeValue, position.id];
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
        const isActive = safeValue.includes(position.id);
        return (
          <div
            key={position.id}
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
