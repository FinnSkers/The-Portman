"use client";
import { useState } from "react";
import Image from "next/image";
import { motion } from "framer-motion";

const tabs = [
	{ label: "Dashboard", icon: "/8bit-dashboard.png" },
	{ label: "Profile", icon: "/8bit-profile.png" },
	{ label: "Settings", icon: "/8bit-settings.png" },
];

export default function DashboardTabs() {
	const [active, setActive] = useState(0);
	return (
		<section className="w-full max-w-3xl mx-auto mt-16 mb-12 bg-black border-4 border-green-400 rounded-lg shadow-2xl pixelated p-6">
			<nav className="flex justify-center gap-4 mb-8">
				{tabs.map((tab, idx) => (
					<button
						key={tab.label}
						className={`flex flex-col items-center px-4 py-2 rounded-lg border-2 pixelated font-bold text-green-300 transition-colors duration-150 ${
							active === idx
								? "bg-green-400 text-black border-pink-400"
								: "bg-black border-green-400 hover:bg-green-900"
						}`}
						onClick={() => setActive(idx)}
						aria-current={active === idx ? "page" : undefined}
					>
						<Image
							src={tab.icon}
							alt=""
							width={32}
							height={32}
							className="mb-1 pixelated"
						/>
						{tab.label}
					</button>
				))}
			</nav>
			<motion.div
				key={active}
				initial={{ opacity: 0, y: 20 }}
				animate={{ opacity: 1, y: 0 }}
				transition={{ duration: 0.3 }}
				className="text-green-200 text-center pixelated min-h-[120px]"
			>
				{active === 0 && (
					<div>
						Welcome to your <b>8-bit Dashboard</b>! (Add widgets, stats, and
						quick actions here.)
					</div>
				)}
				{active === 1 && (
					<div>
						This is your <b>Profile</b>. (Show user info, avatar, and editable
						fields.)
					</div>
				)}
				{active === 2 && (
					<div>
						Here are your <b>Settings</b>. (Add toggles, preferences, and account
						controls.)
					</div>
				)}
			</motion.div>
		</section>
	);
}
