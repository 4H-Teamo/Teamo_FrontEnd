import { useRouter } from "next/router";
import { useEffect } from "react";
import { useUserStore } from "@/app/store/userStore";

export default function KakaoCallback() {
	const router = useRouter();
	const setUser = useUserStore((s) => s.setUser);

	useEffect(() => {
		const code = router.query.code as string;
		if (!code) return;

		(async () => {
			const res = await fetch(`http://devcms.ddns.net:81/api/auth/kakao?code=${code}`, {
				method: "GET",
			});
			const data = await res.json();

			setUser(data.user);
			localStorage.setItem("accessToken", data.token.accessToken);
			localStorage.setItem("refreshToken", data.token.refreshToken);

			router.push("/");
		})();
	}, [router.query.code]);

	return <div>로그인 처리중...</div>;
}