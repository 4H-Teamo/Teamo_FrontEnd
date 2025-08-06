import { POSITION, type Positions } from "@/app/constants/forms/positions";
import clsx from "clsx";

type Props = {
	value: Positions[];
	className:string;
	onChange: (value: Positions[]) => void;
};

const Position= ({className, value, onChange }: Props) => {
	const handleToggle =(position: Positions) => {
		const selected=value.some((s)=>s.id===position.id);
		const newSelected=selected ? value.filter((s)=>s.id !== position.id) :[...value,position];
		onChange(newSelected)
	}
	return (
		<div className={clsx("w-full flex flex-row gap-4 m-4  rounded-xl md:w-6/8 lg:w-[54rem]",className)}>
			{POSITION.map((position) => {
				const isActive = value.some((s) => s.id === position.id);
				return (
					<div
						key={position.id}
						onClick={()=>handleToggle(position)}
						className={clsx(
							"badge-common",className,
							isActive ? "badge-active" : "badge-inactive"
						)}
					>
						{position.label}
					</div>
				);
			})}
		</div>
	);
};

export default Position;