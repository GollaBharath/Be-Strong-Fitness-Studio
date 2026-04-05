"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import {
	createUserWithEmailAndPassword,
	signInWithEmailAndPassword,
	signOut,
	updateProfile,
} from "firebase/auth";
import { auth } from "../../../lib/firebase/client";

const PASSWORD_POLICY = /^(?=.*[A-Za-z])(?=.*\d).{8,}$/;

function readableError(error) {
	const code = String(error?.code ?? "");
	const message = String(error?.message ?? "");
	const haystack = `${code} ${message}`;

	if (haystack.includes("auth/email-already-in-use")) {
		return "This email is already in use.";
	}

	if (haystack.includes("auth/invalid-credential")) {
		return "Invalid email or password.";
	}

	if (haystack.includes("auth/too-many-requests")) {
		return "Too many attempts. Try again later.";
	}

	if (haystack.includes("auth/weak-password")) {
		return "Password is too weak. Use at least 8 characters with letters and numbers.";
	}

	if (haystack.includes("auth/operation-not-allowed")) {
		return "Email/password login is not enabled in Firebase Auth.";
	}

	if (
		haystack.includes("auth/invalid-api-key") ||
		haystack.includes("API key not valid")
	) {
		return "Firebase API key is invalid for this project.";
	}

	if (haystack.includes("auth/network-request-failed")) {
		return "Network request failed. Check your internet and try again.";
	}

	if (haystack.includes("auth/unauthorized-domain")) {
		return "This domain is not authorized in Firebase Authentication.";
	}

	if (
		haystack.includes("PERMISSION_DENIED") ||
		haystack.includes("Cloud Firestore API has not been used") ||
		haystack.includes("firestore.googleapis.com")
	) {
		return "Enable the Firestore API for this Firebase project, then retry.";
	}

	return "Something went wrong. Please try again.";
}

export default function LoginForm() {
	const router = useRouter();
	const [mode, setMode] = useState("login");
	const [name, setName] = useState("");
	const [email, setEmail] = useState("");
	const [password, setPassword] = useState("");
	const [loading, setLoading] = useState(false);
	const [error, setError] = useState("");

	const isRegister = mode === "register";

	const submit = async (event) => {
		event.preventDefault();
		setError("");

		if (!email || !password) {
			setError("Email and password are required.");
			return;
		}

		if (isRegister && !PASSWORD_POLICY.test(password)) {
			setError("Use at least 8 characters with letters and numbers.");
			return;
		}

		setLoading(true);

		try {
			const cred = isRegister
				? await createUserWithEmailAndPassword(auth, email, password)
				: await signInWithEmailAndPassword(auth, email, password);

			if (isRegister && name.trim()) {
				await updateProfile(cred.user, { displayName: name.trim() });
			}

			const idToken = await cred.user.getIdToken(true);
			const response = await fetch("/api/auth/session", {
				method: "POST",
				headers: { "Content-Type": "application/json" },
				body: JSON.stringify({ idToken }),
			});

			if (!response.ok) {
				const payload = await response.json().catch(() => ({}));
				const sessionError = new Error(
					payload?.message ?? "Session setup failed",
				);
				sessionError.code = payload?.code ?? "session/failed";
				throw sessionError;
			}

			await signOut(auth);
			router.push("/dashboard");
			router.refresh();
		} catch (e) {
			setError(readableError(e));
		} finally {
			setLoading(false);
		}
	};

	return (
		<div className="auth-card">
			<div className="auth-switch">
				<button
					type="button"
					className={mode === "login" ? "active" : ""}
					onClick={() => setMode("login")}
					disabled={loading}>
					Login
				</button>
				<button
					type="button"
					className={mode === "register" ? "active" : ""}
					onClick={() => setMode("register")}
					disabled={loading}>
					Register
				</button>
			</div>

			<form onSubmit={submit} className="auth-form" noValidate>
				{isRegister ? (
					<label>
						<span>Full Name</span>
						<input
							type="text"
							value={name}
							onChange={(e) => setName(e.target.value)}
							autoComplete="name"
							maxLength={80}
						/>
					</label>
				) : null}

				<label>
					<span>Email</span>
					<input
						type="email"
						value={email}
						onChange={(e) => setEmail(e.target.value)}
						autoComplete="email"
						required
					/>
				</label>

				<label>
					<span>Password</span>
					<input
						type="password"
						value={password}
						onChange={(e) => setPassword(e.target.value)}
						autoComplete={isRegister ? "new-password" : "current-password"}
						required
					/>
				</label>

				{error ? <p className="auth-error">{error}</p> : null}

				<button
					type="submit"
					className="btn primary auth-submit"
					disabled={loading}>
					{loading
						? "Please wait..."
						: isRegister
							? "Create Account"
							: "Continue"}
				</button>
			</form>
		</div>
	);
}
