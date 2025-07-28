"use client"
import React, { useState } from "react";
import AvatarSelectModal from "./avatarSelectmodal";
import Image from "next/image";
import defaultAvatar from "@/app/assets/defaultAvatar.png"
import refresh from "@/app/assets/refresh.svg";
interface ProfileProps {
	profileImageUrl?: string;
	onImageChange?: (imageUrl: string) => void;
}

const Profile: React.FC<ProfileProps> = ({
	                                         profileImageUrl,
	                                         onImageChange,
                                         }) => {
	const [isModalOpen, setIsModalOpen] = useState(false);

	const handleImageSelect = (imageUrl: string) => {
		if (onImageChange) {
			onImageChange(imageUrl);
		}
	};

	return (
		<>
			<div className="flex justify-center">
				<div className="relative w-52 h-52">
					<Image
						src={profileImageUrl || defaultAvatar}
						alt="profile"
						className="rounded-full w-full h-full object-cover border"
						fill
					/>
					<div
						className="absolute -bottom-1 -right-3 flex items-center cursor-pointer p-1 "
						onClick={() => setIsModalOpen(true)}
					>
						<Image src={refresh} alt="refresh" />
						<span className="text-gray20 text-sm">변경</span>
					</div>
				</div>
			</div>

			<AvatarSelectModal
				isOpen={isModalOpen}
				onClose={() => setIsModalOpen(false)}
				onSelect={handleImageSelect}
				currentImageUrl={profileImageUrl}
			/>
		</>
	);
};

export default Profile;