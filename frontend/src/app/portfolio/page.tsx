"use client";
import React from "react";
import GlassCard from "@/components/GlassCard";
import { useCVStore } from "@/store/useCVStore";
import { useRouter } from "next/navigation";

export default function PortfolioPage() {
  const { data } = useCVStore();
  const router = useRouter();

  const handleGoAnalysis = () => router.push("/analysis");

  if (!data) return (
    <GlassCard className="max-w-2xl mx-auto mt-16 p-8 text-center">
      <div className="text-red-600 font-semibold mb-4">No CV data found. Please upload your CV first.</div>
      <button className="px-4 py-2 bg-blue-500 text-white rounded-lg" onClick={() => router.push("/")}>Go Back</button>
    </GlassCard>
  );

  // Modern dashboard: action buttons at the top
  return (
    <GlassCard className="max-w-3xl mx-auto mt-12 p-0 text-center">
      <div className="flex flex-col gap-0">
        <div className="flex flex-row justify-between items-center px-8 pt-8 pb-4 border-b border-indigo-100 dark:border-indigo-800 bg-gradient-to-r from-indigo-50/60 to-purple-50/40 dark:from-zinc-900/60 dark:to-indigo-950/40 rounded-t-2xl">
          <h2 className="text-2xl font-bold text-left">Portfolio Maker</h2>
          <div className="flex gap-3">
            <button className="px-5 py-2 rounded-lg bg-blue-500 text-white font-semibold shadow hover:bg-blue-600 transition" onClick={() => router.push("/")}>Back to Upload</button>
            <button className="px-5 py-2 rounded-lg bg-purple-500 text-white font-semibold shadow hover:bg-purple-600 transition" onClick={handleGoAnalysis}>View Analysis</button>
          </div>
        </div>
        <div className="p-8">
          <div className="mb-6 text-zinc-700 dark:text-zinc-200">
            <p>Welcome to the Portfolio Maker! Here you will soon be able to customize and generate your personal portfolio website based on your CV data.</p>
            <p className="mt-2">(This page is under construction. Stay tuned for more features!)</p>
          </div>
        </div>
      </div>
    </GlassCard>
  );
}
