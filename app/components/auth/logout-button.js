"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";

export default function LogoutButton() {
	const router = useRouter();
	const [busy, setBusy] = useState(false);

	const logout = async () => {
		setBusy(true);
		try {
			await fetch("/api/auth/logout", { method: "POST" });
		} finally {
			router.push("/login");
			router.refresh();
			setBusy(false);
		}
	};

	return (
		<button
			type="button"
			className="btn secondary"
			onClick={logout}
			disabled={busy}>
			{busy ? "Signing out..." : "Sign Out"}
		</button>
	);
}
