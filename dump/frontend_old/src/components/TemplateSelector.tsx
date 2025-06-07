"use client";
import React from "react";
import { motion } from "framer-motion";
import GlassCard from "@/components/GlassCard";

const templates = [
	{ name: "Modern", color: "bg-blue-500" },
	{ name: "Classic", color: "bg-green-500" },
	{ name: "Minimal", color: "bg-gray-500" },
];

export default function TemplateSelector({ onSelect }: { onSelect: (name: string) => void }) {
	return (
		<GlassCard className="w-full max-w-2xl mx-auto mt-8 flex flex-col items-center">
			<motion.div
				className="w-full flex flex-col items-center"
				initial={{ opacity: 0, y: 40 }}
				animate={{ opacity: 1, y: 0 }}
				transition={{ duration: 0.5 }}
			>
				<h2 className="text-2xl font-semibold mb-4 text-gray-800 dark:text-gray-100">
					<span className="animated-icon">🎨</span> Choose a Template
				</h2>
				<div className="flex gap-6">
					{templates.map((tpl) => (
						<button
							key={tpl.name}
							className={`w-32 h-40 rounded-lg shadow-lg flex flex-col items-center justify-center text-white font-bold text-lg ${tpl.color} hover:scale-105 transition-transform ripple`}
							onClick={() => onSelect(tpl.name)}
							aria-label={`Select ${tpl.name} template`}
						>
							{tpl.name}
						</button>
					))}
				</div>
			</motion.div>
		</GlassCard>
	);
}
