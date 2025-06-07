"use client";
import React from "react";
import { useCVStore, CVState } from "@/store/useCVStore";
import { motion } from "framer-motion";
import GlassCard from "@/components/GlassCard";

export default function PortfolioPreview() {
  const data = useCVStore((state: CVState) => state.data);
  const status = useCVStore((state: CVState) => state.status);
  if (status !== 'parsed' || !data) return null;
  const parsed = (data.parsed_data || data) as Record<string, any>;

  const cardVariants = {
    hidden: { opacity: 0, y: 40 },
    visible: (i: number) => ({ opacity: 1, y: 0, transition: { delay: i * 0.12 } })
  };

  const fields = [
    { label: 'Name', value: parsed?.name },
    { label: 'Email', value: parsed?.email },
    { label: 'Phone', value: parsed?.phone },
    { label: 'Address', value: parsed?.address },
    { label: 'Summary', value: parsed?.summary },
    { label: 'Skills', value: Array.isArray(parsed?.skills) ? parsed.skills.join(', ') : parsed?.skills },
    // ...add more fields as needed
  ];

  return (
    <GlassCard>
      <motion.div
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
