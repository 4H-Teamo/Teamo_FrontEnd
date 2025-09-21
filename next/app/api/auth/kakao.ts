export const kakaoAuth = async (code: string) => {
    const apiUrl = `/api/proxy/auth/kakao?code=${code}`;
    const res = await fetch(apiUrl,{
        method:"GET",
        credentials: "include",
        headers:{
            "Content-Type":"application/json",
        },
    })
    const data = await res.json()
    return data
}