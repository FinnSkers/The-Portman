"use client";
import React, { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import GlassCard from "./GlassCard";
import Image from "next/image";

const templates = [
	{
		name: "Modern Tech",
		image: "/file.svg",
		description: "Bold, animated, and perfect for tech professionals.",
	},
	{
		name: "Creative Designer",
		image: "/globe.svg",
		description: "Showcase your work with style and animation.",
	},
	{
		name: "Minimal Portfolio",
		image: "/window.svg",
		description: "Simple, elegant, and content-focused.",
	},
];

export default function TemplateShowcaseCarousel() {
	const [index, setIndex] = useState(0);
	const next = () => setIndex((i) => (i + 1) % templates.length);
	const prev = () => setIndex((i) => (i - 1 + templates.length) % templates.length);

	return (
		<section className="w-full max-w-3xl mx-auto py-12 flex flex-col items-center animate-fade-in-up">
			<h2 className="text-2xl font-bold mb-6 text-center">Animated Template Showcase</h2>
			<div className="relative w-full flex items-center justify-center">
				<button
					onClick={prev}
					className="absolute left-0 z-10 bg-white/80 dark:bg-gray-900/80 rounded-full p-2 shadow hover:bg-indigo-100 dark:hover:bg-gray-800 transition"
				>
					&#8592;
				</button>
				<AnimatePresence mode="wait">
					<motion.div
						key={templates[index].name}
						initial={{ opacity: 0, x: 80 }}
						animate={{ opacity: 1, x: 0 }}
						exit={{ opacity: 0, x: -80 }}
						transition={{ duration: 0.5 }}
						className="w-full"
					>
						<GlassCard className="flex flex-col items-center p-8">
							<Image
								src={templates[index].image}
								alt={templates[index].name}
								width={96}
								height={96}
								className="w-24 h-24 mb-4"
								priority
							/>
							<h3 className="text-xl font-bold mb-2">{templates[index].name}</h3>
							<p className="text-gray-600 dark:text-gray-300">{templates[index].description}</p>
						</GlassCard>
					</motion.div>
				</AnimatePresence>
				<button
					onClick={next}
					className="absolute right-0 z-10 bg-white/80 dark:bg-gray-900/80 rounded-full p-2 shadow hover:bg-indigo-100 dark:hover:bg-gray-800 transition"
				>
					&#8594;
				</button>
			</div>
		</section>
	);
}

// Replace all <img ...> with <Image ...> for static and dynamic images
// Example:
// <Image src="/file.svg" alt="File" width={96} height={96} className="w-24 h-24 mb-4" priority />
