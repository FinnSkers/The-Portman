"use client";
import React from "react";
import GlassCard from "./GlassCard";

const testimonials = [
  {
    name: "Jane Doe",
    title: "Product Designer",
    avatar: "https://randomuser.me/api/portraits/women/44.jpg",
    quote: (
      <span>
        <span className="text-xs font-mono font-bold text-gray-500 dark:text-gray-400 mr-1 align-super tracking-widest" style={{ fontSize: "0.7em", letterSpacing: "0.15em", textTransform: "uppercase" }}>
          the
        </span>
        <span className="font-extrabold tracking-tight text-indigo-600 dark:text-indigo-300">PORTMAN</span> made my portfolio launch effortless and beautiful. The AI insights were a game changer!
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

export default function PortfolioTestimonials() {
  return (
    <section className="w-full max-w-5xl mx-auto py-16 grid grid-cols-1 md:grid-cols-3 gap-8 animate-fade-in-up">
      {testimonials.map((t) => (
        <GlassCard key={t.name} className="flex flex-col items-center text-center p-8">
          <img src={t.avatar} alt={t.name} className="w-16 h-16 rounded-full mb-4 shadow-lg" />
          <blockquote className="italic text-lg mb-2">“{t.quote}”</blockquote>
          <span className="font-bold text-indigo-600 dark:text-indigo-400">{t.name}</span>
          <span className="text-xs text-gray-500 dark:text-gray-400">{t.title}</span>
        </GlassCard>
      ))}
    </section>
  );
}
