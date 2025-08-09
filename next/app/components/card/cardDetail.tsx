import CardField from "@/app/components/card/cardField";
import {BoardType, Post, User} from "@/app/model/type";
interface CardLayoutProps {
	type: BoardType;
	data: Post | User;

}

const CardDetail = ({type,data}:CardLayoutProps) => {
	return (
		<div className="space-y-2">
			<CardField board={type} data={data}  />
		</div>
	);
};
export default CardDetail;