import { cookies } from "next/headers";
import { redirect } from "next/navigation";
import { SESSION_COOKIE_NAME, USER_ROLES } from "../constants/auth";
import { adminAuth } from "../firebase/admin";

function getAllowlist() {
	return new Set(
		String(process.env.STAFF_EMAIL_ALLOWLIST ?? "")
			.split(",")
			.map((email) => email.trim().toLowerCase())
			.filter(Boolean),
	);
}

async function getUserRole(uid, email) {
	const allowlist = getAllowlist();
	const userRecord = await adminAuth.getUser(uid);
	const customRole = userRecord.customClaims?.role;

	if (customRole === USER_ROLES.STAFF) {
		return USER_ROLES.STAFF;
	}

	if (allowlist.has(String(email ?? userRecord.email ?? "").toLowerCase())) {
		return USER_ROLES.STAFF;
	}

	return USER_ROLES.USER;
}

export async function getSessionContext() {
	const sessionCookie = cookies().get(SESSION_COOKIE_NAME)?.value;
	if (!sessionCookie) {
		return null;
	}

	try {
		const decoded = await adminAuth.verifySessionCookie(sessionCookie, true);
		const role = await getUserRole(decoded.uid, decoded.email);

		return {
			uid: decoded.uid,
			email: decoded.email ?? null,
			displayName: decoded.name ?? null,
			role,
		};
	} catch {
		return null;
	}
}

export async function requireAuth({ role, redirectTo = "/login" } = {}) {
	const context = await getSessionContext();
	if (!context) {
		redirect(redirectTo);
	}

	if (role && context.role !== role) {
		redirect(
			context.role === USER_ROLES.STAFF
				? "/dashboard/staff"
				: "/dashboard/user",
		);
	}

	return context;
}

export async function requireStaff() {
	return requireAuth({ role: USER_ROLES.STAFF });
}

export { getUserRole };
