"use client";
import { useTeammateDetail } from "@/app/hooks/useTeammate";
import CardDetail from "@/app/components/card/cardDetail";

interface TeammateDetailClientProps {
  userId: string;
}

const TeammateDetailClient = ({ userId }: TeammateDetailClientProps) => {
  const { data: user, isLoading, error } = useTeammateDetail(userId);

  if (isLoading) {
    return (
      <div className="flex justify-center items-center h-64">
        <div className="text-gray-500">로딩 중...</div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex justify-center items-center h-64">
        <div className="text-red-500">
          사용자 정보를 불러오는데 실패했습니다.
        </div>
      </div>
    );
  }

  if (!user) {
    return (
      <div className="flex justify-center items-center h-64">
        <div className="text-gray-500">사용자를 찾을 수 없습니다.</div>
      </div>
    );
  }

  return (
    <div className="h-10/12 border border-gray-300 rounded-xl p-16 mt-10">
      <CardDetail type="teammate" data={user} />
    </div>
  );
};

export default TeammateDetailClient;
