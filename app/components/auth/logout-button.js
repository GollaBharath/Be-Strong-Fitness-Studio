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
			className="nav-sign-out"
			onClick={logout}
			disabled={busy}>
			<svg viewBox="0 0 24 24" aria-hidden="true" width="18" height="18">
				<path
					fill="currentColor"
					d="M10 17l1.41-1.41L8.83 13H20v-2H8.83l2.58-2.59L10 7l-5 5 5 5zM4 5h8V3H4c-1.1 0-2 .9-2 2v14c0 1.1.9 2 2 2h8v-2H4V5z"
				/>
			</svg>
			<span>{busy ? "Signing out..." : "Sign out"}</span>
		</button>
	);
}
