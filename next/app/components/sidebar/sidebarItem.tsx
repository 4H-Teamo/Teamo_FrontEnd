
import React from "react";
import type {IconType} from "react-icons";

interface Props {
	icon: IconType;
	text: string;
	isSelected: boolean;
	onClick: () => void;
}

const SidebarItem = ({ icon:Icon, text, isSelected, onClick }: Props) => {
	return (
		<button
			className={`flex w-3/4  bg-main items-center gap-3 p-4 rounded-lg cursor-pointer overflow-hidden transition-colors ${
				isSelected
					? "bg-main text-white"
					: "bg-white text-gray hover:bg-gray-hover"
			}`}
			onClick={onClick}
		>
			<Icon/>
			<span> {text}</span>

		</button>
	);
};

export default SidebarItem;