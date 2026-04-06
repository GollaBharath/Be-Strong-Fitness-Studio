import { redirect } from "next/navigation";
import { requireAuth } from "../../../lib/auth/server";
import { USER_ROLES } from "../../../lib/constants/auth";

export default async function StaffDashboardPage() {
	await requireAuth({ role: USER_ROLES.STAFF });
	redirect("/dashboard/staff/users");
}
