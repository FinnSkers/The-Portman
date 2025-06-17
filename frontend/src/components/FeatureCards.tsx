"use client";
import { motion } from "framer-motion";
import Image from "next/image";
import { useState } from "react";

const features = [
	{
		title: "CV Parsing",
		description: "Extract structured data from any file type.",
		icon: "/8bit-cv.png", // Placeholder, replace with 8-bit icon
	},
	{
		title: "RAG Insights",
		description: "Professional comparison & benchmarking.",
		icon: "/8bit-rag.png", // Placeholder, replace with 8-bit icon
	},
	{
		title: "ATS Optimization",
		description: "Generate ATS-friendly resume versions.",
		icon: "/8bit-ats.png", // Placeholder, replace with 8-bit icon
	},
	{
		title: "Portfolio Generation",
		description: "Create stunning, customizable portfolios.",
		icon: "/8bit-portfolio.png", // Placeholder, replace with 8-bit icon
	},
	{
		title: "Career Recommendations",
		description: "AI-driven career guidance.",
		icon: "/8bit-career.png", // Placeholder, replace with 8-bit icon
	},
];

const Card = ({
	feature,
	idx,
}: {
	feature: typeof features[0];
	idx: number;
}) => {
	const [isHovered, setIsHovered] = useState(false);

	return (
		<motion.div
			initial={{ opacity: 0, y: 40 }}
			whileInView={{ opacity: 1, y: 0 }}
			viewport={{ once: true, margin: "-50px" }}
			transition={{ delay: idx * 0.1, type: "spring", stiffness: 100 }}
			whileHover={{
				scale: 1.05,
				transition: { duration: 0.2 },
			}}
			onHoverStart={() => setIsHovered(true)}
			onHoverEnd={() => setIsHovered(false)}
			className="relative overflow-hidden"
			style={{ perspective: "1000px" }}
		>
			<div
				className={`
          bg-black/80 glass border-2 rounded-2xl p-8 flex flex-col items-center shadow-2xl
          transition-all duration-300 h-full
          ${
						isHovered
							? "border-pink-400 glow-pink"
							: "border-green-400"
					}
        `}
				style={{
					transform: isHovered
						? "perspective(1000px) rotateY(5deg) rotateX(5deg)"
						: "perspective(1000px) rotateY(0) rotateX(0)",
					transformStyle: "preserve-3d",
					transition: "transform 0.3s ease",
				}}
			>
				{/* Background animations */}
				<div
					className={`absolute inset-0 bg-gradient-to-br from-black to-transparent z-0 transition-opacity duration-300 rounded-2xl ${
						isHovered ? "opacity-80" : "opacity-0"
					}`}
				></div>

				{/* Icon */}
				<motion.div
					animate={{ y: isHovered ? [-3, 3, -3] : 0 }}
					transition={{
						repeat: isHovered ? Infinity : 0,
						duration: 2,
					}}
					className={`
            mb-6 flex items-center justify-center w-20 h-20 bg-black rounded-full 
            border-2 transition-colors duration-300 z-10
            ${
							isHovered
								? "border-pink-400"
								: "border-green-400"
						}
          `}
				>
					<Image
						src={feature.icon}
						alt={feature.title + " icon"}
						width={48}
						height={48}
						className="pixelated"
					/>
				</motion.div>

				{/* Title */}
				<h3
					className={`
          text-2xl font-8bit text-center tracking-wide mb-3 z-10 transition-colors duration-300
          ${
						isHovered
							? "text-pink-400"
							: "text-green-400"
					}
        `}
				>
					{feature.title}
				</h3>

				{/* Description */}
				<p className="text-green-100 text-center text-base font-sans font-medium z-10">
					{feature.description}
				</p>

				{/* Action button that appears on hover */}
				<motion.button
					initial={{ opacity: 0, y: 20 }}
					animate={{
						opacity: isHovered ? 1 : 0,
						y: isHovered ? 0 : 10,
					}}
					transition={{ duration: 0.2 }}
					className="mt-4 px-4 py-2 font-8bit text-sm text-black bg-green-400 rounded hover:bg-pink-400 transition-colors duration-200 focus:outline-none z-10"
				>
					Learn More
				</motion.button>
			</div>
		</motion.div>
	);
};

export default function FeatureCards() {
	return (
		<div>
			<motion.h2
				initial={{ opacity: 0, y: -20 }}
				whileInView={{ opacity: 1, y: 0 }}
				viewport={{ once: true }}
				className="text-3xl md:text-4xl font-8bit text-center gradient-text mb-12"
			>
				Key Features
			</motion.h2>
			<div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8 mt-8">
				{features.map((feature, idx) => (
					<Card key={feature.title} feature={feature} idx={idx} />
				))}
			</div>
		</div>
	);
}
