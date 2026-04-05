import { NextResponse } from "next/server";
import { cookies } from "next/headers";
import { adminAuth } from "../../../../lib/firebase/admin";
import { SESSION_COOKIE_NAME } from "../../../../lib/constants/auth";

export async function POST() {
	const sessionCookie = cookies().get(SESSION_COOKIE_NAME)?.value;

	if (sessionCookie) {
		try {
			const decoded = await adminAuth.verifySessionCookie(sessionCookie, true);
			await adminAuth.revokeRefreshTokens(decoded.uid);
		} catch {
			// Swallow auth verification failures and still clear cookie.
		}
	}

	const response = NextResponse.json({ ok: true });
	response.cookies.set({
		name: SESSION_COOKIE_NAME,
		value: "",
		httpOnly: true,
		secure: process.env.NODE_ENV === "production",
		sameSite: "strict",
		path: "/",
		maxAge: 0,
	});

	return response;
}
