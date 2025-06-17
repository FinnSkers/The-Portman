import { Swiper, SwiperSlide } from "swiper/react";
import { Pagination, Autoplay } from "swiper/modules";
import Image from "next/image";
import "swiper/css";
import "swiper/css/pagination";

const portfolios = [
  {
    name: "Pixel Portfolio",
    url: "#",
    image: "/8bit-portfolio1.png", // Placeholder
    description: "A playful 8-bit themed portfolio for a game developer.",
  },
  {
    name: "Retro Resume",
    url: "#",
    image: "/8bit-portfolio2.png", // Placeholder
    description: "Classic pixel art resume for a creative designer.",
  },
  {
    name: "Tech Showcase",
    url: "#",
    image: "/8bit-portfolio3.png", // Placeholder
    description: "Showcase of projects and skills in a fun retro style.",
  },
];

export default function PortfolioCarousel() {
  return (
    <section className="w-full max-w-4xl mx-auto mt-16 mb-12">
      <h2 className="text-2xl md:text-3xl font-bold text-green-300 text-center mb-6 pixelated">
        AI-Generated Portfolios
      </h2>
      <Swiper
        modules={[Pagination, Autoplay]}
        pagination={{ clickable: true }}
        autoplay={{ delay: 4000, disableOnInteraction: false }}
        loop
        className="rounded-lg border-4 border-green-400 bg-black shadow-xl pixelated"
      >
        {portfolios.map((p) => (
          <SwiperSlide key={p.name}>
            <a href={p.url} target="_blank" rel="noopener noreferrer" className="block group">
              <div className="flex flex-col md:flex-row items-center gap-6 p-8">
                <Image src={p.image} alt={p.name} width={180} height={120} className="rounded-lg border-2 border-pink-400 pixelated group-hover:scale-105 transition-transform duration-200" />
                <div>
                  <h3 className="text-xl font-bold text-green-200 mb-2 pixelated">{p.name}</h3>
                  <p className="text-green-100 text-sm pixelated">{p.description}</p>
                </div>
              </div>
            </a>
          </SwiperSlide>
        ))}
      </Swiper>
    </section>
  );
}
