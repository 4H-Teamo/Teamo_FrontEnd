// import {useState} from "react";
// import {useRouter}from "next/navigation"
// import type {Post} from "../../model/type";
// import usePosts from "@/app/hooks/usePosts";

// export const useSearch=() =>{
// 	const [search, setSearch] = useState("");
// 	const [tab, setTab] = useState<"팀 찾기" | "팀원 찾기">("팀 찾기");
// 	// const router =useRouter();
//
// 	const keyword = search.toLowerCase();
// 	// const { data: posts = [], isLoading, isError } = usePosts();
	// const filteredPosts: Post[] = posts.filter((post) => {
	// 	return (
	// 		post.title.toLowerCase().includes(keyword) ||
	// 		post.content.toLowerCase().includes(keyword)
// 		);
// 	});
// 	return {
// 		keyword,
// 		search,
// 		setSearch,
// 		tab,
// 		setTab,
// 		isLoading,
// 		isError,
// 		filteredPosts,
// 		router
// 	}
// }