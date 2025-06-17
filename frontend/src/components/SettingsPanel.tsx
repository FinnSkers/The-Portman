"use client";
import { useState } from "react";
import { motion } from "framer-motion";

type ToggleKey = "darkMode" | "emailAlerts" | "pixelAnims";

const settings = [
	{ label: "Dark Mode", desc: "Toggle 8-bit dark mode.", key: "darkMode" },
	{
		label: "Email Alerts",
		desc: "Get notified about new features.",
		key: "emailAlerts",
	},
	{
		label: "Pixel Animations",
		desc: "Enable/disable animated effects.",
		key: "pixelAnims",
	},
];

export default function SettingsPanel() {
	const [toggles, setToggles] = useState<{ [K in ToggleKey]: boolean }>({
		darkMode: true,
		emailAlerts: false,
		pixelAnims: true,
	});
	return (
		<section className="w-full max-w-md mx-auto mt-16 mb-12 bg-black border-4 border-green-400 rounded-lg shadow-2xl pixelated p-6">
			<h3 className="text-xl font-bold text-green-200 mb-4 pixelated">
				Settings
			</h3>
			<ul className="flex flex-col gap-4">
				{settings.map((s) => (
					<li key={s.key} className="flex items-center justify-between">
						<div>
							<span className="text-green-300 font-bold pixelated">
								{s.label}
							</span>
							<p className="text-green-100 text-xs pixelated">
								{s.desc}
							</p>
						</div>
						<motion.button
							whileTap={{ scale: 0.9 }}
							className={`w-12 h-7 rounded-full border-2 border-pink-400 flex items-center transition-colors duration-150 ${
								toggles[s.key as ToggleKey] ? "bg-green-400" : "bg-black"
							}`}
							aria-pressed={toggles[s.key as ToggleKey]}
							onClick={() =>
								setToggles((t) => ({
									...t,
									[s.key as ToggleKey]: !t[s.key as ToggleKey],
								}))
							}
						>
							<span
								className={`block w-5 h-5 rounded-full bg-pink-400 border-2 border-green-400 transition-transform duration-150 ${
									toggles[s.key as ToggleKey]
										? "translate-x-5"
										: "translate-x-0"
								}`}
							></span>
						</motion.button>
					</li>
				))}
			</ul>
		</section>
	);
}
