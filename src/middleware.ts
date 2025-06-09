import { NextRequest, NextResponse } from "next/server";

export function middleware(request: NextRequest) {
  const sessionToken = request.cookies.get("session")?.value;

  const isAuthPage =
    request.nextUrl.pathname === "/auth/login" ||
    request.nextUrl.pathname === "/auth/register" ||
    request.nextUrl.pathname === "/auth/forgot" ||
    request.nextUrl.pathname === "/auth/verify";
  const isPublicPage = isAuthPage;

  if (!sessionToken && !isPublicPage) {
    return NextResponse.redirect(new URL("/auth/login", request.url));
  }

  if (sessionToken && isAuthPage) {
    return NextResponse.redirect(new URL("/", request.url));
  }
  return NextResponse.next();
}

export const config = {
  matcher: ["/((?!api|_next/static|_next/image|favicon.ico).*)"],
};
