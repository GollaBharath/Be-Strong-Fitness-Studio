import { NextResponse } from "next/server";
import { SESSION_COOKIE_NAME } from "./lib/constants/auth";

export function middleware(request) {
	const { pathname, search } = request.nextUrl;
	const hasSession = Boolean(request.cookies.get(SESSION_COOKIE_NAME)?.value);

	if (pathname.startsWith("/dashboard") && !hasSession) {
		const loginUrl = new URL("/login", request.url);
		loginUrl.searchParams.set("next", `${pathname}${search}`);
		return NextResponse.redirect(loginUrl);
	}

	if (pathname === "/login" && hasSession) {
		return NextResponse.redirect(new URL("/dashboard", request.url));
	}

	return NextResponse.next();
}

export const config = {
	matcher: ["/dashboard/:path*", "/login"],
};
