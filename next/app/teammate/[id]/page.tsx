import { getTeammateDetail } from "@/app/api/post";
import { workModeIdToLabel } from "@/app/utils/workMode";
import { positionsToLabels } from "@/app/utils/position";
import { stackMock } from "@/app/mock/stack";
import CommentsBox from "@/app/teammate/[id]/CommentsBox";
import DetailSection from "@/app/components/detail/DetailSection";

interface Props {
  params: Promise<{ id: string }>;
}

const TeammateDetailPage = async ({ params }: Props) => {
  const { id } = await params;
  const post = await getTeammateDetail(id);

  const formatMonthDay = (d?: string) => {
    if (!d) return "";
    try {
      return new Intl.DateTimeFormat("en-US", {
        month: "short",
        day: "numeric",
      }).format(new Date(d));
    } catch {
      return d;
    }
  };

  const stackNames = (() => {
    const ids = (post.stacks as unknown as number[]) || [];
    const map = new Map(stackMock.techStack.map((s) => [s.stackId, s]));
    return ids
      .map((id) => map.get(id))
      .filter(Boolean)
      .map((s) => ({ name: (s as any).name, image: (s as any).image }));
  })();

  const positionLabels = positionsToLabels(
    (post.positions as unknown as Array<number | string>) || []
  );

  return (
    <>
      <DetailSection
        dateText={formatMonthDay(
          (post.updatedAt as unknown as string) || post.endDate
        )}
        title={post.title}
        body={post.content}
        rows={[
          {
            label: "진행 방식",
            content: workModeIdToLabel(post.workMode as any),
          },
          {
            label: "기술 스택",
            content: (
              <div className="flex items-center gap-3">
                {stackNames.length === 0 && (
                  <span className="text-gray-400">-</span>
                )}
                {stackNames.map((s) => (
                  <img
                    key={s.name}
                    src={s.image}
                    alt={s.name}
                    title={s.name}
                    className="h-8 w-8 rounded-md border border-gray-200 object-cover"
                  />
                ))}
              </div>
            ),
          },
          { label: "지역", content: (post.location as any) ?? "-" },
          {
            label: "모집 분야",
            content:
              positionLabels.length > 0 ? (
                positionLabels.join(" ")
              ) : (
                <span className="text-gray-400">-</span>
              ),
          },
        ]}
      />
      <div className="detail-container">
        <CommentsBox />
      </div>
    </>
  );
};

export default TeammateDetailPage;
