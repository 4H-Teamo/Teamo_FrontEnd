"use client";

import Image from "next/image";
import Trash from "@/app/assets/trash.svg";
import { deleteMyPost } from "@/app/api/post";
import { toast } from "sonner";

interface DeleteButtonProps {
  postId: number;
  accessToken: string;
  onDelete: (deletedPostId: number) => void;
}

const DeleteButton = ({ postId, accessToken, onDelete }: DeleteButtonProps) => {
  const handleDelete = async () => {
    if (!confirm("정말로 이 글을 삭제하시겠습니까?")) {
      return;
    }

    try {
      await deleteMyPost(accessToken, postId);
      toast.success("글이 삭제되었습니다.");
      onDelete(postId);
    } catch (err) {
      console.error("글 삭제 실패:", err);
      toast.error("글 삭제에 실패했습니다.");
    }
  };

  return (
    <Image
      src={Trash}
      alt="삭제"
      width={18}
      height={18}
      className="cursor-pointer hover:opacity-70 transition-opacity"
      onClick={handleDelete}
    />
  );
};

export default DeleteButton;
