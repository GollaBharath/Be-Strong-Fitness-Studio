import { requireAuth } from "../../../../lib/auth/server";
import { USER_ROLES } from "../../../../lib/constants/auth";
import {
	ALLOWED_MEMBERSHIP_STATUS,
	MEMBERSHIP_PLANS,
} from "../../../../lib/constants/memberships";
import MembershipManagementTable from "../../../components/staff/membership-management-table";
import { getStaffUsers } from "../staff-data";

export default async function StaffMembershipsPage() {
	await requireAuth({ role: USER_ROLES.STAFF });
	const users = await getStaffUsers({ includeMembership: true });

	return (
		<div className="dashboard-card">
			<h2>Member Management</h2>
			<p>Assign plans, update status, and manage memberships.</p>
			<MembershipManagementTable
				initialUsers={users}
				plans={MEMBERSHIP_PLANS}
				allowedStatus={Array.from(ALLOWED_MEMBERSHIP_STATUS)}
			/>
		</div>
	);
}
