import { NextResponse } from "next/server";
import { adminAuth } from "../../../../lib/firebase/admin";
import {
	SESSION_COOKIE_NAME,
	SESSION_DURATION_MS,
	USER_ROLES,
} from "../../../../lib/constants/auth";

export async function POST(request) {
	try {
		const { idToken } = await request.json();
		const staffAllowlist = new Set(
			String(process.env.STAFF_EMAIL_ALLOWLIST ?? "")
				.split(",")
				.map((email) => email.trim().toLowerCase())
				.filter(Boolean),
		);

		if (!idToken || typeof idToken !== "string") {
			return NextResponse.json(
				{ error: "Invalid credentials." },
				{ status: 400 },
			);
		}

		const decoded = await adminAuth.verifyIdToken(idToken, true);
		const userRecord = await adminAuth.getUser(decoded.uid);
		const currentClaims = userRecord.customClaims ?? {};

		const normalizedEmail = String(decoded.email ?? "")
			.trim()
			.toLowerCase();
		let role =
			currentClaims.role === USER_ROLES.STAFF
				? USER_ROLES.STAFF
				: USER_ROLES.USER;
		if (staffAllowlist.has(normalizedEmail)) {
			role = USER_ROLES.STAFF;
		}

		if (currentClaims.role !== role) {
			await adminAuth.setCustomUserClaims(decoded.uid, {
				...currentClaims,
				role,
			});
		}

		const sessionCookie = await adminAuth.createSessionCookie(idToken, {
			expiresIn: SESSION_DURATION_MS,
		});

		const response = NextResponse.json({ ok: true, role });
		response.cookies.set({
			name: SESSION_COOKIE_NAME,
			value: sessionCookie,
			httpOnly: true,
			secure: process.env.NODE_ENV === "production",
			sameSite: "strict",
			path: "/",
			maxAge: Math.floor(SESSION_DURATION_MS / 1000),
		});

		return response;
	} catch (error) {
		const code = String(error?.code ?? "");
		const message = String(error?.message ?? "Unable to start session.");
		const status =
			code.includes("auth/") || message.includes("verifyIdToken") ? 401 : 500;

		return NextResponse.json(
			{
				error: "Unable to start session.",
				code,
				message,
			},
			{ status },
		);
	}
}
