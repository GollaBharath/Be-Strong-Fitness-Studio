import Link from "next/link";
import LogoutButton from "../components/auth/logout-button";
import { requireAuth } from "../../lib/auth/server";

export default async function DashboardLayout({ children }) {
	const session = await requireAuth();

	return (
		<main className="dashboard-page">
			<header className="dashboard-header">
				<div className="container dashboard-header-inner">
					<div>
						<p className="hall-kicker">Dashboard</p>
						<h1>
							{session.role === "staff" ? "Staff Console" : "Member Panel"}
						</h1>
						<p>{session.email ?? "Authenticated"}</p>
					</div>
					<div className="hall-actions">
						<Link href="/" className="btn secondary">
							Home
						</Link>
						<LogoutButton />
					</div>
				</div>
			</header>

			<section className="section dashboard-body">
				<div className="container">{children}</div>
			</section>
		</main>
	);
}
