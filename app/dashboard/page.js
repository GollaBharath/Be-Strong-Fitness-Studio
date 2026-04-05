import { redirect } from "next/navigation";
import { requireAuth } from "../../lib/auth/server";

export default async function DashboardRedirectPage() {
	const session = await requireAuth();

	if (session.role === "staff") {
		redirect("/dashboard/staff");
	}

	redirect("/dashboard/user");
}
