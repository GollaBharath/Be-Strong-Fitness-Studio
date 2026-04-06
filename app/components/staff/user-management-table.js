"use client";

import { useMemo, useState } from "react";

export default function UserManagementTable({ initialUsers, currentUid }) {
	const [users, setUsers] = useState(initialUsers);
	const [selectedUser, setSelectedUser] = useState(null);
	const [busyAction, setBusyAction] = useState("");
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
		setBusyAction("role");
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
			setSelectedUser((prev) =>
				prev && prev.uid === uid ? { ...prev, role } : prev,
			);
			setMessage("Role updated.");
		} catch {
			setMessage("Unable to update role.");
		} finally {
			setBusyAction("");
		}
	};

	const deleteUser = async (uid) => {
		setMessage("");
		setBusyAction("delete");
		try {
			const response = await fetch(`/api/staff/users/${uid}`, {
				method: "DELETE",
			});

			if (!response.ok) {
				throw new Error("Delete failed");
			}

			setUsers((prev) => prev.filter((user) => user.uid !== uid));
			setSelectedUser(null);
			setMessage("User deleted.");
		} catch {
			setMessage("Unable to delete user.");
		} finally {
			setBusyAction("");
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
										onClick={() => setSelectedUser(user)}>
										Edit
									</button>
								</td>
							</tr>
						);
					})}
				</tbody>
			</table>

			{selectedUser ? (
				<div
					className="staff-modal-overlay"
					onClick={() => setSelectedUser(null)}
					role="presentation">
					<div
						className="staff-modal"
						onClick={(event) => event.stopPropagation()}
						role="dialog"
						aria-modal="true"
						aria-label="Edit user">
						<div className="staff-modal-head">
							<h3>Edit User</h3>
							<button
								type="button"
								className="btn secondary btn-small"
								onClick={() => setSelectedUser(null)}>
								Close
							</button>
						</div>

						<p className="staff-modal-copy">
							{selectedUser.email ?? "No email"}
						</p>
						<p className="staff-modal-copy muted">
							Current role: {selectedUser.role}
						</p>

						<div className="staff-modal-actions">
							<button
								type="button"
								className="btn secondary"
								disabled={busyAction !== "" || selectedUser.uid === currentUid}
								onClick={() =>
									updateRole(
										selectedUser.uid,
										selectedUser.role === "staff" ? "user" : "staff",
									)
								}>
								{busyAction === "role"
									? "Saving..."
									: selectedUser.role === "staff"
										? "Make User"
										: "Make Staff"}
							</button>

							<button
								type="button"
								className="btn secondary staff-delete-btn"
								disabled={busyAction !== "" || selectedUser.uid === currentUid}
								onClick={() => deleteUser(selectedUser.uid)}>
								{busyAction === "delete" ? "Deleting..." : "Delete User"}
							</button>
						</div>

						{selectedUser.uid === currentUid ? (
							<p className="staff-modal-copy muted">
								You cannot change or delete your own account.
							</p>
						) : null}
					</div>
				</div>
			) : null}
		</div>
	);
}
