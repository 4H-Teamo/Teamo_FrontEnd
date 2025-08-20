"use client";
import Card from "@/app/components/card/cardFeed";
import { useUsers } from "@/app/hooks/useUserProfile";

const TeammateList = () => {
  const { data: users, error } = useUsers(1, 50);

  if (error) {
    return (
      <div>
        ㅌ
        <div className="flex justify-center items-center h-64">
          <div className="text-red-500">데이터를 불러오는데 실패했습니다.</div>
        </div>
      </div>
    );
  }

  return (
    <div>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-2 xl:grid-cols-3 gap-6">
        {users && users.length > 0 ? (
          users.map((user) => (
            <Card key={user.userId} type="teammate" data={user} />
          ))
        ) : (
          <div className="col-span-full flex justify-center items-center h-64">
            <div className="text-gray-500">등록된 팀원이 없습니다.</div>
          </div>
        )}
      </div>
    </div>
  );
};

export default TeammateList;
