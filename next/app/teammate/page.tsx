import PageHeader from "@/app/components/pageHeader/header";
import Card from "@/app/components/card/cardFeed";


const Team = () => {
	return (
		<div>
			<PageHeader title="팀원 찾기" />
			<Card type={"team"} />
		</div>
	);
};

export default Team;