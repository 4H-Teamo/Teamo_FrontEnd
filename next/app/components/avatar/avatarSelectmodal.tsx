import React, { useState, useEffect } from "react";
import axios from "axios";

interface AvatarSelectModalProps {
	isOpen: boolean;
	onClose: () => void;
	onSelect: (imageUrl: string) => void;
	currentImageUrl?: string;
}

interface ImageItem {
	id: string;
	url: string;
}

const AvatarSelectModal: React.FC<AvatarSelectModalProps> = ({
	                                                           isOpen,
	                                                           onClose,
	                                                           onSelect,
	                                                           currentImageUrl,
                                                           }) => {
	const [images, setImages] = useState<ImageItem[]>([]);
	const [loading, setLoading] = useState(false);
	const [selectedImage, setSelectedImage] = useState<string>("");
	//
	// useEffect(() => {
	// 	if (isOpen) {
	// 		fetchImages();
	// 		setSelectedImage(currentImageUrl || "");
	// 	}
	// }, [isOpen, currentImageUrl]);
	//
	// const fetchImages = async () => {
	// 	setLoading(true);
	// 	try {
	// 		console.log("이미지 목록을 가져오는 중...");
	// 		const accessToken = localStorage.getItem("accessToken");
	// 		const response = await axios.get(
	// 			`${import.meta.env.VITE_BACKEND_URL}/images`,
	// 			{
	// 				headers: {
	// 					Authorization: `Bearer ${accessToken}`,
	// 				},
	// 			}
	// 		);
	// 		console.log("이미지 응답:", response.data);
	// 		setImages(response.data);
	// 	} catch (error) {
	// 		console.error("이미지 목록을 가져오는데 실패했습니다:", error);
	// 		// 임시로 더미 데이터 사용
	// 		setImages([
	// 			{
	// 				id: "1",
	// 				url: "https://teamo-bucket.s3.ap-northeast-2.amazonaws.com/images/profileImages/lolipop.png",
	// 			},
	// 			{
	// 				id: "2",
	// 				url: "https://teamo-bucket.s3.ap-northeast-2.amazonaws.com/images/profileImages/mad.png",
	// 			},
	// 			{
	// 				id: "3",
	// 				url: "https://teamo-bucket.s3.ap-northeast-2.amazonaws.com/images/profileImages/magic.png",
	// 			},
	// 			{
	// 				id: "4",
	// 				url: "https://teamo-bucket.s3.ap-northeast-2.amazonaws.com/images/profileImages/mith.png",
	// 			},
	// 			{
	// 				id: "5",
	// 				url: "https://teamo-bucket.s3.ap-northeast-2.amazonaws.com/images/profileImages/music.png",
	// 			},
	// 			{
	// 				id: "6",
	// 				url: "https://teamo-bucket.s3.ap-northeast-2.amazonaws.com/images/profileImages/nature.png",
	// 			},
	// 		]);
	// 	} finally {
	// 		setLoading(false);
	// 	}
	// };

	const handleImageSelect = (imageUrl: string) => {
		setSelectedImage(imageUrl);
	};

	const handleConfirm = () => {
		if (selectedImage) {
			onSelect(selectedImage);
			onClose();
		}
	};

	if (!isOpen) return null;

	return (
		<div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
			<div className="bg-white rounded-lg p-6 w-[600px] max-h-[80vh] overflow-y-auto">
				<div className="flex justify-between items-center mb-4">
					<h2 className="text-xl font-bold">프로필 이미지 선택</h2>
					<button
						onClick={onClose}
						className="text-gray-500 hover:text-gray-700 text-2xl"
					>
						×
					</button>
				</div>

				{loading ? (
					<div className="text-center py-8">
						<div className="animate-spin rounded-full h-8 w-8 border-b-2 border-purple-600 mx-auto"></div>
						<p className="mt-2 text-gray-600">이미지를 불러오는 중...</p>
					</div>
				) : (
					<>
						<div className="grid grid-cols-4 gap-3 mb-4">
							{images.map((image) => (
								<div
									key={image.id}
									className={`relative cursor-pointer border-2 rounded-lg overflow-hidden ${
										selectedImage === image.url
											? "border-purple-500"
											: "border-gray-200 hover:border-purple-300"
									}`}
									onClick={() => handleImageSelect(image.url)}
								>
									<img
										src={image.url}
										alt="프로필 이미지"
										className="w-full h-24 object-cover"
									/>
									{selectedImage === image.url && (
										<div className="absolute inset-0 bg-purple-500 bg-opacity-20 flex items-center justify-center">
											<div className="bg-white rounded-full p-1">
												<svg
													className="w-4 h-4 text-purple-600"
													fill="currentColor"
													viewBox="0 0 20 20"
												>
													<path
														fillRule="evenodd"
														d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z"
														clipRule="evenodd"
													/>
												</svg>
											</div>
										</div>
									)}
								</div>
							))}
						</div>

						<div className="flex justify-end gap-2">
							<button
								onClick={onClose}
								className="px-4 py-2 text-gray-600 border border-gray-300 rounded hover:bg-gray-50"
							>
								취소
							</button>
							<button
								onClick={handleConfirm}
								className={`px-4 py-2 rounded font-medium ${
									selectedImage
										? "!bg-main !text-white hover:!bg-purple10"
										: "!bg-gray-300 !text-gray-500 cursor-not-allowed"
								}`}
								style={{
									color: selectedImage ? "#ffffff" : "#6b7280",
									backgroundColor: selectedImage ? "#5932EA" : "#d1d5db",
								}}
							>
								선택
							</button>
						</div>
					</>
				)}
			</div>
		</div>
	);
};

export default AvatarSelectModal;