import { requireAuth } from "../../../lib/auth/server";
import { USER_ROLES } from "../../../lib/constants/auth";
import CalorieCalculator from "@/app/components/user/calorie-calculator";
import GoalPlanner from "@/app/components/user/goal-planner";
import MembershipCheckout from "@/app/components/user/membership-checkout";
import ReviewsPanel from "@/app/components/user/reviews-panel";
import WorkoutFinder from "@/app/components/user/workout-finder";

function normalizeTab(tab) {
	const value = Array.isArray(tab) ? tab[0] : tab;
	const fallback = "transformation-planner";
	const allowed = new Set([
		fallback,
		"membership",
		"calorie-calculator",
		"workouts",
		"support-us",
	]);

	return allowed.has(value) ? value : fallback;
}

function getTabMeta(tab) {
	switch (tab) {
		case "membership":
			return {
				kicker: "Access",
				title: "Membership",
				description:
					"Check available plans and activate your membership from one place.",
			};
		case "calorie-calculator":
			return {
				kicker: "Fuel",
				title: "Calorie Calculator",
				description: "Look up foods and see the numbers before you eat.",
			};
		case "workouts":
			return {
				kicker: "Train",
				title: "Workouts",
				description: "Search exercises by muscle group, body part, or name.",
			};
		case "support-us":
			return {
				kicker: "Support",
				title: "Support us",
				description:
					"Leave feedback and keep up with the studio across our socials.",
			};
		default:
			return {
				kicker: "Plan",
				title: "Transformation Planner",
				description:
					"Set your profile once and generate a tailored food and training plan.",
			};
	}
}

export default async function UserDashboardPage({ searchParams }) {
	await requireAuth({ role: USER_ROLES.USER });
	const activeTab = normalizeTab(searchParams?.tab);
	const meta = getTabMeta(activeTab);

	return (
		<div className="member-dashboard member-tab-view">
			<section className="member-tab-hero">
				<p className="hall-kicker">Member Hub</p>
				<h1>{meta.title}</h1>
				<p>{meta.description}</p>
			</section>

			<section className="member-tab-panel">
				{activeTab === "membership" ? (
					<MembershipCheckout
						title="Membership"
						description="Check available plans and activate your membership from one place."
					/>
				) : null}

				{activeTab === "calorie-calculator" ? (
					<CalorieCalculator
						title="Calorie Calculator"
						description="Look up foods and see the numbers before you eat."
					/>
				) : null}

				{activeTab === "workouts" ? (
					<WorkoutFinder
						title="Workouts"
						description="Search exercises by muscle group, body part, or name."
					/>
				) : null}

				{activeTab === "support-us" ? (
					<div className="support-grid support-grid-tabbed">
						<ReviewsPanel
							title="Support us"
							description="Leave feedback and help us keep improving the studio experience."
						/>
						<aside className="support-links">
							<h3>Our socials</h3>
							<p>Stay connected with the studio outside the app.</p>
							<div className="support-link-list">
								<a
									href="https://wa.me/1234567890"
									target="_blank"
									rel="noreferrer">
									<span className="support-link-label">WhatsApp</span>
									<span className="support-link-meta">
										Quick replies and updates
									</span>
								</a>
								<a
									href="https://www.instagram.com/"
									target="_blank"
									rel="noreferrer">
									<span className="support-link-label">Instagram</span>
									<span className="support-link-meta">
										Photos, reels, and highlights
									</span>
								</a>
								<a
									href="https://www.facebook.com/"
									target="_blank"
									rel="noreferrer">
									<span className="support-link-label">Facebook</span>
									<span className="support-link-meta">
										Community posts and events
									</span>
								</a>
							</div>
						</aside>
					</div>
				) : null}

				{activeTab === "transformation-planner" ? (
					<GoalPlanner
						title="Transformation Planner"
						description="Set your profile once and generate a tailored food and training plan."
					/>
				) : null}
			</section>
		</div>
	);
}
