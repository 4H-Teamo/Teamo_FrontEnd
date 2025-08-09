"use client";
import PageHeader from "@/app/components/pageHeader/header";
import Card from "@/app/components/card/cardFeed";
import { useRouter } from "next/navigation";
import { URL } from "@/app/constants/url";

const Team = () => {
	const router = useRouter();
	const handleClick = () => router.push(URL.CREATE_NEW_TEAM);

	return (
		<div>
			<PageHeader title="팀 찾기" button={true} onClick={handleClick} buttonText="글작성하기"/>
			<Card type={"team"} />
		</div>
	);
};

export default Team;