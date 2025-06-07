"use client";
import React from "react";
import { useCVStore } from "@/store/useCVStore";
import { motion } from "framer-motion";
import GlassCard from "@/components/GlassCard";

export default function PortfolioPreview() {
  const { data, status } = useCVStore();
  if (status !== 'parsed' || !data) return null;
  const parsed = (data.parsed_data || data) as Record<string, any>; // fallback for different API responses

  // Helper to animate each card
  const cardVariants = {
    hidden: { opacity: 0, y: 40 },
    visible: (i: number) => ({ opacity: 1, y: 0, transition: { delay: i * 0.12 } })
  };

  // Prepare fields for display
  const fields = [
    { label: 'Name', value: parsed?.name },
    { label: 'Email', value: parsed?.email },
    { label: 'Phone', value: parsed?.phone },
    { label: 'Address', value: parsed?.address },
    { label: 'Summary', value: parsed?.summary },
    { label: 'Skills', value: Array.isArray(parsed?.skills) ? parsed.skills.join(', ') : parsed?.skills },
    { label: 'Languages', value: Array.isArray(parsed?.languages) ? parsed.languages.join(', ') : parsed?.languages },
    { label: 'Certifications', value: Array.isArray(parsed?.certifications) ? parsed.certifications.join(', ') : parsed?.certifications },
    { label: 'Links', value: Array.isArray(parsed?.links) ? parsed.links.join(', ') : parsed?.links },
    { label: 'Education', value: parsed?.education },
    { label: 'Experience', value: parsed?.experience },
  ].filter(f => f.value);

  return (
    <GlassCard id="portfolio-preview" className="w-full max-w-2xl mx-auto mt-8 p-6">
      <motion.div
        className="w-full"
        initial={{ opacity: 0, y: 40 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
      >
        <h2 className="text-2xl font-semibold mb-4 text-gray-800 dark:text-gray-100">
          <span className="animated-icon">🖼️</span> CV Data Preview
        </h2>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {fields.map((field, i) => (
            <motion.div
              key={field.label}
              className="bg-white/80 dark:bg-gray-900/80 rounded-lg shadow p-4 border border-indigo-100 dark:border-indigo-900"
              custom={i}
              initial="hidden"
              animate="visible"
              variants={cardVariants}
            >
              <div className="text-xs font-semibold text-indigo-500 uppercase mb-1 tracking-wide">{field.label}</div>
              <div className="text-base text-gray-900 dark:text-gray-100 font-medium">
                {field.value}
              </div>
            </motion.div>
          ))}
        </div>
      </motion.div>
    </GlassCard>
  );
}
