"use client";
import React, { memo } from "react";
import { Dialog, Transition } from "@headlessui/react";
import { motion } from "framer-motion";
import GlassCard from "@/components/GlassCard";
import { FaUser, FaGraduationCap, FaBriefcase, FaProjectDiagram, FaLink, FaStar } from "react-icons/fa";

interface PortfolioDataModalProps {
  open: boolean;
  onClose: () => void;
  data: Record<string, any>;
}

function PortfolioDataModal({ open, onClose, data }: PortfolioDataModalProps) {
  // Grouped data for display
  const sections = [
    { key: "personal", label: "Personal Info", icon: <FaUser />, fields: [
      { label: "Name", value: data?.name },
      { label: "Email", value: data?.email },
      { label: "Phone", value: data?.phone },
      { label: "Address", value: data?.address },
      { label: "Summary", value: data?.summary },
    ].filter(f => f.value) },
    { key: "skills", label: "Skills", icon: <FaStar />, fields: [
      { label: "Skills", value: Array.isArray(data?.skills) ? data.skills.join(", ") : data?.skills },
      { label: "Languages", value: Array.isArray(data?.languages) ? data.languages.join(", ") : data?.languages },
      { label: "Certifications", value: Array.isArray(data?.certifications) ? data.certifications.join(", ") : data?.certifications },
    ].filter(f => f.value) },
    { key: "education", label: "Education", icon: <FaGraduationCap />, fields: Array.isArray(data?.education) ? data.education.map((edu: any, i: number) => ({
      label: `${edu.degree || "Degree"} @ ${edu.institution || "Institution"}`,
      value: `${edu.field || "Field"} (${edu.year || "Year"})${edu.gpa ? `, GPA: ${edu.gpa}` : ""}`
    })) : [] },
    { key: "experience", label: "Experience", icon: <FaBriefcase />, fields: Array.isArray(data?.experience) ? data.experience.map((exp: any, i: number) => ({
      label: `${exp.position || "Position"} @ ${exp.company || "Company"}`,
      value: `${exp.duration || "Duration"} — ${exp.description || ""}`
    })) : [] },
    { key: "projects", label: "Projects", icon: <FaProjectDiagram />, fields: Array.isArray(data?.projects) ? data.projects.map((proj: any, i: number) => ({
      label: proj.name || `Project ${i+1}`,
      value: `${proj.description || ""}${proj.technologies ? ` | Tech: ${proj.technologies.join(", ")}` : ""}`
    })) : [] },
    { key: "links", label: "Links", icon: <FaLink />, fields: Array.isArray(data?.links) ? data.links.map((l: string) => ({ label: l, value: l })) : [] },
  ];

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
                  <button
                    onClick={onClose}
                    className="ml-2 p-2 rounded-full hover:bg-indigo-100 dark:hover:bg-indigo-800 transition focus:outline-none focus-visible:ring-2 focus-visible:ring-indigo-500 focus-visible:ring-offset-2 focus-visible:ring-offset-white dark:focus-visible:ring-offset-gray-900 text-gray-600 dark:text-gray-300 hover:text-red-500"
                    autoFocus
                  >
                    <span className="sr-only">Close</span>
                    <svg width="24" height="24" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" /></svg>
                  </button>
                </div>
                {/* AI summary at the top if available */}
                {data?.summary && (
                  <div className="px-6 pt-4 pb-2 text-indigo-700 dark:text-indigo-200 text-base italic border-b border-indigo-100 dark:border-indigo-800 bg-indigo-50/40 dark:bg-indigo-900/30">
                    <span className="font-semibold">AI Summary:</span> {data.summary}
                  </div>
                )}
                {/* All sections in a single scrollable view */}
                <div className="p-6 overflow-y-auto max-h-[60vh] sm:max-h-[70vh] min-h-[120px] focus:outline-none space-y-8" tabIndex={-1}>
                  {sections.map((section, idx) => (
                    section.fields.length > 0 && (
                      <motion.div
                        key={section.key}
                        initial={{ opacity: 0, y: 30 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.3, delay: idx * 0.07 }}
                        className=""
                      >
                        <div className="flex items-center gap-2 mb-2">
                          <span className="text-lg text-indigo-600 dark:text-indigo-300">{section.icon}</span>
                          <span className="font-semibold text-indigo-700 dark:text-indigo-200 text-lg">{section.label}</span>
                        </div>
                        <div className="grid grid-cols-1 gap-3">
                          {section.fields.map((field, i) => (
                            <GlassCard key={i} className="w-full animate-fade-in-up">
                              <div className="text-xs font-semibold text-indigo-500 uppercase mb-1 tracking-wide">{field.label}</div>
                              <div className="text-base text-gray-900 dark:text-gray-100 font-medium break-words whitespace-pre-line">{field.value}</div>
                            </GlassCard>
                          ))}
                        </div>
                      </motion.div>
                    )
                  ))}
                  {/* If no data at all */}
                  {sections.every(s => s.fields.length === 0) && (
                    <div className="text-gray-400 text-center py-8">No data available.</div>
                  )}
                </div>
              </div>
            </motion.div>
          </Transition.Child>
        </div>
      </Dialog>
    </Transition.Root>
  );
}

export default memo(PortfolioDataModal);
