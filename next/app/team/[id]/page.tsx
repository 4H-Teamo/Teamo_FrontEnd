import { getTeamDetail } from "@/app/api/post";
import { workModeIdToLabel } from "@/app/utils/workMode";
import { stackMock } from "@/app/mock/stack";
import DetailSection from "@/app/components/detail/DetailSection";

interface Props {
  params: Promise<{ id: string }>;
}

const TeamDetailPage = async ({ params }: Props) => {
  const { id } = await params;
  const user = await getTeamDetail(id);

  const monthDay = user.updatedAt
    ? new Intl.DateTimeFormat("en-US", {
        month: "short",
        day: "numeric",
      }).format(new Date(user.updatedAt))
    : "";

  const stackIcons = (() => {
    const ids = (user.stacks as unknown as number[]) || [];
    const map = new Map(stackMock.techStack.map((s) => [s.stackId, s]));
    return ids
      .map((id) => map.get(id))
      .filter(Boolean)
      .map((s) => ({ name: (s as any).name, image: (s as any).image }));
  })();

  return (
    <DetailSection
      dateText={monthDay}
      title={user.nickname}
      body={user.description ?? ""}
      rightAction={
        <button className="button-common h-10 px-4">초대하기</button>
      }
      rows={[
        { label: "지역", content: user.location ?? "-" },
        {
          label: "깃허브",
          content: user.github ? (
            <a
              className="text-main underline break-all"
              href={user.github}
              target="_blank"
              rel="noreferrer"
            >
              {user.github}
            </a>
          ) : (
            <span className="text-gray-400">-</span>
          ),
        },
        {
          label: "진행 방식",
          content: workModeIdToLabel(user.workMode as any),
        },
        { label: "새싹여부", content: user.beginner ? "O" : "X" },
        {
          label: "기술 스택",
          content: (
            <div className="flex items-center gap-3">
              {stackIcons.length === 0 && (
                <span className="text-gray-400">-</span>
              )}
              {stackIcons.map((s) => (
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
        { label: "포지션", content: String(user.positionId ?? "-") },
      ]}
    />
  );
};

export default TeamDetailPage;
