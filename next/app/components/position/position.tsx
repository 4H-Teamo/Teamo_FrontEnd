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
        "w-full grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 xl:grid-cols-8 gap-2 sm:gap-3 md:gap-4 m-4 rounded-xl",
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
