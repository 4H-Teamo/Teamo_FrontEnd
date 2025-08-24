import InfiniteTeamList from "@/app/team/InfiniteTeamList";
import {
  HydrationBoundary,
  QueryClient,
  dehydrate,
} from "@tanstack/react-query";
import { getTeams } from "@/app/api/post";

interface Props {
  searchParams: Promise<{ [key: string]: string | string[] | undefined }>;
}

const Team = async ({ searchParams }: Props) => {
  const sp = await searchParams;
  const limitStr = Array.isArray(sp.limit) ? sp.limit[0] : sp.limit;
  const limit = Number(limitStr ?? 12);
  const qc = new QueryClient();
  await qc.prefetchInfiniteQuery({
    queryKey: ["teams", "infinite", limit],
    queryFn: ({ pageParam }) => getTeams((pageParam as number) ?? 1, limit),
    initialPageParam: 1,
  });
  const state = JSON.parse(JSON.stringify(dehydrate(qc)));

  return (
    <HydrationBoundary state={state}>
      <InfiniteTeamList limit={limit} />
    </HydrationBoundary>
  );
};

export default Team;
