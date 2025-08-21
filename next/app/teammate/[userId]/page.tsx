import {
  HydrationBoundary,
  dehydrate,
  QueryClient,
} from "@tanstack/react-query";
import TeammateDetailClient from "./teammateDetailClient";

interface TeammateDetailPageProps {
  params: Promise<{ userId: string }>;
}

export default async function TeammateDetailPage({
  params,
}: TeammateDetailPageProps) {
  const { userId } = await params;
  const queryClient = new QueryClient();

  await queryClient.prefetchQuery({
    queryKey: ["teammate", userId],
    queryFn: async () => {
      const res = await fetch(
        `${process.env.NEXT_PUBLIC_API_URL}/api/proxy/users/${userId}`,
        {
          credentials: "include",
          cache: "no-store",
        }
      );
      return res.json();
    },
  });

  return (
    <HydrationBoundary state={dehydrate(queryClient)}>
      <TeammateDetailClient userId={userId} />
    </HydrationBoundary>
  );
}
