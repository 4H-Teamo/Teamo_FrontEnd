import {
  HydrationBoundary,
  dehydrate,
  QueryClient,
} from "@tanstack/react-query";
import TeammateDetailClient from "./teammateDetailClient";
import { API_BASE } from "@/app/constants/url";

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
      const res = await fetch(`${API_BASE}/users/${userId}`, {
        credentials: "include",
        cache: "no-store",
      });
      return res.json();
    },
  });

  return (
    <HydrationBoundary state={dehydrate(queryClient)}>
      <TeammateDetailClient userId={userId} />
    </HydrationBoundary>
  );
}
