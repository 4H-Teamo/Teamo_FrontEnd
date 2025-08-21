// import {
//   HydrationBoundary,
//   dehydrate,
//   QueryClient,
// } from "@tanstack/react-query";
// import TeammateList from "./list";

// export default async function TeammatePage() {
//   const queryClient = new QueryClient();

//   await queryClient.prefetchQuery({
//     queryKey: ["users", 1, 50],
//     queryFn: async () => {
//       const res = await fetch(
//         `${process.env.NEXT_PUBLIC_API_URL}/api/proxy/users`,
//         {
//           credentials: "include",
//           cache: "no-store",
//         }
//       );
//       return res.json();
//     },
//   });

//   return (
//     <HydrationBoundary state={dehydrate(queryClient)}>
//       <TeammateList />
//     </HydrationBoundary>
//   );

import PageHeader from "@/app/components/pageHeader/header";
import InfiniteTeamList from "@/app/team/InfiniteTeamList";
import {
  HydrationBoundary,
  QueryClient,
  dehydrate,
} from "@tanstack/react-query";
import { getTeammates } from "@/app/api/post";

interface Props {
  searchParams: Promise<{ [key: string]: string | string[] | undefined }>;
}

const Team = async ({ searchParams }: Props) => {
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
        <InfiniteTeamList limit={limit} />
      </div>
    </HydrationBoundary>
  );
};

export default Team;
