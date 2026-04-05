import { requireAuth } from "../../../lib/auth/server";
import { USER_ROLES } from "../../../lib/constants/auth";
import { adminAuth } from "../../../lib/firebase/admin";
import UserManagementTable from "../../components/staff/user-management-table";

export default async function StaffDashboardPage() {
	const session = await requireAuth({ role: USER_ROLES.STAFF });
	const usersResult = await adminAuth.listUsers(1000);
	const users = usersResult.users.map((userRecord) => {
		return {
			uid: userRecord.uid,
			email: userRecord.email ?? null,
			displayName: userRecord.displayName ?? null,
			role:
				userRecord.customClaims?.role === USER_ROLES.STAFF ? "staff" : "user",
		};
	});

	return (
		<div className="dashboard-card">
			<h2>Staff User Management</h2>
			<p>Manage user roles securely. Role changes are processed server-side.</p>
			<UserManagementTable initialUsers={users} currentUid={session.uid} />
		</div>
	);
}
