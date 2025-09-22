import CardDetail from "@/app/components/card/cardDetail";

interface Props {
  params: Promise<{ postId: string }>;
}

const TeamDetailPage = async ({ params }: Props) => {
  const { postId } = await params;

  try {
    const backend =
      process.env.BACKEND_INTERNAL_URL || "http://teamo_backend:4000";

    const res = await fetch(`${backend}/posts/${postId}`, {
      cache: "no-store",
    });
    if (!res.ok) throw new Error(`HTTP ${res.status}`);
    const post = await res.json();

    if (!post) {
      return (
        <div className="max-w-4xl mx-auto p-6">
          <div className="flex justify-center items-center h-64">
            <div className="text-gray-500">팀 모집글을 찾을 수 없습니다.</div>
          </div>
        </div>
      );
    }

    return (
      <div className="w-full md:max-w-2xl lg:max-w-4xl xl:max-w-6xl py-4 md:py-6 lg:py-8">
        <div className="border border-gray-300 rounded-xl p-4 md:p-8 lg:p-12 mt-4 md:mt-6 lg:mt-8">
          <CardDetail type="team" data={post} />
        </div>
      </div>
    );
  } catch (error) {
    console.error("팀 모집글 조회 에러:", error);
    return (
      <div className="max-w-4xl mx-auto p-6">
        <div className="flex justify-center items-center h-64">
          <div className="text-red-500">팀 모집글을 불러오는데 실패했습니다.</div>
        </div>
      </div>
    );
  }
};

export default TeamDetailPage;
