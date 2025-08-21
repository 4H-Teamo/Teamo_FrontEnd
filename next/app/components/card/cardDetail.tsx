import CardField from "@/app/components/card/cardField";
import { BoardType, Post, User } from "@/app/model/type";
interface CardLayoutProps {
  type: BoardType;
  data: Post | User;
}

const CardDetail = ({ type, data }: CardLayoutProps) => {
  return (
    <div className="flex flex-col h-full">
      <div className="flex flex-col gap-8">
        <div className="text-3xl font-bold text-black">
          {type === "teammate" ? (data as User).nickname : (data as Post).title}
        </div>
        <div className="text-black text-xl font-semibold">
          {type === "teammate"
            ? (data as User).description
            : (data as Post).content}
        </div>
      </div>

      <div className="flex-1">
        <CardField board={type} data={data} />
      </div>

      <div className="flex justify-end items-end mt-8">
        <div className="text-right text-gray-600 max-w-xs">
          {type === "teammate"
            ? (data as User).description
            : (data as Post).content}
        </div>
      </div>
    </div>
  );
};
export default CardDetail;
