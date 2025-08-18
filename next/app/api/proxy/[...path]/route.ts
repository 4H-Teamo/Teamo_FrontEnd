import { NextRequest, NextResponse } from "next/server";

const BACKEND_URL = process.env.NEXT_PUBLIC_BACKEND_URL!; // 기존 환경변수 사용
const ACCESS_COOKIE_NAME = "accessToken"; // 기존 쿠키명과 일치
const NEW_TOKEN_HEADER = "x-new-access-token"; // 백엔드가 새 토큰을 넣어주는 헤더 이름

function cookieOptions() {
  const isProd = process.env.NODE_ENV === "development";
  return {
    httpOnly: false, // accessToken은 JS에서 읽을 수 있게
    sameSite: "lax" as const,
    secure: isProd,
    path: "/",
    maxAge: 1000 * 60 * 60 * 24,
  };
}

async function proxy(req: NextRequest) {
  const { pathname, search } = new URL(req.url);
  const targetPath = pathname.replace(/^\/api\/proxy/, "");
  const targetUrl = `${BACKEND_URL}${targetPath}${search ?? ""}`;

  // 쿠키에서 액세스 토큰 읽어 Authorization 헤더로 전달
  const accessToken = req.cookies.get(ACCESS_COOKIE_NAME)?.value;
  const headers = new Headers(req.headers);

  // 원본 요청의 쿠키/호스트 등은 백엔드에 넘길 필요 X
  headers.delete("cookie");
  headers.set("authorization", accessToken ? `Bearer ${accessToken}` : "");

  // 토큰 전송 상태 로깅
  console.log("=== 프록시 토큰 전송 상태 ===");
  console.log("요청 URL:", targetUrl);
  console.log("쿠키에서 토큰 읽음:", !!accessToken);
  console.log("토큰 길이:", accessToken?.length || 0);
  console.log(
    "Authorization 헤더:",
    accessToken ? `Bearer ${accessToken.substring(0, 20)}...` : "없음"
  );
  console.log("==============================");

  // 바디/메서드/헤더 그대로 전달
  const init: RequestInit = {
    method: req.method,
    headers,
    // GET/HEAD는 body 사용 불가
    body: ["GET", "HEAD"].includes(req.method)
      ? undefined
      : await req.arrayBuffer(),
    redirect: "manual",
  };

  const backendRes = await fetch(targetUrl, init);

  // 백엔드 응답 헤더 로깅
  console.log("백엔드 응답 상태:", backendRes.status, backendRes.statusText);
  console.log("백엔드 응답 헤더들:");
  backendRes.headers.forEach((value, key) => {
    console.log(`  ${key}: ${value}`);
  });

  // 401 에러 시 응답 본문도 로깅
  if (backendRes.status === 401) {
    try {
      const errorBody = await backendRes.text();
      console.log("=== 401 에러 응답 본문 ===");
      console.log(errorBody);
      console.log("==========================");
      
      // 응답을 다시 생성 (text()로 읽었으므로)
      const newBackendRes = await fetch(targetUrl, init);
      return new NextResponse(newBackendRes.body, {
        status: newBackendRes.status,
        statusText: newBackendRes.statusText,
        headers: newBackendRes.headers,
      });
    } catch (error) {
      console.error("401 에러 응답 본문 읽기 실패:", error);
    }
  }

  // 400 에러 시 응답 본문도 로깅
  if (backendRes.status === 400) {
    try {
      const errorBody = await backendRes.text();
      console.log("=== 400 에러 응답 본문 ===");
      console.log(errorBody);
      console.log("==========================");
      
      // 응답을 다시 생성 (text()로 읽었으므로)
      const newBackendRes = await fetch(targetUrl, init);
      return new NextResponse(newBackendRes.body, {
        status: newBackendRes.status,
        statusText: newBackendRes.statusText,
        headers: newBackendRes.headers,
      });
    } catch (error) {
      console.error("400 에러 응답 본문 읽기 실패:", error);
    }
  }

  // 백엔드가 새 액세스를 응답 헤더로 내려줬다면, 여기서 쿠키로 덮어쓰기
  const newAccess = backendRes.headers.get(NEW_TOKEN_HEADER);
  console.log("x-new-access-token 헤더:", newAccess);

  // 백엔드 응답을 그대로 전달 (스트림 유지)
  const res = new NextResponse(backendRes.body, {
    status: backendRes.status,
    statusText: backendRes.statusText,
  });

  // 백엔드의 중요한 헤더들만 일부 전달
  backendRes.headers.forEach((v, k) => {
    // 민감한 헤더 필터링
    if (!["set-cookie"].includes(k.toLowerCase())) {
      res.headers.set(k, v);
    }
  });

  if (newAccess) {
    res.cookies.set(ACCESS_COOKIE_NAME, newAccess, cookieOptions());
  }

  return res;
}

export const GET = proxy;
export const POST = proxy;
export const PUT = proxy;
export const PATCH = proxy;
export const DELETE = proxy;
