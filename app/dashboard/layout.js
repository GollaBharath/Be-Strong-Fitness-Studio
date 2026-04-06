import { requireAuth } from "../../lib/auth/server";

export default async function DashboardLayout({ children }) {
	await requireAuth();

	return (
		<main className="dashboard-page">
			<section className="section dashboard-body">
				<div className="container">{children}</div>
			</section>
		</main>
	);
}
