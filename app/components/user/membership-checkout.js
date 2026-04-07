"use client";

import { useEffect, useMemo, useState } from "react";

function formatDate(value) {
	if (!value) {
		return "--";
	}

	const date = new Date(value);
	if (Number.isNaN(date.getTime())) {
		return "--";
	}

	return date.toLocaleDateString(undefined, {
		month: "short",
		day: "numeric",
		year: "numeric",
	});
}

export default function MembershipCheckout({
	title = "Membership Checkout",
	description = "Placeholder checkout is enabled. Payments will be integrated with Stripe later.",
}) {
	const [plans, setPlans] = useState([]);
	const [membership, setMembership] = useState(null);
	const [loading, setLoading] = useState(true);
	const [busyPlanId, setBusyPlanId] = useState("");
	const [error, setError] = useState("");
	const [success, setSuccess] = useState("");

	const currentPlanLabel = useMemo(() => {
		if (!membership?.planTitle) {
			return "No active membership";
		}
		return `${membership.planTitle} (${membership.status || "unknown"})`;
	}, [membership]);

	const sortedPlans = useMemo(() => {
		return [...plans].sort((a, b) => a.durationMonths - b.durationMonths);
	}, [plans]);

	const baseMonthlyPrice = useMemo(() => {
		const oneMonth = sortedPlans.find((plan) => plan.durationMonths === 1);
		if (oneMonth?.priceInr) {
			return oneMonth.priceInr;
		}
		if (!sortedPlans[0]?.durationMonths) {
			return 0;
		}
		return Math.round(sortedPlans[0].priceInr / sortedPlans[0].durationMonths);
	}, [sortedPlans]);

	const featuredPlanId = useMemo(() => {
		const sixMonth = sortedPlans.find((plan) => plan.durationMonths === 6);
		if (sixMonth) {
			return sixMonth.id;
		}
		const fallback = sortedPlans[Math.floor(sortedPlans.length / 2)];
		return fallback?.id ?? "";
	}, [sortedPlans]);

	useEffect(() => {
		let active = true;

		async function loadMembership() {
			setLoading(true);
			setError("");
			try {
				const response = await fetch("/api/user/membership", {
					cache: "no-store",
				});
				const payload = await response.json();
				if (!response.ok) {
					if (active) {
						setError(payload?.error || "Unable to load membership plans.");
					}
					return;
				}

				if (active) {
					setPlans(Array.isArray(payload?.plans) ? payload.plans : []);
					setMembership(payload?.membership ?? null);
				}
			} catch {
				if (active) {
					setError("Unable to load membership plans.");
				}
			} finally {
				if (active) {
					setLoading(false);
				}
			}
		}

		loadMembership();
		return () => {
			active = false;
		};
	}, []);

	async function checkout(planId) {
		setBusyPlanId(planId);
		setError("");
		setSuccess("");

		try {
			const response = await fetch("/api/user/membership", {
				method: "POST",
				headers: { "Content-Type": "application/json" },
				body: JSON.stringify({ planId }),
			});
			const payload = await response.json();
			if (!response.ok) {
				setError(payload?.error || "Unable to activate membership.");
				return;
			}

			setMembership(payload?.membership ?? null);
			setSuccess(payload?.message || "Membership activated.");
		} catch {
			setError("Unable to activate membership.");
		} finally {
			setBusyPlanId("");
		}
	}

	return (
		<section
			className="dashboard-card membership-card"
			aria-label="Membership checkout">
			<div className="membership-head">
				<h2>{title}</h2>
				<p>{description}</p>
			</div>

			<div className="membership-current">
				<p>Current: {currentPlanLabel}</p>
				<p>
					Started: {formatDate(membership?.startedAt)} · Expires:{" "}
					{formatDate(membership?.expiresAt)}
				</p>
			</div>

			{loading ? <p className="exercise-empty">Loading plans...</p> : null}

			<div className="membership-pricing-grid">
				{sortedPlans.map((plan) => {
					const processing = busyPlanId === plan.id;
					const isFeatured = plan.id === featuredPlanId;
					const isActivePlan = membership?.planTitle === plan.title;
					const monthlyPrice = Math.round(plan.priceInr / plan.durationMonths);
					const savingsPercent =
						baseMonthlyPrice > 0
							? Math.max(
									0,
									Math.round((1 - monthlyPrice / baseMonthlyPrice) * 100),
								)
							: 0;
					const disabled = processing || isActivePlan;

					return (
						<article
							className={`membership-plan-card${isFeatured ? " featured" : ""}`}
							key={plan.id}>
							<div className="membership-plan-top">
								<h3>{plan.title}</h3>
								{isActivePlan ? (
									<span className="membership-plan-badge active">Active</span>
								) : isFeatured ? (
									<span className="membership-plan-badge">Most Popular</span>
								) : null}
							</div>

							<p className="membership-price">Rs {plan.priceInr}</p>
							<p className="membership-per-month">Rs {monthlyPrice}/month</p>
							<p className="membership-duration">
								{plan.durationMonths} month access
							</p>

							{savingsPercent > 0 ? (
								<p className="membership-savings">
									Save {savingsPercent}% vs monthly plan
								</p>
							) : (
								<p className="membership-savings muted">
									Flexible starter plan
								</p>
							)}

							<button
								type="button"
								className="btn primary membership-checkout-btn"
								onClick={() => checkout(plan.id)}
								disabled={disabled}>
								{processing
									? "Processing..."
									: isActivePlan
										? "Current Plan"
										: "Checkout"}
							</button>
						</article>
					);
				})}
			</div>

			{error ? <p className="calorie-error">{error}</p> : null}
			{success ? <p className="goal-success">{success}</p> : null}
		</section>
	);
}
