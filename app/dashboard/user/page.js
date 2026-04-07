import { requireAuth } from "../../../lib/auth/server";
import { USER_ROLES } from "../../../lib/constants/auth";
import UnifiedMemberExperience from "@/app/components/user/unified-member-experience";

export default async function UserDashboardPage() {
	const session = await requireAuth({ role: USER_ROLES.USER });
	const displayName =
		session.displayName || session.email?.split("@")[0] || "Member";

	return <UnifiedMemberExperience displayName={displayName} />;
}
