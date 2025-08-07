import { useRouter } from "next/navigation";
import { MouseEvent } from "react";

const useBackdrop = () => {
	const router = useRouter();

	const handleBackdropClick = (e: MouseEvent) => {
		if (e.target === e.currentTarget) {
			router.back();
		}
	};

	return { handleBackdropClick };
};

export default useBackdrop;