"use client";

import { useMemo, useState } from "react";

export default function UserManagementTable({ initialUsers, currentUid }) {
	const [users, setUsers] = useState(initialUsers);
	const [busyUid, setBusyUid] = useState(null);
	const [message, setMessage] = useState("");

	const sortedUsers = useMemo(
		() =>
			[...users].sort((a, b) =>
				String(a.email ?? "").localeCompare(String(b.email ?? "")),
			),
		[users],
	);

	const updateRole = async (uid, role) => {
		setMessage("");
		setBusyUid(uid);
		try {
			const response = await fetch(`/api/staff/users/${uid}/role`, {
				method: "PATCH",
				headers: { "Content-Type": "application/json" },
				body: JSON.stringify({ role }),
			});

			if (!response.ok) {
				throw new Error("Role update failed");
			}

			setUsers((prev) =>
				prev.map((user) => (user.uid === uid ? { ...user, role } : user)),
			);
			setMessage("Role updated.");
		} catch {
			setMessage("Unable to update role.");
		} finally {
			setBusyUid(null);
		}
	};

	return (
		<div className="rbac-table-wrap">
			{message ? <p className="auth-error muted">{message}</p> : null}
			<table className="rbac-table">
				<thead>
					<tr>
						<th>Email</th>
						<th>Name</th>
						<th>Role</th>
						<th>Action</th>
					</tr>
				</thead>
				<tbody>
					{sortedUsers.map((user) => {
						const disabled = busyUid === user.uid || user.uid === currentUid;
						const nextRole = user.role === "staff" ? "user" : "staff";

						return (
							<tr key={user.uid}>
								<td>{user.email ?? "-"}</td>
								<td>{user.displayName ?? "-"}</td>
								<td>
									<span className={`role-badge ${user.role}`}>{user.role}</span>
								</td>
								<td>
									<button
										type="button"
										className="btn secondary btn-small"
										onClick={() => updateRole(user.uid, nextRole)}
										disabled={disabled}>
										{busyUid === user.uid
											? "Saving..."
											: user.uid === currentUid
												? "Current Account"
												: `Make ${nextRole}`}
									</button>
								</td>
							</tr>
						);
					})}
				</tbody>
			</table>
		</div>
	);
}
