import {
  teamItem,
  teammateItem,
  BoardType,
  Post,
  User,
} from "@/app/model/type";
import { WORK_MODE } from "@/app/constants/forms/workMode";
import { stackMock } from "@/app/mock/stack";

interface CardFieldProps {
  board: BoardType;
  data: User | Post;
}
const CardField = ({ board, data }: CardFieldProps) => {
  const fieldLabels = board === "team" ? teamItem : teammateItem;

  const formatValue = (key: string, value: unknown) => {
    const formatters = {
      workMode: () =>
        WORK_MODE.find((mode) => mode.id === value)?.value || "정보 없음",
      stacks: () =>
        Array.isArray(value)
          ? value
              .map(
                (id) =>
                  stackMock.techStack.find((stack) => stack.stackId === id)
                    ?.name || `ID: ${id}`
              )
              .join(", ")
          : "정보 없음",
    };

    return (
      formatters[key as keyof typeof formatters]?.() ||
      String(value || "정보 없음")
    );
  };

  return (
    <div className="space-y-3">
      {fieldLabels.map(({ key, label }) => (
        <div key={key} className="flex justify-between items-start">
          <div className="font-bold text-main min-w-32">{label}</div>
          <div className="text-black font-semibold flex-1 ">
            {formatValue(key, (data as any)[key])}
          </div>
        </div>
      ))}
    </div>
  );
};
export default CardField;
