import CardField from "@/app/components/card/cardField";
import { BoardType, Post, User } from "@/app/model/type";
import Button from "../button/button";
import { formatISOToKorean } from "@/app/utils/formatDate";

interface CardLayoutProps {
  type: BoardType;
  data: Post | User;
}

const CardDetail = ({ type, data }: CardLayoutProps) => {
  return (
    <div className="flex flex-col h-full space-y-12">
      <div className="flex flex-col gap-8">
        <div className="text-main text-sm font-semibold">
          {type === "teammate"
            ? formatISOToKorean((data as User).updatedAt)
            : formatISOToKorean((data as Post).updatedAt)}
        </div>

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
          {type === "teammate" ? (
            <Button className="button-common">채팅하기</Button>
          ) : (
            ""
          )}
        </div>
      </div>
    </div>
  );
};
export default CardDetail;
