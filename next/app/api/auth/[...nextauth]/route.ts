import NextAuth from "next-auth/next";
import KakaoProvider from "next-auth/providers/kakao";

const handler = NextAuth({
  pages: {
    signIn: "/login",
  },
  providers: [
    KakaoProvider({
      clientId: process.env.KAKAO_RESTAPI_KEY as string,
      clientSecret: process.env.KAKAO_CLIENT_SECRET as string,
    }),
  ],
  callbacks: {
    async jwt({ token, account }: any) {
      // 카카오 로그인 시 토큰에 추가 정보 저장
      if (account?.provider === "kakao") {
        token.accessToken = account.access_token;
        token.refreshToken = account.refresh_token;
      }
      return token;
    },
    async session({ session, token }: any) {
      // 세션에 토큰 정보 추가
      session.accessToken = token.accessToken;
      return session;
    },
  },
});

export { handler as GET, handler as POST };
