import {teamItem, teammateItem,BoardType, Post,User} from "@/app/model/type";

interface CardFieldProps {
	board:BoardType;
	data:User|Post
}
const CardField = ({board,data}:CardFieldProps)=>{
	const fieldLabels = board === "team" ? teamItem : teammateItem;
	return(
		<div className="space-y-2">
			{fieldLabels.map(({ key, label }) => (
				<div key={key}>
					<div>{label}</div>
					<div>{(data as any)[key]}</div>
				</div>
			))}
		</div>
	)
}
export default CardField;