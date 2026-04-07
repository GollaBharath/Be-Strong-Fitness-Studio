import { requireAuth } from "../../lib/auth/server";

export default async function DashboardLayout({ children }) {
	await requireAuth();
	return children;
}
