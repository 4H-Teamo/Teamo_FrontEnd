import {useUserStore} from "@/app/store/userStore"
import {useEffect} from "react";
import { User } from "../model/type.js";
export default function useKakaoLogin() {
	const setUser = useUserStore((s) => s.setUser);
;
	const logout = useUserStore((s) => s.clearUser);

	function login() {
		const loginUrl = `${process.env.BACKEND_URL}/auth/kakao`;
		const popup = window.open(
			loginUrl,
			"Teamo 로그인",
			'width=500,height=600,menubar=no,toolbar=no,location=no,status=no'
		)
		if (!popup) {
			alert("팝업 차단을 확인해주세요.")
			return
		}
	}
	useEffect(() => {
		function handleMessage(e: MessageEvent) {
			const receivedData = e.data;
			console.log("받은 데이터", receivedData);
			const { user, tokens } = receivedData;

			const userData = user as User;
			console.log("userData", userData);
			localStorage.setItem("accessToken", tokens.accessToken);
			localStorage.setItem("refreshToken", tokens.refreshToken);
			setUser(userData);


		}

		window.addEventListener("message", handleMessage);
		return () => window.removeEventListener("message", handleMessage);
	}, [setUser])

	return {
		login,
		logout,
	}
}