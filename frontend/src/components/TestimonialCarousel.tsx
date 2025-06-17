"use client";
import { Swiper, SwiperSlide } from "swiper/react";
import { Pagination, Autoplay, EffectFade } from "swiper/modules";
import Image from "next/image";
import { motion } from "framer-motion";
import "swiper/css";
import "swiper/css/pagination";
import "swiper/css/effect-fade";

const testimonials = [
	{
		name: "Alex R.",
		role: "Software Developer",
		text: "Portman made my resume stand out and helped me land interviews! The 8-bit UI is so fun.",
		avatar: "/8bit-avatar1.png", // Placeholder
		rating: 5,
	},
	{
		name: "Jamie L.",
		role: "UX Designer",
		text: "The AI-powered portfolio builder is next-level. I love the retro vibe!",
		avatar: "/8bit-avatar2.png", // Placeholder
		rating: 5,
	},
	{
		name: "Taylor S.",
		role: "Marketing Manager",
		text: "RAG insights gave me a real edge in my job search. Highly recommend!",
		avatar: "/8bit-avatar3.png", // Placeholder
		rating: 5,
	},
];

export default function TestimonialCarousel() {
	return (
		<motion.div
			initial={{ opacity: 0, y: 30 }}
			whileInView={{ opacity: 1, y: 0 }}
			viewport={{ once: true }}
			transition={{ duration: 0.7 }}
			className="w-full max-w-4xl mx-auto my-16 px-2"
		>
			<div className="glass rounded-3xl shadow-2xl p-8 md:p-12 overflow-hidden relative">
				{/* Background decoration */}
				<div className="absolute top-0 right-0 w-32 h-32 bg-gradient-to-br from-pink-400/20 to-transparent rounded-full blur-2xl"></div>
				<div className="absolute bottom-0 left-0 w-24 h-24 bg-gradient-to-tr from-green-400/20 to-transparent rounded-full blur-xl"></div>

				<motion.h2
					initial={{ opacity: 0, y: -20 }}
					whileInView={{ opacity: 1, y: 0 }}
					viewport={{ once: true }}
					transition={{ delay: 0.2 }}
					className="text-3xl md:text-4xl font-8bit text-center gradient-text mb-8 tracking-wide relative z-10"
				>
					What Users Say
				</motion.h2>

				<Swiper
					modules={[Pagination, Autoplay, EffectFade]}
					pagination={{
						clickable: true,
						bulletClass: "swiper-pagination-bullet bg-green-400",
						bulletActiveClass: "swiper-pagination-bullet-active bg-pink-400",
					}}
					autoplay={{ delay: 4000, disableOnInteraction: false }}
					effect="fade"
					fadeEffect={{ crossFade: true }}
					loop
					className="w-full relative z-10"
				>
					{testimonials.map((testimonial, idx) => (
						<SwiperSlide key={testimonial.name}>
							<motion.div
								initial={{ opacity: 0, scale: 0.9 }}
								animate={{ opacity: 1, scale: 1 }}
								transition={{ duration: 0.5, delay: idx * 0.1 }}
								className="flex flex-col items-center gap-6 px-4 py-8"
							>
								{/* Avatar with glow effect */}
								<div className="relative">
									<div className="w-24 h-24 rounded-full overflow-hidden border-4 border-green-400 glow shadow-lg">
										<Image
											src={testimonial.avatar}
											alt={testimonial.name}
											width={96}
											height={96}
											className="w-full h-full object-cover"
										/>
									</div>
									<div className="absolute -bottom-2 -right-2 bg-green-400 rounded-full p-1">
										<div className="w-6 h-6 bg-black rounded-full flex items-center justify-center">
											<span className="text-green-400 text-xs font-8bit">✓</span>
										</div>
									</div>
								</div>

								{/* Rating stars */}
								<div className="flex gap-1 mb-2">
									{[...Array(testimonial.rating)].map((_, i) => (
										<span key={i} className="text-yellow-400 text-lg">
											★
										</span>
									))}
								</div>

								{/* Testimonial text */}
								<blockquote className="text-green-100 text-center text-lg md:text-xl font-sans font-medium max-w-2xl leading-relaxed">
									&quot;{testimonial.text}&quot;
								</blockquote>

								{/* Name and role */}
								<div className="text-center">
									<div className="text-green-400 font-8bit text-lg mb-1">
										{testimonial.name}
									</div>
									<div className="text-green-300 font-sans text-sm">
										{testimonial.role}
									</div>
								</div>
							</motion.div>
						</SwiperSlide>
					))}
				</Swiper>
			</div>
		</motion.div>
	);
}
