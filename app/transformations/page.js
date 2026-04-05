import Link from "next/link";
import { transformations } from "../data/transformations";

export const metadata = {
	title: "Client Transformations | BE STRONG FITNESS STUDIO",
	description:
		"Explore real BE STRONG member transformations and progress journeys.",
};

export default function TransformationsPage() {
	return (
		<main className="hall-page">
			<header className="hall-header">
				<div className="container hall-header-inner">
					<div>
						<p className="hall-kicker">Hall of Fame</p>
						<h1>Real Member Transformations</h1>
						<p>Consistency, coaching, and results.</p>
					</div>
					<div className="hall-actions">
						<Link href="/" className="btn secondary">
							Back Home
						</Link>
						<Link href="/#cta" className="btn primary">
							Start Your Journey
						</Link>
					</div>
				</div>
			</header>

			<section className="section hall-section">
				<div className="container">
					<div className="hall-grid">
						{transformations.map((person) => (
							<article className="hall-card" key={person.id}>
								<img src={person.image} alt={`${person.name} transformation`} />
								<div className="hall-card-content">
									<h3>{person.name}</h3>
									<ul>
										<li>
											<span>Result</span>
											<strong>{person.result}</strong>
										</li>
										<li>
											<span>Duration</span>
											<strong>{person.duration}</strong>
										</li>
										<li>
											<span>Focus</span>
											<strong>{person.focus}</strong>
										</li>
									</ul>
								</div>
							</article>
						))}
					</div>
				</div>
			</section>
		</main>
	);
}
