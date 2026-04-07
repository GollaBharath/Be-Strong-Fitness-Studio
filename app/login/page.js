import { redirect } from "next/navigation";
import LoginForm from "../components/auth/login-form";
import { getSessionContext } from "../../lib/auth/server";

export const metadata = {
	title: "Login | BE STRONG FITNESS STUDIO",
	description:
		"Sign in or create your account to access the BE STRONG experience.",
};

export default async function LoginPage() {
	const session = await getSessionContext();
	if (session) {
		redirect(session.role === "staff" ? "/dashboard/staff" : "/dashboard/user");
	}

	return <LoginForm />;
}
