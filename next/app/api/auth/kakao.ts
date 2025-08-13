export const kakaoAuth = async (code: string) => {
    const apiUrl = `${process.env.NEXT_PUBLIC_BACKEND_URL}/auth/kakao?code=${code}`;
    const res = await fetch(apiUrl,{
        method:"GET",
        mode:"cors",
        headers:{
            "Content-Type":"application/json",
        },
    })
    const data = await res.json()
    return data
}