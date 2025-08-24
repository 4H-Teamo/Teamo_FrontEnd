import PageHeader from "@/app/components/pageHeader/header";
import InfiniteTeammateList from "@/app/teammate/InfiniteTeammateList";
import {
  HydrationBoundary,
  QueryClient,
  dehydrate,
} from "@tanstack/react-query";
import { getTeammates } from "@/app/api/post";

interface Props {
  searchParams: Promise<{ [key: string]: string | string[] | undefined }>;
}

const Teammate = async ({ searchParams }: Props) => {
  const sp = await searchParams;
  const limitStr = Array.isArray(sp.limit) ? sp.limit[0] : sp.limit;
  const limit = Number(limitStr ?? 12);
  const qc = new QueryClient();
  await qc.prefetchInfiniteQuery({
    queryKey: ["teammates", "infinite", limit],
    queryFn: ({ pageParam }) => getTeammates((pageParam as number) ?? 1, limit),
    initialPageParam: 1,
  });
  const state = JSON.parse(JSON.stringify(dehydrate(qc)));

  return (
    <HydrationBoundary state={state}>
      <div>
        <PageHeader title="팀원 찾기" />
        <InfiniteTeammateList limit={limit} />
      </div>
    </HydrationBoundary>
  );
};

export default Teammate;
