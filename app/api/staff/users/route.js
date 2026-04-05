import { NextResponse } from "next/server";
import { getSessionContext } from "@/lib/auth/server";
import { USER_ROLES } from "@/lib/constants/auth";
import { adminAuth } from "@/lib/firebase/admin";

export async function GET() {
	try {
		const session = await getSessionContext();
		if (!session) {
			return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
		}

		if (session.role !== USER_ROLES.STAFF) {
			return NextResponse.json({ error: "Forbidden" }, { status: 403 });
		}

		const usersResult = await adminAuth.listUsers(1000);
		const users = usersResult.users.map((userRecord) => {
			const role =
				userRecord.customClaims?.role === USER_ROLES.STAFF
					? USER_ROLES.STAFF
					: USER_ROLES.USER;
			return {
				uid: userRecord.uid,
				email: userRecord.email ?? null,
				displayName: userRecord.displayName ?? null,
				role,
				createdAt: userRecord.metadata.creationTime ?? null,
				lastLoginAt: userRecord.metadata.lastSignInTime ?? null,
			};
		});

		return NextResponse.json({ users });
	} catch {
		return NextResponse.json(
			{ error: "Unable to load users." },
			{ status: 500 },
		);
	}
}
