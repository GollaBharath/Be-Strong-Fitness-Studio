"use client";

import Link from "next/link";
import { usePathname, useSearchParams } from "next/navigation";
import LogoutButton from "../auth/logout-button";

function NavLink({ href, children, className = "" }) {
	return (
		<Link href={href} className={className}>
			{children}
		</Link>
	);
}

export default function SiteNavbar() {
	const pathname = usePathname();
	const searchParams = useSearchParams();
	const isDashboard = pathname.startsWith("/dashboard");
	const isUserDashboard = pathname.startsWith("/dashboard/user");
	const isLogin = pathname.startsWith("/login");
	const isStaffDashboard = pathname.startsWith("/dashboard/staff");
	const staffTabs = [
		{ label: "User Management", href: "/dashboard/staff/users" },
		{ label: "Member Management", href: "/dashboard/staff/memberships" },
	];
	const activeUserTab = searchParams.get("tab") || "transformation-planner";
	const userTabs = [
		{
			label: "Transformation Planner",
			value: "transformation-planner",
		},
		{ label: "Membership", value: "membership" },
		{ label: "Calorie Calculator", value: "calorie-calculator" },
		{ label: "Workouts", value: "workouts" },
		{ label: "Support us", value: "support-us" },
	];

	return (
		<header className="main-header">
			<div className="container header-container">
				<NavLink href="/" className="logo-group">
					<img
						src="/logo.jpg"
						alt="Be Strong Fitness Studio"
						className="brand-logo"
					/>
					<div className="brand-text">
						<span className="brand-title">BE STRONG</span>
						<span className="brand-subtitle">FITNESS STUDIO</span>
					</div>
				</NavLink>

				{isDashboard ? (
					<div className="site-nav-shell">
						{isUserDashboard ? (
							<nav
								className="main-nav dashboard-tabs"
								aria-label="Member dashboard tabs">
								{userTabs.map((tab) => (
									<NavLink
										key={tab.value}
										href={`/dashboard/user?tab=${tab.value}`}
										className={
											activeUserTab === tab.value
												? "dashboard-tab-link active"
												: "dashboard-tab-link"
										}>
										{tab.label}
									</NavLink>
								))}
							</nav>
						) : isStaffDashboard ? (
							<nav
								className="main-nav dashboard-tabs"
								aria-label="Staff dashboard tabs">
								{staffTabs.map((tab) => (
									<NavLink
										key={tab.href}
										href={tab.href}
										className={
											pathname === tab.href
												? "dashboard-tab-link active"
												: "dashboard-tab-link"
										}>
										{tab.label}
									</NavLink>
								))}
							</nav>
						) : (
							<div className="site-nav-copy">
								<span className="hall-kicker">Dashboard</span>
								<span className="site-nav-title">
									{isStaffDashboard ? "Staff Console" : "Member Panel"}
								</span>
							</div>
						)}
						<div className="site-nav-actions">
							{isUserDashboard ? null : (
								<nav className="main-nav dashboard-nav">
									<NavLink href="/" className="dashboard-nav-link">
										Home
									</NavLink>
								</nav>
							)}
							<LogoutButton />
						</div>
					</div>
				) : isLogin ? (
					<nav className="main-nav auth-nav">
						<NavLink href="/">Home</NavLink>
						<NavLink href="/#packages">Memberships</NavLink>
					</nav>
				) : (
					<nav className="main-nav public-nav">
						<NavLink href="/#packages">Memberships</NavLink>
						<NavLink href="/#facilities">Facilities</NavLink>
						<NavLink href="/transformations">Hall of Fame</NavLink>
						<NavLink href="/#timings">Timings</NavLink>
						<NavLink href="/login" className="nav-join-btn">
							Join Now
						</NavLink>
					</nav>
				)}
			</div>
		</header>
	);
}
