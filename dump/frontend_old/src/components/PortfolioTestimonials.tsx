"use client";
import React, { memo } from "react";
import Image from "next/image";
import GlassCard from "./GlassCard";

const testimonials = [
	{
		name: "Jane Doe",
		title: "Product Designer",
		avatar: "https://randomuser.me/api/portraits/women/44.jpg",
		quote: (
			<span>
				<span
					className="text-xs font-mono font-bold text-gray-500 dark:text-gray-400 mr-1 align-super tracking-widest"
					style={{
						fontSize: "0.7em",
						letterSpacing: "0.15em",
						textTransform: "uppercase",
					}}
				>
					the
				</span>
				<span className="font-extrabold tracking-tight text-indigo-600 dark:text-indigo-300">
					PORTMAN
				</span>{" "}
				made my portfolio launch effortless and beautiful. The AI insights were a
				game changer!
			</span>
		),
	},
	{
		name: "John Smith",
		title: "Software Engineer",
		avatar: "https://randomuser.me/api/portraits/men/32.jpg",
		quote: "I loved the 3D visuals and instant preview. My site looks like a Dribbble shot!",
	},
	{
		name: "Ava Lee",
		title: "UX Researcher",
		avatar: "https://randomuser.me/api/portraits/women/65.jpg",
		quote: "The template selection and customization were so smooth. Highly recommended!",
	},
];

function PortfolioTestimonials() {
	return (
		<section className="w-full max-w-5xl mx-auto py-16">
			{/* Trusted by section */}
			<div className="flex flex-col items-center mb-10">
				<span className="uppercase text-xs font-bold tracking-widest text-gray-400 mb-2">
					Trusted by professionals at
				</span>
				<div className="flex flex-wrap gap-6 justify-center items-center">
					<Image
						src="/file.svg"
						alt="TechCorp"
						width={32}
						height={32}
						className="h-8 w-auto opacity-80"
						priority
					/>
					<Image
						src="/globe.svg"
						alt="Designify"
						width={32}
						height={32}
						className="h-8 w-auto opacity-80"
						priority
					/>
					<Image
						src="/window.svg"
						alt="WebWorks"
						width={32}
						height={32}
						className="h-8 w-auto opacity-80"
						priority
					/>
				</div>
			</div>
			<div className="grid grid-cols-1 md:grid-cols-3 gap-8 animate-fade-in-up">
				{testimonials.map((t) => (
					<GlassCard
						key={t.name}
						className="flex flex-col items-center text-center p-8 focus-within:ring-4 focus-within:ring-indigo-300 outline-none"
						tabIndex={0}
						aria-label={`Testimonial from ${t.name}, ${t.title}`}
					>
						<Image
							src={t.avatar}
							alt={t.name}
							width={64}
							height={64}
							className="w-16 h-16 rounded-full mb-4 shadow-lg"
							priority
						/>
						<blockquote
							className="italic text-lg mb-2"
							aria-label="Testimonial"
						>
							“{t.quote}”
						</blockquote>
						<span className="font-bold text-indigo-600 dark:text-indigo-400">
							{t.name}
						</span>
						<span className="text-xs text-gray-500 dark:text-gray-400 mb-2">
							{t.title}
						</span>
						<div
							className="flex gap-1 justify-center mt-2"
							aria-label="5 star rating"
						>
							{Array.from({ length: 5 }).map((_, i) => (
								<span
									key={i}
									className="text-yellow-400 text-lg"
									role="img"
									aria-label="star"
								>
									★
								</span>
							))}
						</div>
						<div className="flex gap-2 justify-center mt-3">
							<Image
								src="/file.svg"
								alt="TechCorp logo"
								width={24}
								height={24}
								className="h-6 w-auto opacity-70"
							/>
							<Image
								src="/globe.svg"
								alt="Designify logo"
								width={24}
								height={24}
								className="h-6 w-auto opacity-70"
							/>
						</div>
					</GlassCard>
				))}
			</div>
		</section>
	);
}

export default memo(PortfolioTestimonials);
