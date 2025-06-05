"use client";
import React from "react";
import { Dialog, Transition } from "@headlessui/react";
import { motion, AnimatePresence } from "framer-motion";
import GlassCard from "@/components/GlassCard";

interface PortfolioDataModalProps {
  open: boolean;
  onClose: () => void;
  data: Record<string, any>;
}

export default function PortfolioDataModal({ open, onClose, data }: PortfolioDataModalProps) {
  // Sectioned data for tabs/timeline/cards
  const sections = [
    { key: "personal", label: "Personal Info", fields: [
      { label: "Name", value: data?.name },
      { label: "Email", value: data?.email },
      { label: "Phone", value: data?.phone },
      { label: "Address", value: data?.address },
      { label: "Summary", value: data?.summary },
    ].filter(f => f.value) },
    { key: "skills", label: "Skills", fields: [
      { label: "Skills", value: Array.isArray(data?.skills) ? data.skills.join(", ") : data?.skills },
      { label: "Languages", value: Array.isArray(data?.languages) ? data.languages.join(", ") : data?.languages },
      { label: "Certifications", value: Array.isArray(data?.certifications) ? data.certifications.join(", ") : data?.certifications },
    ].filter(f => f.value) },
    { key: "education", label: "Education", fields: Array.isArray(data?.education) ? data.education.map((edu: any, i: number) => ({
      label: `${edu.degree || "Degree"} @ ${edu.institution || "Institution"}`,
      value: `${edu.field || "Field"} (${edu.year || "Year"})${edu.gpa ? `, GPA: ${edu.gpa}` : ""}`
    })) : [] },
    { key: "experience", label: "Experience", fields: Array.isArray(data?.experience) ? data.experience.map((exp: any, i: number) => ({
      label: `${exp.position || "Position"} @ ${exp.company || "Company"}`,
      value: `${exp.duration || "Duration"} — ${exp.description || ""}`
    })) : [] },
    { key: "projects", label: "Projects", fields: Array.isArray(data?.projects) ? data.projects.map((proj: any, i: number) => ({
      label: proj.name || `Project ${i+1}`,
      value: `${proj.description || ""}${proj.technologies ? ` | Tech: ${proj.technologies.join(", ")}` : ""}`
    })) : [] },
    { key: "links", label: "Links", fields: Array.isArray(data?.links) ? data.links.map((l: string) => ({ label: l, value: l })) : [] },
  ];

  const [tab, setTab] = React.useState(0);
  React.useEffect(() => { if (open) setTab(0); }, [open]);

  return (
    <Transition.Root show={open} as={React.Fragment}>
      <Dialog as="div" className="fixed z-50 inset-0 overflow-y-auto" onClose={onClose}>
        <div className="flex items-center justify-center min-h-screen px-4 text-center">
          <Transition.Child
            as={React.Fragment}
            enter="ease-out duration-300" enterFrom="opacity-0" enterTo="opacity-100"
            leave="ease-in duration-200" leaveFrom="opacity-100" leaveTo="opacity-0"
          >
            <div className="fixed inset-0 bg-black/40 backdrop-blur-sm transition-all" aria-hidden="true" />
          </Transition.Child>
          <span className="inline-block align-middle h-screen" aria-hidden="true">&#8203;</span>
          <Transition.Child
            as={React.Fragment}
            enter="ease-out duration-300" enterFrom="opacity-0 scale-95" enterTo="opacity-100 scale-100"
            leave="ease-in duration-200" leaveFrom="opacity-100 scale-100" leaveTo="opacity-0 scale-95"
          >
            <motion.div
              className="inline-block w-full max-w-2xl p-0 my-8 align-middle transition-all transform bg-white/90 dark:bg-gray-900/90 shadow-xl rounded-2xl border border-indigo-200 dark:border-indigo-800 glass"
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.95 }}
            >
              <div className="flex flex-col">
                <div className="flex items-center justify-between px-6 pt-6 pb-2 border-b border-indigo-100 dark:border-indigo-800">
                  <h3 className="text-xl font-bold text-indigo-700 dark:text-indigo-200 flex items-center gap-2">
                    <span className="text-2xl">🗂️</span> CV Data Viewer
                  </h3>
                  <button onClick={onClose} className="ml-2 p-2 rounded-full hover:bg-indigo-100 dark:hover:bg-indigo-800 transition">
                    <span className="sr-only">Close</span>
                    <svg width="24" height="24" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" /></svg>
                  </button>
                </div>
                {/* Tabs */}
                <div className="flex gap-2 px-6 pt-4 pb-2 border-b border-indigo-100 dark:border-indigo-800">
                  {sections.map((s, i) => (
                    <button
                      key={s.key}
                      className={`px-3 py-1 rounded-full font-semibold text-sm transition-all ${tab === i ? 'bg-indigo-600 text-white shadow' : 'bg-indigo-100 dark:bg-indigo-800 text-indigo-700 dark:text-indigo-200 hover:bg-indigo-200 dark:hover:bg-indigo-700'}`}
                      onClick={() => setTab(i)}
                    >
                      {s.label}
                    </button>
                  ))}
                </div>
                {/* Section content */}
                <div className="p-6 overflow-y-auto max-h-[60vh]">
                  <AnimatePresence mode="wait">
                    <motion.div
                      key={tab}
                      initial={{ opacity: 0, y: 30 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0, y: 30 }}
                      transition={{ duration: 0.3 }}
                      className="grid grid-cols-1 gap-4"
                    >
                      {sections[tab].fields.length === 0 && (
                        <div className="text-gray-400 text-center py-8">No data available.</div>
                      )}
                      {sections[tab].fields.map((field, i) => (
                        <GlassCard key={i} className="w-full animate-fade-in-up">
                          <div className="text-xs font-semibold text-indigo-500 uppercase mb-1 tracking-wide">{field.label}</div>
                          <div className="text-base text-gray-900 dark:text-gray-100 font-medium break-words whitespace-pre-line">{field.value}</div>
                        </GlassCard>
                      ))}
                    </motion.div>
                  </AnimatePresence>
                </div>
              </div>
            </motion.div>
          </Transition.Child>
        </div>
      </Dialog>
    </Transition.Root>
  );
}
