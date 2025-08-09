// import {useUserStore} from "../store/userStore.ts";
// import {useEffect} from "react";
// import {useModalStore} from "../store/modalStore.ts";
// import {useNavigate} from "react-router-dom";
// import {useSetUserTemp} from "../store/userTempStore.ts";
// export default function useKakaoLogin() {
// 	const setUser = useUserStore((s) => s.setUser);
// 	const setUserTemp = useSetUserTemp();
// 	const nav=useNavigate();
// 	const logout = useUserStore((s) => s.clearUser);
// 	const { closeModal } = useModalStore();
// 	function login(platform: string) {
// 		const loginUrl = `${import.meta.env.VITE_BACKEND_URL}/auth/${platform}`;
// 		const popup = window.open(
// 			loginUrl,
// 			"Teamo 로그인",
// 			'width=500,height=600,menubar=no,toolbar=no,location=no,status=no'
// 		)
// 		if (!popup) {
// 			alert("팝업 차단을 확인해주세요.")
// 			return
// 		}
// 	}
// 	useEffect(() => {
// 		function handleMessage(e: MessageEvent) {
// 			if (e.origin !== import.meta.env.VITE_BACKEND_URL) {
// 				console.warn("origin 다름", e.origin);
// 			}
// 			const receivedData = e.data;
// 			console.log("받은 데이터", receivedData);
// 			const { user, tokens, status } = receivedData;
// 			if (status === "NEW") {
// 				nav("/mypage");
// 				return;
// 			} else if (status === "EXISTING") {
// 				console.log("기존유저");
// 			}
// 			const userData = {
// 				id: user.id,
// 				nickname: user.nickname,
// 				github: user.github,
// 				profileImage: user.profileImage,
// 				location: user.location,
// 				isJoined: user.isJoined,
// 				isPublic: user.isPublic,
// 				positionId: user.positionId,
// 				description: user.description,
// 				proceedType: user.proceedType,
// 				createdAt: user.createdAt,
// 				updatedAt: user.updatedAt,
// 				beginner: user.beginner,
// 				userStacks: user.userStacks,
// 			};
// 			console.log("userData", userData);
// 			localStorage.setItem("accessToken", tokens.accessToken);
// 			localStorage.setItem("refreshToken", tokens.refreshToken);
// 			setUser(userData);
// 			setUserTemp(userData);
// 			closeModal();
// 		}
//
// 		window.addEventListener("message", handleMessage);
// 		return () => window.removeEventListener("message", handleMessage);
// 	}, [setUser])
//
// 	return {
// 		login,
// 		logout,
// 	}
// }
import { useRouter } from "next/navigation";

const useKakaoLogin = () => {
  const router = useRouter();
  const handleKaKoaClick = () => {
    router.push("/login");
  };
  return { handleKaKoaClick };
};
export default useKakaoLogin;
