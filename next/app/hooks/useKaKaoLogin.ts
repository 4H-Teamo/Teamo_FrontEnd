import {useUserStore} from "@/app/store/userStore"
import {useEffect} from "react";
import { User } from "../model/type.js";
export default function useKakaoLogin() {
	const setUser = useUserStore((s) => s.setUser);
;
	const logout = useUserStore((s) => s.clearUser);

	function login() {
		const loginUrl = 'https://kauth.kakao.com/oauth/authorize?client_id=b2c1e2300e29d7c095a4ac3f1e440cfd&redirect_uri=http://devcms.ddns.net:81/kakao/redirect&response_type=code'
		console.log("로그인 URL:", loginUrl);
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
				if (e.origin !== 'https://kauth.kakao.com/oauth/authorize?client_id=b2c1e2300e29d7c095a4ac3f1e440cfd&redirect_uri=http://devcms.ddns.net:81//kakao/redirect&response_type=code') {
					console.warn("origin 다름", e.origin);
				}
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