import { NextRequest, NextResponse } from "next/server";

// 내부 통신 주소 우선 → 환경변수 없으면 도커 서비스명 폴백
const BACKEND_URL =
  process.env.BACKEND_INTERNAL_URL ||
  process.env.NEXT_PUBLIC_BACKEND_INTERNAL_URL ||
  process.env.BACKEND_URL ||
  process.env.NEXT_PUBLIC_BACKEND_URL ||
  process.env.NEXT_PUBLIC_API_BASE_URL ||
  "http://teamo_backend:4000";
const ACCESS_COOKIE_NAME = "accessToken"; // 기존 쿠키명과 일치
const NEW_TOKEN_HEADER = "x-new-access-token"; // 백엔드가 새 토큰을 넣어주는 헤더 이름

function cookieOptions() {
  const isProd = process.env.NODE_ENV !== "development";
  return {
    httpOnly: false, // accessToken은 JS에서 읽을 수 있게
    sameSite: "lax" as const,
    secure: isProd,
    path: "/",
    maxAge: 1000 * 60 * 60 * 24,
  };
}

async function proxy(req: NextRequest) {
  try {
    const { pathname, search } = new URL(req.url);
    const targetPath = pathname.replace(/^\/api\/proxy/, "");
    const targetUrl = `${BACKEND_URL}${targetPath}${search ?? ""}`;

    console.log("프록시 BACKEND_URL:", BACKEND_URL);

    // URL 유효성 검증
    if (!targetUrl || targetUrl === BACKEND_URL) {
      throw new Error(`잘못된 대상 URL: ${targetUrl}`);
    }

    console.log("프록시 대상 URL:", targetUrl);

    // 쿠키에서 액세스 토큰 읽어 Authorization 헤더로 전달
    const accessToken = req.cookies.get(ACCESS_COOKIE_NAME)?.value;
    const headers = new Headers(req.headers);

    // 쿠키는 그대로 전달(리프레시 토큰 흐름 유지), host 만 제거
    headers.delete("host");
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
    const newAccessHeader = backendRes.headers.get(NEW_TOKEN_HEADER);
    const authorizationHeader = backendRes.headers.get("authorization");
    const bearerMatch = authorizationHeader?.match(/^Bearer\s+(.+)$/i);
    const newAccess = newAccessHeader ?? bearerMatch?.[1] ?? null;
    console.log("새 액세스 토큰 수신:", !!newAccess);

    // 백엔드 응답을 그대로 전달 (스트림 유지)
    const res = new NextResponse(backendRes.body, {
      status: backendRes.status,
      statusText: backendRes.statusText,
    });

    // 백엔드의 중요한 헤더들만 일부 전달
    backendRes.headers.forEach((v, k) => {
      // Set-Cookie 는 아래에서 다중 처리
      if (k.toLowerCase() !== "set-cookie") {
        res.headers.set(k, v);
      }
    });

    // 다중 Set-Cookie 포워딩 처리
    const getSetCookie = (backendRes.headers as any).getSetCookie?.bind(
      backendRes.headers
    );
    const setCookies: string[] = getSetCookie ? getSetCookie() : [];
    if (Array.isArray(setCookies) && setCookies.length > 0) {
      for (const cookie of setCookies) {
        res.headers.append("set-cookie", cookie);
      }
    } else {
      const single = backendRes.headers.get("set-cookie");
      if (single) res.headers.append("set-cookie", single);
    }

    if (newAccess) {
      res.cookies.set(ACCESS_COOKIE_NAME, newAccess, cookieOptions());
    }

    return res;
  } catch (error) {
    console.error("프록시 에러:", error);
    return new NextResponse(
      JSON.stringify({
        error: "프록시 요청 실패",
        message: error instanceof Error ? error.message : "알 수 없는 오류",
      }),
      {
        status: 500,
        headers: { "Content-Type": "application/json" },
      }
    );
  }
}

export const GET = proxy;
export const POST = proxy;
export const PUT = proxy;
export const PATCH = proxy;
export const DELETE = proxy;
