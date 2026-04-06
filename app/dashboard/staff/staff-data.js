import { adminAuth, adminDb } from "../../../lib/firebase/admin";
import { USER_ROLES } from "../../../lib/constants/auth";

export async function getStaffUsers({ includeMembership = false } = {}) {
	const usersResult = await adminAuth.listUsers(1000);

	let membershipsByUid = null;
	if (includeMembership) {
		const membershipsSnapshot = await adminDb
			.collection("userMemberships")
			.get();
		membershipsByUid = new Map();
		membershipsSnapshot.forEach((doc) => {
			membershipsByUid.set(doc.id, doc.data());
		});
	}

	return usersResult.users.map((userRecord) => ({
		uid: userRecord.uid,
		email: userRecord.email ?? null,
		displayName: userRecord.displayName ?? null,
		role:
			userRecord.customClaims?.role === USER_ROLES.STAFF
				? USER_ROLES.STAFF
				: USER_ROLES.USER,
		membership: membershipsByUid?.get(userRecord.uid) ?? null,
	}));
}
