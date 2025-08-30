"use client";

import PageHeader from "@/app/components/pageHeader/header";
import Link from "next/link";
import DeleteButton from "@/app/components/button/deleteButton";
import { useQueryClient } from "@tanstack/react-query";
import { useMyPosts } from "@/app/hooks/usePosts";
import { useAccessToken } from "@/app/hooks/useUser";

const MyTeam = () => {
  const queryClient = useQueryClient();
  const { accessToken } = useAccessToken();
  const { data: myPosts, isLoading, error } = useMyPosts(accessToken);

  const handleDelete = () => {
    queryClient.invalidateQueries({ queryKey: ["myPosts"] });
  };

  if (!accessToken) {
    return (
      <div className="p-4">
        <PageHeader title="내 글 목록" />
        <div className="mt-4 text-red-600">로그인이 필요합니다.</div>
      </div>
    );
  }

  if (isLoading) {
    return (
      <div className="p-4">
        <PageHeader title="내 글 목록" />
        <div className="mt-4">
          <div className="text-gray-600">로딩 중...</div>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="p-4">
        <PageHeader title="내 글 목록" />
        <div className="mt-4 text-red-600">
          내 글 목록을 불러오는데 실패했습니다.
        </div>
      </div>
    );
  }

  return (
    <>
      <PageHeader title="내 글 목록" />
      <div className="mt-4">
        {!myPosts || myPosts.length === 0 ? (
          <div className="text-gray-600">아직 작성한 글이 없습니다.</div>
        ) : (
          <div className="space-y-4">
            {myPosts.map((post) => (
              <div
                key={post.postId}
                className="border border-gray-200 rounded-lg p-4"
              >
                <div className="flex justify-between items-start mb-2">
                  <h3 className="font-semibold text-lg text-black">
                    {post.title || "제목 없음"}
                  </h3>
                  <p className="text-sm text-gray-600">
                    {post.createdAt
                      ? new Date(post.createdAt).toLocaleDateString()
                      : "날짜 없음"}
                  </p>
                </div>
                <p className="text-gray-600 mb-3 line-clamp-2">
                  {post.content || "내용 없음"}
                </p>
                <div className="flex justify-between items-center">
                  <Link
                    href={`/team/${post.postId}`}
                    className="text-main hover:font-semibold text-sm font-medium"
                  >
                    자세히 보기 →
                  </Link>
                  <DeleteButton
                    postId={post.postId}
                    accessToken={accessToken}
                    onDelete={handleDelete}
                  />
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </>
  );
};

export default MyTeam;
