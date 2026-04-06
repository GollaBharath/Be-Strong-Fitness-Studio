import { redirect } from "next/navigation";
import LoginForm from "../components/auth/login-form";
import { getSessionContext } from "../../lib/auth/server";

export const metadata = {
	title: "Login | BE STRONG FITNESS STUDIO",
	description: "Login or register to access your BE STRONG account.",
};

export default async function LoginPage() {
	const session = await getSessionContext();
	if (session) {
		redirect(session.role === "staff" ? "/dashboard/staff" : "/dashboard/user");
	}

	return (
		<main className="auth-page">
			<div className="container auth-shell">
				<div className="auth-copy">
					<p className="hall-kicker">Member Access</p>
					<h1>Secure Login</h1>
					<p>
						Sign in to view your member dashboard. Staff accounts unlock user
						management.
					</p>
				</div>
				<LoginForm />
			</div>
		</main>
	);
}
