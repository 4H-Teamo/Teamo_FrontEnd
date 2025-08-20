import clsx from "clsx";
import type { Stack } from "@/app/model/stack";
type Props = {
  stacks: Stack[];
  selected: number[];
  onToggle: (stack: Stack) => void;
};

const TechStackLabel = ({ stacks, selected, onToggle }: Props) => {
  return (
    <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-8 gap-2">
      {stacks.map((stack) => {
        const isActive = selected.includes(stack.stackId);
        return (
          <div
            key={stack.stackId}
            onClick={() => onToggle(stack)}
            className={clsx(
              "badge-common",
              isActive ? "badge-active" : "badge-inactive"
            )}
          >
            {stack.name}
          </div>
        );
      })}
    </div>
  );
};

export default TechStackLabel;
