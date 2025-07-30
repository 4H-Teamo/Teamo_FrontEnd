import React from "react";
import clsx from "clsx";
import Image from "next/image";
import information from "@/app/assets/information.svg";

interface PublicToggleProps {
	isPublic: boolean;
	onToggle: () => void;
}

const PublicToggle = ({ isPublic, onToggle }: PublicToggleProps) => {
	return (
		<div className="flex gap-2 justify-start items-center text-black font-medium text-base">
			<Image src={information} alt="공개여부" />
			프로필을 공개하면 팀원 제안을 받을 수 있어요.
			<div className="flex flex-row items-center">
				<div
					onClick={onToggle}
					className={clsx(
						"relative w-[34px] h-[18px] rounded-full p-[2px] transition-all cursor-pointer",
						isPublic ? "bg-main" : "bg-gray-300"
					)}
				>
					<div
						className={clsx(
							"w-[14px] h-[14px] rounded-full bg-white transition-all",
							isPublic ? "translate-x-[20px]" : "translate-x-0"
						)}
					/>
				</div>
			</div>
		</div>
	);
};

export default PublicToggle;