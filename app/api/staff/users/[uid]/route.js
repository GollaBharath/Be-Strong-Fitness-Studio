import { NextResponse } from "next/server";
import { getSessionContext } from "@/lib/auth/server";
import { USER_ROLES } from "@/lib/constants/auth";
import { adminAuth, adminDb } from "@/lib/firebase/admin";

export async function DELETE(_request, { params }) {
	try {
		const staff = await getSessionContext();
		if (!staff) {
			return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
		}

		if (staff.role !== USER_ROLES.STAFF) {
			return NextResponse.json({ error: "Forbidden" }, { status: 403 });
		}

		const { uid } = params;
		if (!uid || typeof uid !== "string") {
			return NextResponse.json({ error: "Invalid user id." }, { status: 400 });
		}

		if (uid === staff.uid) {
			return NextResponse.json(
				{ error: "You cannot delete your own account." },
				{ status: 400 },
			);
		}

		await adminAuth.deleteUser(uid);
		await adminDb.collection("userMemberships").doc(uid).delete();

		return NextResponse.json({ ok: true });
	} catch (error) {
		if (error?.code === "auth/user-not-found") {
			return NextResponse.json({ error: "User not found." }, { status: 404 });
		}

		return NextResponse.json(
			{ error: "Unable to delete user." },
			{ status: 500 },
		);
	}
}
