import { useInfiniteQuery, useQuery } from "@tanstack/react-query";
import {
  getTeams,
  getTeamDetail,
  getTeammates,
  getTeammateDetail,
} from "@/app/api/post";

export const useTeams = () =>
  useQuery<any[]>({ queryKey: ["teams"], queryFn: () => getTeams(1, 12) });

export const useTeam = (id: string) =>
  useQuery<any>({ queryKey: ["team", id], queryFn: () => getTeamDetail(id) });

export const useTeammates = () =>
  useQuery<any[]>({
    queryKey: ["teammates"],
    queryFn: () => getTeammates(1, 12),
  });

export const useTeammate = (id: string) =>
  useQuery<any>({
    queryKey: ["teammate", id],
    queryFn: () => getTeammateDetail(id),
  });

export const useInfiniteTeammates = (limit: number = 12) =>
  useInfiniteQuery<any[], Error>({
    queryKey: ["teammates", "infinite", limit],
    initialPageParam: 1,
    queryFn: ({ pageParam }) => getTeammates(pageParam as number, limit),
    getNextPageParam: (lastPage, allPages, lastPageParam) => {
      const curr = (lastPageParam as number) ?? allPages.length;
      return Array.isArray(lastPage) && lastPage.length >= limit
        ? curr + 1
        : undefined;
    },
    refetchOnWindowFocus: false,
  });

export const useInfiniteTeams = (limit: number = 12) =>
  useInfiniteQuery<any[], Error>({
    queryKey: ["teams", "infinite", limit],
    initialPageParam: 1,
    queryFn: ({ pageParam }) => getTeams(pageParam as number, limit),
    getNextPageParam: (lastPage, allPages, lastPageParam) => {
      const curr = (lastPageParam as number) ?? allPages.length;
      return Array.isArray(lastPage) && lastPage.length >= limit
        ? curr + 1
        : undefined;
    },
    refetchOnWindowFocus: false,
  });
