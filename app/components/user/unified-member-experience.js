"use client";

import { useEffect, useRef, useState } from "react";
import {
	Activity,
	Apple,
	CreditCard,
	Dumbbell,
	Star,
	Target,
} from "lucide-react";
import LogoutButton from "../auth/logout-button";
import CalorieCalculator from "./calorie-calculator";
import GoalPlanner from "./goal-planner";
import MembershipCheckout from "./membership-checkout";
import ReviewsPanel from "./reviews-panel";
import WorkoutFinder from "./workout-finder";

const sections = [
	{ id: "overview", label: "Dashboard", icon: Activity },
	{ id: "membership", label: "Membership", icon: CreditCard },
	{ id: "planner", label: "Goal Planner", icon: Target },
	{ id: "nutrition", label: "Nutrition", icon: Apple },
	{ id: "workouts", label: "Workouts", icon: Dumbbell },
	{ id: "reviews", label: "Reviews", icon: Star },
];

export default function UnifiedMemberExperience({ displayName }) {
	const [activeSection, setActiveSection] = useState("overview");
	const sectionRefs = useRef({});

	useEffect(() => {
		const handleScroll = () => {
			const scrollPosition = window.scrollY + 200;
			for (const [section, ref] of Object.entries(sectionRefs.current)) {
				if (!ref) continue;
				const top = ref.offsetTop;
				const bottom = top + ref.offsetHeight;
				if (scrollPosition >= top && scrollPosition < bottom) {
					setActiveSection(section);
					break;
				}
			}
		};

		window.addEventListener("scroll", handleScroll);
		handleScroll();
		return () => window.removeEventListener("scroll", handleScroll);
	}, []);

	const scrollToSection = (sectionId) => {
		const element = sectionRefs.current[sectionId];
		if (!element) return;
		window.scrollTo({ top: element.offsetTop - 100, behavior: "smooth" });
	};

	return (
		<div className="dashboard-page">
			<header className="main-header">
				<div className="container header-container">
					<div className="logo-group">
						<img
							src="/logo.jpg"
							alt="Be Strong Fitness Studio"
							className="brand-logo"
						/>
						<div className="brand-text">
							<span className="brand-title">BE STRONG</span>
							<span className="brand-subtitle">FITNESS STUDIO</span>
						</div>
					</div>

					<nav className="dashboard-nav-bar" aria-label="Dashboard navigation">
						{sections.map((section) => {
							const Icon = section.icon;
							return (
								<button
									key={section.id}
									onClick={() => scrollToSection(section.id)}
									className={`dashboard-nav-item ${activeSection === section.id ? "active" : ""}`}>
									<Icon className="nav-icon" />
									<span>{section.label}</span>
								</button>
							);
						})}
					</nav>

					<div className="user-actions">
						<LogoutButton />
					</div>
				</div>
			</header>

			<main className="dashboard-body">
				<div className="member-dashboard">
					<section
						ref={(el) => (sectionRefs.current.overview = el)}
						className="member-hero">
						<div className="member-hero-top">
							<div className="member-hero-copy">
								<h1>Welcome Back, {displayName}!</h1>
								<p>
									Track your progress and manage your complete fitness journey
									from one place.
								</p>
							</div>
						</div>
					</section>

					<section
						ref={(el) => (sectionRefs.current.membership = el)}
						className="member-section">
						<MembershipCheckout
							title="Membership"
							description="Choose the right membership plan and activate instantly."
						/>
					</section>

					<section
						ref={(el) => (sectionRefs.current.planner = el)}
						className="member-section">
						<GoalPlanner
							title="Transformation Planner"
							description="Set your profile and generate your training and nutrition plan."
						/>
					</section>

					<section
						ref={(el) => (sectionRefs.current.nutrition = el)}
						className="member-section">
						<CalorieCalculator
							title="Calorie Calculator"
							description="Search foods and instantly check calories and macros."
						/>
					</section>

					<section
						ref={(el) => (sectionRefs.current.workouts = el)}
						className="member-section">
						<WorkoutFinder
							title="Workout Library"
							description="Find exercises by muscle group, body part, or keyword."
						/>
					</section>

					<section
						ref={(el) => (sectionRefs.current.reviews = el)}
						className="member-section">
						<ReviewsPanel
							title="Reviews"
							description="Share feedback and help us improve the Be Strong experience."
						/>
					</section>
				</div>
			</main>
		</div>
	);
}
