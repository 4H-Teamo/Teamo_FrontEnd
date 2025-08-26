import {
  teamItem,
  teammateItem,
  BoardType,
  Post,
  User,
} from "@/app/model/type";
import { getValue, formatValue } from "@/app/utils/cardFieldUtils";

interface CardFieldProps {
  board: BoardType;
  data: User | Post;
}

const CardField = ({ board, data }: CardFieldProps) => {
  const fieldLabels = board === "team" ? teamItem : teammateItem;

  return (
    <div className="space-y-3 ">
      {fieldLabels.map(({ key, label }) => (
        <div key={key} className="flex justify-between items-start">
          <div className="font-bold text-main min-w-32">{label}</div>
          <div className="text-black font-semibold flex-1 ">
            {formatValue(key, getValue(board, data, key))}
          </div>
        </div>
      ))}
    </div>
  );
};

export default CardField;
