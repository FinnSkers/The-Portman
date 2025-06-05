"use client";
import React from "react";
import { Dialog, Transition } from "@headlessui/react";
import { motion } from "framer-motion";
import GlassCard from "@/components/GlassCard";
import { FaChartBar, FaUserTie, FaLightbulb, FaUsers, FaCheckCircle } from "react-icons/fa";

interface AnalysisReportModalProps {
  open: boolean;
  onClose: () => void;
  report: any;
}

export default function AnalysisReportModal({ open, onClose, report }: AnalysisReportModalProps) {
  if (!report) return null;
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
              className="inline-block align-middle bg-white dark:bg-zinc-900 rounded-2xl shadow-2xl p-0 w-full max-w-2xl overflow-hidden border border-zinc-200 dark:border-zinc-800"
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.95 }}
              transition={{ duration: 0.3 }}
            >
              <GlassCard className="p-0 bg-gradient-to-br from-blue-50/80 to-purple-50/60 dark:from-zinc-900/80 dark:to-zinc-800/60">
                <div className="px-8 py-6">
                  <div className="flex items-center gap-3 mb-4">
                    <FaChartBar className="text-2xl text-blue-500" />
                    <h2 className="text-2xl font-bold tracking-tight">AI Analysis Report</h2>
                  </div>
                  <div className="space-y-4 max-h-[60vh] overflow-y-auto pr-2">
                    <section>
                      <h3 className="font-semibold text-lg flex items-center gap-2"><FaUserTie className="text-blue-400" /> Your Profile</h3>
                      <div className="text-zinc-700 dark:text-zinc-200 text-base ml-2">
                        <div>Name: {report.user_profile?.name}</div>
                        <div>Industry: {report.user_profile?.industry}</div>
                        <div>Experience Level: {report.user_profile?.experience_level}</div>
                        <div>Skills Count: {report.user_profile?.skills_count}</div>
                        <div>Match Score: <span className="font-bold text-blue-600 dark:text-blue-300">{report.match_score}%</span></div>
                      </div>
                    </section>
                    <section>
                      <h3 className="font-semibold text-lg flex items-center gap-2 mt-2"><FaCheckCircle className="text-green-400" /> Benchmark</h3>
                      <div className="text-zinc-700 dark:text-zinc-200 text-base ml-2">
                        {Object.entries(report.benchmark || {}).map(([k, v]) => (
                          <div key={k}><span className="font-medium capitalize">{k.replace(/_/g, ' ')}:</span> {Array.isArray(v) ? v.join(", ") : v+""}</div>
                        ))}
                      </div>
                    </section>
                    <section>
                      <h3 className="font-semibold text-lg flex items-center gap-2 mt-2"><FaLightbulb className="text-yellow-400" /> Suggestions</h3>
                      <ul className="list-disc ml-6 text-base text-zinc-700 dark:text-zinc-200">
                        {(report.improvement_suggestions || []).map((s: string, i: number) => (
                          <li key={i}>{s}</li>
                        ))}
                      </ul>
                    </section>
                    <section>
                      <h3 className="font-semibold text-lg flex items-center gap-2 mt-2"><FaUsers className="text-purple-400" /> Similar Professionals</h3>
                      <ul className="ml-2 text-base text-zinc-700 dark:text-zinc-200">
                        {(report.similar_professionals || []).map((p: any, i: number) => (
                          <li key={i} className="mb-1">
                            <span className="font-medium">{p.name}</span> — {p.title} at {p.company} ({p.experience})
                          </li>
                        ))}
                      </ul>
                    </section>
                    <section>
                      <h3 className="font-semibold text-lg flex items-center gap-2 mt-2"><FaChartBar className="text-blue-400" /> Industry Insights</h3>
                      <div className="ml-2 text-base text-zinc-700 dark:text-zinc-200">
                        {Object.entries(report.industry_insights || {}).map(([k, v]) => (
                          <div key={k}><span className="font-medium capitalize">{k.replace(/_/g, ' ')}:</span> {Array.isArray(v) ? v.join(", ") : v+""}</div>
                        ))}
                      </div>
                    </section>
                    <section>
                      <h3 className="font-semibold text-lg flex items-center gap-2 mt-2"><FaLightbulb className="text-pink-400" /> Personalized Recommendations</h3>
                      <div className="ml-2 text-base text-zinc-700 dark:text-zinc-200">
                        {Object.entries(report.recommendations || {}).map(([k, v]) => (
                          <div key={k}><span className="font-medium capitalize">{k.replace(/_/g, ' ')}:</span> {typeof v === 'object' ? JSON.stringify(v) : v+""}</div>
                        ))}
                      </div>
                    </section>
                  </div>
                  <div className="flex justify-end mt-6">
                    <button
                      className="px-5 py-2 rounded-lg bg-blue-500 text-white font-semibold shadow hover:bg-blue-600 transition"
                      onClick={onClose}
                    >Close</button>
                  </div>
                </div>
              </GlassCard>
            </motion.div>
          </Transition.Child>
        </div>
      </Dialog>
    </Transition.Root>
  );
}
