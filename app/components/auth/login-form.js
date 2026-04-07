"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import {
	ArrowLeft,
	Dumbbell,
	Eye,
	EyeOff,
	Lock,
	Mail,
	User,
} from "lucide-react";
import {
	createUserWithEmailAndPassword,
	GoogleAuthProvider,
	signInWithPopup,
	signInWithEmailAndPassword,
	signOut,
	updateProfile,
} from "firebase/auth";
import { auth } from "../../../lib/firebase/client";
import { ImageWithFallback } from "../figma/image-with-fallback";

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

	if (haystack.includes("auth/popup-closed-by-user")) {
		return "Google sign-in was closed before it completed.";
	}

	if (haystack.includes("auth/popup-blocked")) {
		return "Your browser blocked the Google sign-in popup.";
	}

	if (haystack.includes("auth/account-exists-with-different-credential")) {
		return "An account already exists with this email using another sign-in method.";
	}

	return "Something went wrong. Please try again.";
}

export default function LoginForm() {
	const router = useRouter();
	const [mode, setMode] = useState("login");
	const [showPassword, setShowPassword] = useState(false);
	const [name, setName] = useState("");
	const [email, setEmail] = useState("");
	const [password, setPassword] = useState("");
	const [loading, setLoading] = useState(null);
	const [error, setError] = useState("");

	const isRegister = mode === "register";
	const isBusy = Boolean(loading);

	const completeSession = async (user) => {
		const idToken = await user.getIdToken(true);
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

		const payload = await response.json().catch(() => ({}));
		const nextPath =
			payload?.role === "staff" ? "/dashboard/staff" : "/dashboard/user";

		await signOut(auth);
		router.push(nextPath);
		router.refresh();
	};

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

		setLoading("email");

		try {
			const cred = isRegister
				? await createUserWithEmailAndPassword(auth, email, password)
				: await signInWithEmailAndPassword(auth, email, password);

			if (isRegister && name.trim()) {
				await updateProfile(cred.user, { displayName: name.trim() });
			}

			await completeSession(cred.user);
		} catch (e) {
			setError(readableError(e));
		} finally {
			setLoading(null);
		}
	};

	const signInWithGoogle = async () => {
		setError("");
		setLoading("google");

		try {
			const provider = new GoogleAuthProvider();
			provider.setCustomParameters({ prompt: "select_account" });
			const result = await signInWithPopup(auth, provider);
			await completeSession(result.user);
		} catch (e) {
			setError(readableError(e));
		} finally {
			setLoading(null);
		}
	};

	return (
		<div className="min-h-screen bg-[#0b0b0b] relative overflow-hidden">
			<div className="absolute inset-0">
				<div className="absolute inset-0 bg-gradient-radial from-[rgba(0,179,164,0.15)] via-transparent to-transparent" />
				<div className="absolute top-20 right-20 w-96 h-96 bg-[rgba(0,179,164,0.1)] rounded-full blur-[120px] animate-pulse" />
				<div
					className="absolute bottom-20 left-20 w-96 h-96 bg-[rgba(255,59,59,0.08)] rounded-full blur-[120px] animate-pulse"
					style={{ animationDelay: "1s" }}
				/>
			</div>

			<ImageWithFallback
				src="https://images.unsplash.com/photo-1707365025743-23177fac01e2?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&q=80&w=1280"
				alt="Fitness Studio"
				className="absolute inset-0 w-full h-full object-cover opacity-10"
			/>

			<button
				onClick={() => router.push("/")}
				className="absolute top-8 left-8 z-20 flex items-center gap-2 text-[#a0a0a0] hover:text-[#00b3a4] transition-colors duration-300"
				disabled={isBusy}>
				<ArrowLeft className="w-5 h-5" />
				<span className="font-semibold">Back to Home</span>
			</button>

			<div className="relative z-10 min-h-screen flex items-center justify-center px-6 py-20">
				<div className="w-full max-w-6xl grid md:grid-cols-2 gap-12 items-center">
					<div className="space-y-6">
						<div className="flex items-center gap-4">
							<div className="w-16 h-16 rounded-full bg-gradient-to-br from-[#00b3a4] to-[#007a73] flex items-center justify-center shadow-[0_0_30px_rgba(0,179,164,0.5)]">
								<Dumbbell className="w-8 h-8 text-white" />
							</div>
							<div>
								<h1 className="text-3xl font-extrabold tracking-wide">
									BE STRONG
								</h1>
								<p className="text-sm font-semibold text-[#00b3a4] tracking-[0.2em] uppercase">
									Fitness Studio
								</p>
							</div>
						</div>

						<div className="space-y-4">
							<p className="text-xs uppercase tracking-[0.2em] text-[#00b3a4] font-bold">
								Member Access
							</p>
							<h2 className="text-5xl font-extrabold leading-tight">
								Your Fitness Journey Starts Here
							</h2>
							<p className="text-lg text-[#a0a0a0] max-w-md">
								Sign in to access your personalized dashboard, track your
								progress, and unlock member benefits.
							</p>
						</div>
					</div>

					<div className="bg-[rgba(255,255,255,0.04)] backdrop-blur-xl border border-[rgba(255,255,255,0.08)] rounded-3xl p-8 shadow-[0_20px_60px_rgba(0,0,0,0.4)]">
						<div className="grid grid-cols-2 gap-3 mb-8 bg-[rgba(255,255,255,0.02)] p-2 rounded-2xl">
							<button
								type="button"
								onClick={() => setMode("login")}
								disabled={isBusy}
								className={`py-3 px-4 rounded-xl font-bold uppercase text-sm tracking-wide transition-all duration-300 ${
									mode === "login"
										? "bg-[#00b3a4] text-[#0b0b0b] shadow-[0_0_20px_rgba(0,179,164,0.3)]"
										: "text-[#a0a0a0] hover:text-white"
								}`}>
								Sign In
							</button>
							<button
								type="button"
								onClick={() => setMode("register")}
								disabled={isBusy}
								className={`py-3 px-4 rounded-xl font-bold uppercase text-sm tracking-wide transition-all duration-300 ${
									mode === "register"
										? "bg-[#00b3a4] text-[#0b0b0b] shadow-[0_0_20px_rgba(0,179,164,0.3)]"
										: "text-[#a0a0a0] hover:text-white"
								}`}>
								Sign Up
							</button>
						</div>

						{!isRegister ? (
							<>
								<button
									type="button"
									onClick={signInWithGoogle}
									disabled={isBusy}
									className="w-full bg-[rgba(255,255,255,0.08)] hover:bg-[rgba(255,255,255,0.12)] border border-[rgba(255,255,255,0.14)] text-white py-3.5 rounded-xl font-bold uppercase text-sm tracking-wide transition-all duration-300 flex items-center justify-center gap-3 mb-6">
									{loading === "google"
										? "Connecting..."
										: "Continue with Google"}
								</button>
								<div className="relative mb-6">
									<div className="absolute inset-0 flex items-center">
										<div className="w-full border-t border-[rgba(255,255,255,0.1)]" />
									</div>
									<div className="relative flex justify-center text-sm">
										<span className="px-4 bg-[rgba(255,255,255,0.04)] text-[#a0a0a0] uppercase tracking-wide font-semibold">
											Or continue with email
										</span>
									</div>
								</div>
							</>
						) : null}

						<form onSubmit={submit} className="space-y-5" noValidate>
							{isRegister ? (
								<div className="space-y-2">
									<label className="text-sm text-[#a0a0a0] font-semibold uppercase tracking-wide">
										Full Name
									</label>
									<div className="relative">
										<User className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-[#a0a0a0]" />
										<input
											type="text"
											value={name}
											onChange={(event) => setName(event.target.value)}
											autoComplete="name"
											maxLength={80}
											className="w-full bg-[rgba(255,255,255,0.06)] border border-[rgba(255,255,255,0.14)] rounded-xl py-3.5 pl-12 pr-4 text-white placeholder-[#666] focus:outline-none focus:border-[#00b3a4] focus:shadow-[0_0_0_3px_rgba(0,179,164,0.2)] transition-all duration-300"
											placeholder="Enter your name"
										/>
									</div>
								</div>
							) : null}

							<div className="space-y-2">
								<label className="text-sm text-[#a0a0a0] font-semibold uppercase tracking-wide">
									Email Address
								</label>
								<div className="relative">
									<Mail className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-[#a0a0a0]" />
									<input
										type="email"
										value={email}
										onChange={(event) => setEmail(event.target.value)}
										autoComplete="email"
										required
										className="w-full bg-[rgba(255,255,255,0.06)] border border-[rgba(255,255,255,0.14)] rounded-xl py-3.5 pl-12 pr-4 text-white placeholder-[#666] focus:outline-none focus:border-[#00b3a4] focus:shadow-[0_0_0_3px_rgba(0,179,164,0.2)] transition-all duration-300"
										placeholder="your@email.com"
									/>
								</div>
							</div>

							<div className="space-y-2">
								<label className="text-sm text-[#a0a0a0] font-semibold uppercase tracking-wide">
									Password
								</label>
								<div className="relative">
									<Lock className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-[#a0a0a0]" />
									<input
										type={showPassword ? "text" : "password"}
										value={password}
										onChange={(event) => setPassword(event.target.value)}
										autoComplete={
											isRegister ? "new-password" : "current-password"
										}
										required
										className="w-full bg-[rgba(255,255,255,0.06)] border border-[rgba(255,255,255,0.14)] rounded-xl py-3.5 pl-12 pr-12 text-white placeholder-[#666] focus:outline-none focus:border-[#00b3a4] focus:shadow-[0_0_0_3px_rgba(0,179,164,0.2)] transition-all duration-300"
										placeholder="Enter your password"
									/>
									<button
										type="button"
										onClick={() => setShowPassword((value) => !value)}
										className="absolute right-4 top-1/2 -translate-y-1/2 text-[#a0a0a0] hover:text-[#00b3a4] transition-colors duration-200"
										disabled={isBusy}>
										{showPassword ? (
											<EyeOff className="w-5 h-5" />
										) : (
											<Eye className="w-5 h-5" />
										)}
									</button>
								</div>
							</div>

							{error ? <p className="text-[#ff9d9d] text-sm">{error}</p> : null}

							<button
								type="submit"
								disabled={isBusy}
								className="w-full bg-[#00b3a4] text-[#0b0b0b] py-4 rounded-xl font-bold uppercase tracking-wide shadow-[0_0_20px_rgba(0,179,164,0.4)] hover:bg-[#00d6c4] hover:shadow-[0_0_30px_rgba(0,179,164,0.6)] hover:-translate-y-0.5 transition-all duration-300">
								{loading === "email"
									? "Please wait..."
									: isRegister
										? "Create Account"
										: "Sign In"}
							</button>
						</form>
					</div>
				</div>
			</div>
		</div>
	);
}
