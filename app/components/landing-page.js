"use client";

import Link from "next/link";
import { Dumbbell, Trophy, Zap, Users } from "lucide-react";
import { ImageWithFallback } from "./figma/image-with-fallback";

export default function LandingPage() {
	return (
		<div className="min-h-screen bg-[#0b0b0b]">
			<header className="fixed top-0 left-0 w-full z-50 bg-[rgba(11,11,11,0.6)] backdrop-blur-[15px] border-b border-[rgba(255,255,255,0.05)]">
				<div className="max-w-7xl mx-auto px-6 py-4 flex justify-between items-center">
					<div className="flex items-center gap-3">
						<div className="w-12 h-12 rounded-full bg-gradient-to-br from-[#00b3a4] to-[#007a73] flex items-center justify-center shadow-[0_0_15px_rgba(0,179,164,0.4)]">
							<Dumbbell className="w-6 h-6 text-white" />
						</div>
						<div>
							<h1 className="text-xl font-extrabold tracking-wide">
								BE STRONG
							</h1>
							<p className="text-[0.65rem] font-semibold text-[#00b3a4] tracking-[0.2em] uppercase">
								Fitness Studio
							</p>
						</div>
					</div>
					<Link
						href="/login"
						className="bg-[#00b3a4] text-[#0b0b0b] px-6 py-2.5 rounded-full font-bold uppercase tracking-wide text-sm shadow-[0_0_15px_rgba(0,179,164,0.3)] hover:bg-[#00d6c4] hover:shadow-[0_0_25px_rgba(0,179,164,0.6)] hover:-translate-y-0.5 transition-all duration-300">
						Join Now
					</Link>
				</div>
			</header>

			<section className="relative min-h-screen flex items-center justify-center overflow-hidden pt-20">
				<div className="absolute inset-0 bg-gradient-radial from-[rgba(0,179,164,0.15)] to-transparent" />
				<ImageWithFallback
					src="https://images.unsplash.com/photo-1584827386894-fc939dad6078?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&q=80&w=1920"
					alt="Gym Equipment"
					className="absolute inset-0 w-full h-full object-cover opacity-20"
				/>
				<div className="relative z-10 text-center px-6 max-w-5xl mx-auto">
					<h2 className="text-6xl md:text-8xl font-extrabold uppercase mb-6 bg-gradient-to-r from-white via-[#00b3a4] to-white bg-clip-text text-transparent">
						Transform Your Body
					</h2>
					<p className="text-xl md:text-2xl text-[#a0a0a0] mb-12 max-w-3xl mx-auto">
						Join the strongest fitness community. Expert trainers, world-class
						facilities, and personalized programs designed for your success.
					</p>
					<Link
						href="/login"
						className="inline-block bg-[#00b3a4] text-[#0b0b0b] px-12 py-5 rounded-full font-bold uppercase tracking-wide text-lg shadow-[0_0_30px_rgba(0,179,164,0.5)] hover:bg-[#00d6c4] hover:shadow-[0_0_40px_rgba(0,179,164,0.7)] hover:-translate-y-1 transition-all duration-300">
						Start Your Journey
					</Link>
				</div>
			</section>

			<section className="py-24 px-6 relative">
				<div className="max-w-7xl mx-auto">
					<h3 className="text-4xl md:text-5xl font-extrabold text-center mb-16 bg-gradient-to-b from-white to-[#a0a0a0] bg-clip-text text-transparent">
						Why Choose Be Strong
					</h3>
					<div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
						{[
							{
								icon: Dumbbell,
								title: "Premium Equipment",
								desc: "State-of-the-art machines and free weights",
							},
							{
								icon: Users,
								title: "Expert Trainers",
								desc: "Certified professionals guiding your journey",
							},
							{
								icon: Trophy,
								title: "Proven Results",
								desc: "Hundreds of successful transformations",
							},
							{
								icon: Zap,
								title: "Flexible Plans",
								desc: "Membership options that fit your lifestyle",
							},
						].map((feature) => (
							<div
								key={feature.title}
								className="bg-[rgba(255,255,255,0.03)] border border-[rgba(255,255,255,0.08)] rounded-3xl p-8 backdrop-blur-sm hover:border-[rgba(255,255,255,0.2)] hover:-translate-y-2 transition-all duration-300">
								<feature.icon className="w-12 h-12 text-[#00b3a4] mb-6" />
								<h4 className="text-2xl font-bold mb-3">{feature.title}</h4>
								<p className="text-[#a0a0a0]">{feature.desc}</p>
							</div>
						))}
					</div>
				</div>
			</section>
		</div>
	);
}
