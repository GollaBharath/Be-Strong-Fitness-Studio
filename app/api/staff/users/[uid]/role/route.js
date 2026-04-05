import { NextResponse } from "next/server";
import { getSessionContext } from "@/lib/auth/server";
import { ALLOWED_ROLES, USER_ROLES } from "@/lib/constants/auth";
import { adminAuth } from "@/lib/firebase/admin";

export async function PATCH(request, { params }) {
	try {
		const staff = await getSessionContext();
		if (!staff) {
			return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
		}

		if (staff.role !== USER_ROLES.STAFF) {
			return NextResponse.json({ error: "Forbidden" }, { status: 403 });
		}

		const { uid } = params;
		const body = await request.json();
		const role = body?.role;

		if (!uid || typeof uid !== "string") {
			return NextResponse.json({ error: "Invalid user id." }, { status: 400 });
		}

		if (!ALLOWED_ROLES.has(role)) {
			return NextResponse.json({ error: "Invalid role." }, { status: 400 });
		}

		const userRecord = await adminAuth.getUser(uid);
		const currentClaims = userRecord.customClaims ?? {};

		await adminAuth.setCustomUserClaims(uid, {
			...currentClaims,
			role,
		});

		return NextResponse.json({ ok: true });
	} catch {
		return NextResponse.json(
			{ error: "Unable to update role." },
			{ status: 500 },
		);
	}
}
