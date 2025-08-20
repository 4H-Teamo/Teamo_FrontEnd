// "use client";
// import { useParams } from "next/navigation";
// import PageHeader from "@/app/components/pageHeader/header";
// import CardDetail from "@/app/components/card/cardDetail";

// const TeamDetailPage = () => {
//   const params = useParams();
//   const postId = params.postId as string;

//   // TODO: useTeamDetail 훅을 만들어서 팀 모집글 정보를 가져오기
//   const isLoading = false;
//   const error = null;
//   const post = null; // 실제로는 API에서 가져온 데이터

//   if (isLoading) {
//     return (
//       <div>
//         <PageHeader title="팀 모집 상세 정보" />
//         <div className="flex justify-center items-center h-64">
//           <div className="text-gray-500">로딩 중...</div>
//         </div>
//       </div>
//     );
//   }

//   if (error) {
//     return (
//       <div>
//         <PageHeader title="팀 모집 상세 정보" />
//         <div className="flex justify-center items-center h-64">
//           <div className="text-red-500">
//             팀 모집글을 불러오는데 실패했습니다.
//           </div>
//         </div>
//       </div>
//     );
//   }

//   if (!post) {
//     return (
//       <div>
//         <PageHeader title="팀 모집 상세 정보" />
//         <div className="flex justify-center items-center h-64">
//           <div className="text-gray-500">팀 모집글을 찾을 수 없습니다.</div>
//         </div>
//       </div>
//     );
//   }

//   return (
//     <div className="max-w-4xl mx-auto p-6">
//       <PageHeader title="팀 모집 상세 정보" />

//       <div className="bg-white rounded-lg shadow-md p-6 mt-6">
//         <CardDetail type="team" data={post} />
//       </div>
//     </div>
//   );
// };

// export default TeamDetailPage;
