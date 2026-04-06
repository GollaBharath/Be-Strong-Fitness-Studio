import { requireAuth } from "../../../../lib/auth/server";
import { USER_ROLES } from "../../../../lib/constants/auth";
import UserManagementTable from "../../../components/staff/user-management-table";
import { getStaffUsers } from "../staff-data";

export default async function StaffUsersPage() {
	const session = await requireAuth({ role: USER_ROLES.STAFF });
	const users = await getStaffUsers();

	return (
		<div className="dashboard-card">
			<h2>User Management</h2>
			<p>Manage user access and account-level actions.</p>
			<UserManagementTable initialUsers={users} currentUid={session.uid} />
		</div>
	);
}
