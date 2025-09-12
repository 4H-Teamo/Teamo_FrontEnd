import InfiniteTeamList from "@/app/team/InfiniteTeamList";
import {
  HydrationBoundary,
  QueryClient,
  dehydrate,
} from "@tanstack/react-query";
import { getTeams } from "@/app/api/post";
import PageHeader from "../components/pageHeader/header";
import Link from "next/link";
import { URL } from "../constants/url";
import Button from "../components/button/button";

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
      <div>
        <PageHeader title="팀 찾기" />
        <div className="flex justify-end">
          <Link href={URL.CREATE_NEW_TEAM}>
            <Button className="button-circle">팀 만들기</Button>
          </Link>
        </div>

        <InfiniteTeamList limit={limit} />
      </div>
    </HydrationBoundary>
  );
};

export default Team;
